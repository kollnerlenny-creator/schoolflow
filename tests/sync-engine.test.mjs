import test from 'node:test';
import assert from 'node:assert/strict';
import {
    sanitizeFirestoreValue,
    generateStableId,
    readPendingOps,
    writePendingOps,
    enqueuePendingOp,
    removePendingOpsByAck,
    mergeGradesWithOps,
    mergeReportCardWithOps,
    mergeSubjectsWithPendingOps,
    mergeTasksWithPendingOps,
    mergeConfigWithPendingOps,
    mergeExamScoresWithPendingOps,
    flushPendingOpsQueue
} from '../src/sync-engine.js';

function createMemoryStorage() {
    const map = new Map();
    return {
        getItem(key) {
            return map.has(key) ? map.get(key) : null;
        },
        setItem(key, value) {
            map.set(key, String(value));
        },
        removeItem(key) {
            map.delete(key);
        },
        clear() {
            map.clear();
        }
    };
}

test('sanitizeFirestoreValue strips undefined deeply and normalizes non-finite numbers and Dates', () => {
    const d = new Date('2026-11-26T10:00:00.000Z');
    const input = {
        name: 'Mathe',
        bad: undefined,
        nanVal: Number.NaN,
        infVal: Number.POSITIVE_INFINITY,
        zero: 0,
        createdAt: d,
        nested: {
            keep: true,
            drop: undefined
        },
        arr: [1, undefined, { a: 2, b: undefined }, Number.NEGATIVE_INFINITY]
    };

    const sanitized = sanitizeFirestoreValue(input);
    assert.deepEqual(sanitized, {
        name: 'Mathe',
        nanVal: null,
        infVal: null,
        zero: 0,
        createdAt: '2026-11-26T10:00:00.000Z',
        nested: { keep: true },
        arr: [1, { a: 2 }, null]
    });
    assert.equal('bad' in sanitized, false);
});

test('generateStableId returns distinct non-empty IDs', () => {
    const id1 = generateStableId('g');
    const id2 = generateStableId('g');
    assert.ok(id1 && id1.length > 8);
    assert.notEqual(id1, id2);
});

test('enqueuePendingOp coalesces repeated edits, delete/upsert pairs, and delete_subject cascades', () => {
    const storage = createMemoryStorage();
    const uid = 'user-1';

    const op1 = enqueuePendingOp(uid, {
        key: 'subject:subjects:sub-1',
        opType: 'upsert_subject',
        collName: 'subjects',
        subjectId: 'sub-1',
        data: { name: 'Mathe', grades: [] },
        updatedAt: 100
    }, storage);
    assert.ok(op1.opId);

    enqueuePendingOp(uid, {
        key: 'grade:subjects:sub-1:g-1',
        opType: 'upsert_grade',
        collName: 'subjects',
        subjectId: 'sub-1',
        gradeId: 'g-1',
        grade: { id: 'g-1', points: 11, date: '2026-11-20' },
        updatedAt: 200
    }, storage);

    // Edit same grade again -> replaces previous op for same key
    enqueuePendingOp(uid, {
        key: 'grade:subjects:sub-1:g-1',
        opType: 'upsert_grade',
        collName: 'subjects',
        subjectId: 'sub-1',
        gradeId: 'g-1',
        grade: { id: 'g-1', points: 14, date: '2026-11-20' },
        updatedAt: 300
    }, storage);

    let ops = readPendingOps(uid, storage);
    assert.equal(ops.length, 2);
    assert.equal(ops[1].grade.points, 14);

    // Deleting that grade cancels its un-flushed upsert and leaves a delete_grade tombstone
    enqueuePendingOp(uid, {
        key: 'grade-del:subjects:sub-1:g-1',
        opType: 'delete_grade',
        collName: 'subjects',
        subjectId: 'sub-1',
        gradeId: 'g-1',
        updatedAt: 400
    }, storage);

    ops = readPendingOps(uid, storage);
    assert.equal(ops.length, 2);
    assert.equal(ops[1].opType, 'delete_grade');

    // Deleting the parent subject removes all pending ops for sub-1 except delete_subject
    enqueuePendingOp(uid, {
        key: 'rc:subjects:sub-1:12/1',
        opType: 'set_report_card_grade',
        collName: 'subjects',
        subjectId: 'sub-1',
        halfYearKey: '12/1',
        points: 13,
        updatedAt: 450
    }, storage);

    enqueuePendingOp(uid, {
        key: 'subject-del:subjects:sub-1',
        opType: 'delete_subject',
        collName: 'subjects',
        subjectId: 'sub-1',
        updatedAt: 500
    }, storage);

    ops = readPendingOps(uid, storage);
    assert.equal(ops.length, 1);
    assert.equal(ops[0].opType, 'delete_subject');
});

test('removePendingOpsByAck removes matching opId only and preserves newer concurrent edits', () => {
    const storage = createMemoryStorage();
    const uid = 'user-2';

    const opA = enqueuePendingOp(uid, {
        key: 'grade:subjects:s1:g1',
        opType: 'upsert_grade',
        collName: 'subjects',
        subjectId: 's1',
        gradeId: 'g1',
        grade: { id: 'g1', points: 10 },
        updatedAt: 100
    }, storage);

    const opB = enqueuePendingOp(uid, {
        key: 'task:t1',
        opType: 'upsert_task',
        taskId: 't1',
        data: { title: 'Vokabeln', done: false },
        updatedAt: 101
    }, storage);

    // Simulate user editing g1 again while flush was in-flight
    enqueuePendingOp(uid, {
        key: 'grade:subjects:s1:g1',
        opType: 'upsert_grade',
        collName: 'subjects',
        subjectId: 's1',
        gradeId: 'g1',
        grade: { id: 'g1', points: 13 },
        updatedAt: 200
    }, storage);

    removePendingOpsByAck(uid, [
        { key: opA.key, opId: opA.opId },
        { key: opB.key, opId: opB.opId }
    ], storage);

    const remaining = readPendingOps(uid, storage);
    assert.equal(remaining.length, 1);
    assert.equal(remaining[0].key, 'grade:subjects:s1:g1');
    assert.equal(remaining[0].grade.points, 13);
});

test('mergeSubjectsWithPendingOps protects pending grades, report cards, deletes, and new subjects against stale cache/server snapshots', () => {
    const staleIncoming = [
        {
            id: 'sub-math',
            name: 'Mathe',
            grades: [
                { id: 'g-old', points: 9, date: '2026-10-01', type: 'mündlich', label: 'Test' },
                { id: 'g-del', points: 4, date: '2026-10-05', type: 'mündlich', label: 'HÜ' }
            ],
            reportCardGrades: { '11/1': 10 }
        },
        {
            id: 'sub-gone',
            name: 'Kunst',
            grades: []
        }
    ];

    const pendingOps = [
        {
            opId: '1',
            key: 'grade:subjects:sub-math:g-new',
            opType: 'upsert_grade',
            collName: 'subjects',
            subjectId: 'sub-math',
            gradeId: 'g-new',
            grade: { id: 'g-new', points: 15, date: '2026-11-26', type: 'schriftlich', label: 'Klausur' },
            updatedAt: 100
        },
        {
            opId: '2',
            key: 'grade-del:subjects:sub-math:g-del',
            opType: 'delete_grade',
            collName: 'subjects',
            subjectId: 'sub-math',
            gradeId: 'g-del',
            updatedAt: 110
        },
        {
            opId: '3',
            key: 'rc:subjects:sub-math:12/1',
            opType: 'set_report_card_grade',
            collName: 'subjects',
            subjectId: 'sub-math',
            halfYearKey: '12/1',
            points: 14,
            updatedAt: 120
        },
        {
            opId: '4',
            key: 'subject:subjects:sub-new',
            opType: 'upsert_subject',
            collName: 'subjects',
            subjectId: 'sub-new',
            data: { name: 'Informatik', isLK: true },
            updatedAt: 130
        },
        {
            opId: '5',
            key: 'subject-del:subjects:sub-gone',
            opType: 'delete_subject',
            collName: 'subjects',
            subjectId: 'sub-gone',
            updatedAt: 140
        }
    ];

    const merged = mergeSubjectsWithPendingOps(staleIncoming, pendingOps, 'subjects');
    assert.equal(merged.length, 2);

    const math = merged.find((s) => s.id === 'sub-math');
    assert.ok(math);
    assert.deepEqual(math.grades.map((g) => g.id), ['g-old', 'g-new']);
    assert.equal(math.reportCardGrades['11/1'], 10);
    assert.equal(math.reportCardGrades['12/1'], 14);

    const info = merged.find((s) => s.id === 'sub-new');
    assert.ok(info);
    assert.equal(info.name, 'Informatik');
    assert.equal(merged.some((s) => s.id === 'sub-gone'), false);
});

test('mergeTasksWithPendingOps, mergeConfigWithPendingOps, and mergeExamScoresWithPendingOps preserve pending edits', () => {
    const tasks = mergeTasksWithPendingOps(
        [
            { id: 't1', title: 'Alt', done: false },
            { id: 't2', title: 'Weg', done: true }
        ],
        [
            { opId: '1', key: 'task:t1', opType: 'upsert_task', taskId: 't1', data: { done: true }, updatedAt: 10 },
            { opId: '2', key: 'task-del:t2', opType: 'delete_task', taskId: 't2', updatedAt: 11 },
            { opId: '3', key: 'task:t3', opType: 'upsert_task', taskId: 't3', data: { title: 'Neu', done: false }, updatedAt: 12 }
        ]
    );
    assert.deepEqual(tasks, [
        { id: 't1', title: 'Alt', done: true },
        { id: 't3', title: 'Neu', done: false }
    ]);

    const config = mergeConfigWithPendingOps(
        { theme: 'light', timetable: { Mo: ['Mathe'], Di: ['Deutsch'] } },
        [
            { opId: '4', key: 'config:theme', opType: 'patch_config', data: { theme: 'dark' }, updatedAt: 20 },
            { opId: '5', key: 'config:timetable', opType: 'patch_config', data: { timetable: { Mo: ['Physik'] } }, updatedAt: 21 }
        ]
    );
    assert.deepEqual(config, {
        theme: 'dark',
        timetable: { Mo: ['Physik'], Di: ['Deutsch'] }
    });

    const scores = mergeExamScoresWithPendingOps({ abi1: 11 }, [
        { opId: '6', key: 'exam:scores', opType: 'set_exam_scores', data: { abi2: 14 }, updatedAt: 30 }
    ]);
    assert.deepEqual(scores, { abi1: 11, abi2: 14 });
});

test('flushPendingOpsQueue fetches fresh server subject doc and merges local grade without overwriting concurrent cross-device grade', async () => {
    const storage = createMemoryStorage();
    const uid = 'uid-sync';

    // Simulate Firestore in-memory store where Device A already wrote grade g_device_a
    const serverStore = new Map([
        ['users/uid-sync/subjects/sub-1', {
            name: 'Englisch',
            grades: [
                { id: 'g_device_a', points: 12, date: '2026-11-25', type: 'mündlich', label: 'Device A' }
            ],
            reportCardGrades: { '11/1': 11 }
        }]
    ]);

    // Meanwhile Device B locally queued grade g_device_b & config patch
    enqueuePendingOp(uid, {
        key: 'grade:subjects:sub-1:g_device_b',
        opType: 'upsert_grade',
        collName: 'subjects',
        subjectId: 'sub-1',
        gradeId: 'g_device_b',
        grade: { id: 'g_device_b', points: 15, date: '2026-11-26', type: 'schriftlich', label: 'Device B', extra: undefined },
        updatedAt: 200
    }, storage);

    enqueuePendingOp(uid, {
        key: 'rc:subjects:sub-1:12/1',
        opType: 'set_report_card_grade',
        collName: 'subjects',
        subjectId: 'sub-1',
        halfYearKey: '12/1',
        points: 13,
        updatedAt: 210
    }, storage);

    enqueuePendingOp(uid, {
        key: 'config:federalState',
        opType: 'patch_config',
        data: { federalState: 'Bayern', ignored: undefined },
        updatedAt: 220
    }, storage);

    const db = {};
    const doc = (_db, ...segments) => segments.join('/');
    const getDocFromServer = async (ref) => ({
        exists: () => serverStore.has(ref),
        data: () => serverStore.get(ref)
    });
    const setDoc = async (ref, data, opts) => {
        const existing = (opts && opts.merge && serverStore.get(ref)) || {};
        serverStore.set(ref, { ...existing, ...data });
    };
    const deleteDoc = async (ref) => {
        serverStore.delete(ref);
    };

    const result = await flushPendingOpsQueue(uid, {
        db,
        doc,
        setDoc,
        deleteDoc,
        getDocFromServer,
        storage,
        isOnline: () => true,
        getCurrentUid: () => uid
    });

    assert.equal(result.flushed, 3);
    assert.equal(result.remaining, 0);
    assert.deepEqual(readPendingOps(uid, storage), []);

    const finalSubject = serverStore.get('users/uid-sync/subjects/sub-1');
    assert.equal(finalSubject.grades.length, 2);
    assert.deepEqual(finalSubject.grades.map((g) => g.id), ['g_device_a', 'g_device_b']);
    assert.equal('extra' in finalSubject.grades[1], false);
    assert.deepEqual(finalSubject.reportCardGrades, { '11/1': 11, '12/1': 13 });
    assert.deepEqual(serverStore.get('users/uid-sync/settings/config'), { federalState: 'Bayern' });
});

test('flushPendingOpsQueue defers failed network writes safely without losing outbox entries', async () => {
    const storage = createMemoryStorage();
    const uid = 'uid-offline-err';

    enqueuePendingOp(uid, {
        key: 'grade:subjects:sub-1:g-1',
        opType: 'upsert_grade',
        collName: 'subjects',
        subjectId: 'sub-1',
        gradeId: 'g-1',
        grade: { id: 'g-1', points: 14 },
        updatedAt: 100
    }, storage);

    const result = await flushPendingOpsQueue(uid, {
        db: {},
        doc: (_db, ...segments) => segments.join('/'),
        getDocFromServer: async () => {
            throw new Error('unavailable');
        },
        setDoc: async () => {},
        deleteDoc: async () => {},
        storage,
        isOnline: () => true,
        getCurrentUid: () => uid
    });

    assert.equal(result.flushed, 0);
    assert.equal(result.remaining, 1);
    assert.equal(readPendingOps(uid, storage).length, 1);
});

test('flushPendingOpsQueue preserves mid-flight concurrent edits and keeps pending ops when offline', async () => {
    const storage = createMemoryStorage();
    const uid = 'uid-race';

    const op1 = enqueuePendingOp(uid, {
        key: 'task:t1',
        opType: 'upsert_task',
        taskId: 't1',
        data: { title: 'First', done: false },
        updatedAt: 100
    }, storage);

    // Offline -> returns without touching queue
    const offRes = await flushPendingOpsQueue(uid, {
        storage,
        isOnline: () => false,
        getCurrentUid: () => uid
    });
    assert.equal(offRes.flushed, 0);
    assert.equal(offRes.remaining, 1);

    // Online flush where a newer edit on task:t1 arrives while setDoc is in flight
    let wrotePayloads = [];
    const res = await flushPendingOpsQueue(uid, {
        db: {},
        doc: (_db, ...segments) => segments.join('/'),
        setDoc: async (_ref, data) => {
            wrotePayloads.push(data);
            if (wrotePayloads.length === 1) {
                enqueuePendingOp(uid, {
                    key: 'task:t1',
                    opType: 'upsert_task',
                    taskId: 't1',
                    data: { title: 'Updated Mid-Flight', done: true },
                    updatedAt: 200
                }, storage);
            }
        },
        deleteDoc: async () => {},
        getDocFromServer: async () => ({ exists: () => false }),
        storage,
        isOnline: () => true,
        getCurrentUid: () => uid
    });

    // op1 was flushed, newer edit remained in storage (was NOT falsely acked!)
    assert.equal(res.flushed, 1);
    const remaining = readPendingOps(uid, storage);
    assert.equal(remaining.length, 1);
    assert.notEqual(remaining[0].opId, op1.opId);
    assert.equal(remaining[0].data.title, 'Updated Mid-Flight');

    // Clean writePendingOps empty removes key
    writePendingOps(uid, [], storage);
    assert.deepEqual(readPendingOps(uid, storage), []);
});

test('flushPendingOpsQueue times out stalled reads/writes cleanly without deadlocking future flushes', async () => {
    const storage = createMemoryStorage();
    const uid = 'uid-timeout';
    const serverStore = new Map([
        ['users/uid-timeout/subjects/sub-1', {
            name: 'Bio',
            grades: [{ id: 'g-existing', points: 11 }]
        }]
    ]);

    enqueuePendingOp(uid, {
        key: 'grade:subjects:sub-1:g-offline',
        opType: 'upsert_grade',
        collName: 'subjects',
        subjectId: 'sub-1',
        gradeId: 'g-offline',
        grade: { id: 'g-offline', points: 15 },
        updatedAt: 100
    }, storage);

    // 1st attempt: stalled socket (promise never resolves) -> must timeout & release lock!
    const stalledRes = await flushPendingOpsQueue(uid, {
        db: {},
        doc: (_db, ...segments) => segments.join('/'),
        getDocFromServer: () => new Promise(() => {}),
        setDoc: async () => {},
        deleteDoc: async () => {},
        readTimeoutMs: 25,
        writeTimeoutMs: 25,
        storage,
        isOnline: () => true,
        getCurrentUid: () => uid
    });

    assert.equal(stalledRes.flushed, 0);
    assert.equal(stalledRes.remaining, 1);
    assert.equal(stalledRes.hadNetworkError, true);
    assert.equal(readPendingOps(uid, storage).length, 1);

    // 2nd attempt immediately after: network recovered -> succeeds cleanly (not deadlocked!)
    const recoveredRes = await flushPendingOpsQueue(uid, {
        db: {},
        doc: (_db, ...segments) => segments.join('/'),
        getDocFromServer: async (ref) => ({
            exists: () => serverStore.has(ref),
            data: () => serverStore.get(ref)
        }),
        setDoc: async (ref, data) => {
            const prev = serverStore.get(ref) || {};
            serverStore.set(ref, { ...prev, ...data });
        },
        deleteDoc: async () => {},
        readTimeoutMs: 1000,
        writeTimeoutMs: 1000,
        storage,
        isOnline: () => true,
        getCurrentUid: () => uid
    });

    assert.equal(recoveredRes.flushed, 1);
    assert.equal(recoveredRes.remaining, 0);
    assert.deepEqual(
        serverStore.get('users/uid-timeout/subjects/sub-1').grades.map((g) => g.id),
        ['g-existing', 'g-offline']
    );
});

test('flushPendingOpsQueue flags auth errors distinctly so caller can force-refresh token', async () => {
    const storage = createMemoryStorage();
    const uid = 'uid-auth-err';
    enqueuePendingOp(uid, {
        key: 'task:t-auth',
        opType: 'upsert_task',
        taskId: 't-auth',
        data: { title: 'Test' },
        updatedAt: 100
    }, storage);

    const err = new Error('auth expired');
    err.code = 'permission-denied';

    const res = await flushPendingOpsQueue(uid, {
        db: {},
        doc: (_db, ...segments) => segments.join('/'),
        setDoc: async () => { throw err; },
        deleteDoc: async () => {},
        storage,
        isOnline: () => true,
        getCurrentUid: () => uid
    });

    assert.equal(res.flushed, 0);
    assert.equal(res.remaining, 1);
    assert.equal(res.hadAuthError, true);
    assert.equal(res.hadNetworkError, false);
});

