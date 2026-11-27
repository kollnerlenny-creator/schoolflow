// sync-engine.js — Durable Offline Outbox & Deterministic Multi-Device Sync Engine for Schooly

const PENDING_OPS_KEY_PREFIX = 'sf_pending_ops_';

export function getDefaultStorage() {
    try {
        if (typeof localStorage !== 'undefined') return localStorage;
    } catch (_) {}
    return null;
}

export function generateStableId(prefix = 'id') {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
    } catch (_) {}
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function sanitizeFirestoreValue(val) {
    if (val === undefined) return undefined;
    if (val === null) return null;
    if (typeof val === 'number') {
        return Number.isFinite(val) ? val : null;
    }
    if (typeof val !== 'object') return val;
    if (val instanceof Date) return val.toISOString();
    if (Array.isArray(val)) {
        const out = [];
        for (let i = 0; i < val.length; i++) {
            const sanitized = sanitizeFirestoreValue(val[i]);
            if (sanitized !== undefined) out.push(sanitized);
        }
        return out;
    }
    const out = {};
    const keys = Object.keys(val);
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const v = sanitizeFirestoreValue(val[k]);
        if (v !== undefined) out[k] = v;
    }
    return out;
}

function deepClone(val) {
    if (val === null || typeof val !== 'object') return val;
    if (Array.isArray(val)) return val.map(deepClone);
    const out = {};
    for (const k of Object.keys(val)) {
        out[k] = deepClone(val[k]);
    }
    return out;
}

export function readPendingOps(uid, storage = getDefaultStorage()) {
    if (!uid || !storage) return [];
    try {
        const raw = storage.getItem(PENDING_OPS_KEY_PREFIX + uid);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
        return [];
    }
}

export function writePendingOps(uid, ops, storage = getDefaultStorage()) {
    if (!uid || !storage) return false;
    try {
        if (!ops || ops.length === 0) {
            storage.removeItem(PENDING_OPS_KEY_PREFIX + uid);
        } else {
            storage.setItem(PENDING_OPS_KEY_PREFIX + uid, JSON.stringify(ops));
        }
        return true;
    } catch (_) {
        return false;
    }
}

export function enqueuePendingOp(uid, op, storage = getDefaultStorage()) {
    if (!uid || !op || !op.opType || !op.key) return null;
    const ops = readPendingOps(uid, storage);
    const now = Date.now();
    const normalizedOp = sanitizeFirestoreValue({
        ...op,
        opId: op.opId || generateStableId('op'),
        updatedAt: typeof op.updatedAt === 'number' ? op.updatedAt : now
    });

    let filtered = ops.filter((existing) => existing && existing.key !== normalizedOp.key);

    // If deleting a subject, discard earlier pending mutations for that same subject
    if (normalizedOp.opType === 'delete_subject') {
        filtered = filtered.filter((existing) => !(
            existing.collName === normalizedOp.collName &&
            existing.subjectId === normalizedOp.subjectId &&
            (
                existing.opType === 'upsert_subject' ||
                existing.opType === 'upsert_grade' ||
                existing.opType === 'delete_grade' ||
                existing.opType === 'set_report_card_grade'
            )
        ));
    }

    // Coalesce grade upsert vs delete on the same grade ID
    if (normalizedOp.opType === 'delete_grade' && normalizedOp.gradeId) {
        const upsertKey = `grade:${normalizedOp.collName}:${normalizedOp.subjectId}:${normalizedOp.gradeId}`;
        filtered = filtered.filter((existing) => existing.key !== upsertKey);
    } else if (normalizedOp.opType === 'upsert_grade' && normalizedOp.gradeId) {
        const deleteKey = `grade:${normalizedOp.collName}:${normalizedOp.subjectId}:${normalizedOp.gradeId}`;
        filtered = filtered.filter((existing) => existing.key !== deleteKey);
    }

    // Coalesce task upsert vs delete on same task ID
    if (normalizedOp.opType === 'delete_task' && normalizedOp.taskId) {
        filtered = filtered.filter((existing) => existing.key !== `task:${normalizedOp.taskId}`);
    } else if (normalizedOp.opType === 'upsert_task' && normalizedOp.taskId) {
        filtered = filtered.filter((existing) => existing.key !== `task:${normalizedOp.taskId}`);
    }

    filtered.push(normalizedOp);
    writePendingOps(uid, filtered, storage);
    return normalizedOp;
}

export function removePendingOpsByAck(uid, ackPairs, storage = getDefaultStorage()) {
    if (!uid || !Array.isArray(ackPairs) || ackPairs.length === 0) return;
    const ackMap = new Map(ackPairs.map((pair) => [pair.key, pair.opId]));
    const current = readPendingOps(uid, storage);
    const next = current.filter((op) => {
        if (!op || !ackMap.has(op.key)) return true;
        // Only remove if no newer edit overwrote this key while the flush was in flight
        return op.opId !== ackMap.get(op.key);
    });
    writePendingOps(uid, next, storage);
}

export function gradeMatchesFallback(grade, fallback) {
    if (!grade || !fallback) return false;
    if (fallback.id && grade.id && grade.id === fallback.id) return true;
    const pointsMatch = fallback.points !== undefined && fallback.points !== null
        ? Number(grade.points) === Number(fallback.points)
        : true;
    const dateMatch = !fallback.date || grade.date === fallback.date;
    const typeMatch = !fallback.type || grade.type === fallback.type;
    const labelMatch = (grade.label || '').trim() === (fallback.label || '').trim();
    return Boolean(pointsMatch && dateMatch && (labelMatch || typeMatch));
}

export function mergeGradesWithOps(baseGrades = [], subjectOps = []) {
    const grades = Array.isArray(baseGrades) ? deepClone(baseGrades) : [];
    const sortedOps = [...subjectOps].sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));

    for (const op of sortedOps) {
        if (op.opType === 'upsert_grade' && op.grade) {
            const gCopy = deepClone(op.grade);
            const idx = grades.findIndex((g) => g && g.id && gCopy.id && g.id === gCopy.id);
            if (idx !== -1) {
                grades[idx] = gCopy;
            } else {
                grades.push(gCopy);
            }
        } else if (op.opType === 'delete_grade') {
            let removed = false;
            const nextGrades = grades.filter((g) => {
                if (removed) return true;
                if (op.gradeId && g && g.id && g.id === op.gradeId) {
                    removed = true;
                    return false;
                }
                if (op.matchFallback && gradeMatchesFallback(g, op.matchFallback)) {
                    removed = true;
                    return false;
                }
                return true;
            });
            grades.length = 0;
            grades.push(...nextGrades);
        }
    }
    return grades;
}

export function mergeReportCardWithOps(baseReportCard = {}, subjectOps = []) {
    const rc = (baseReportCard && typeof baseReportCard === 'object') ? deepClone(baseReportCard) : {};
    const sortedOps = [...subjectOps].sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
    for (const op of sortedOps) {
        if (op.opType === 'set_report_card_grade' && op.halfYearKey) {
            if (op.points === null || op.points === undefined) {
                delete rc[op.halfYearKey];
            } else {
                rc[op.halfYearKey] = op.points;
            }
        }
    }
    return rc;
}

export function mergeSubjectsWithPendingOps(incomingSubjects = [], pendingOps = [], collName = 'subjects') {
    const cloned = Array.isArray(incomingSubjects) ? deepClone(incomingSubjects) : [];
    const relevantOps = (Array.isArray(pendingOps) ? pendingOps : [])
        .filter((op) => op && op.collName === collName)
        .sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));

    if (relevantOps.length === 0) return cloned;

    const byId = new Map();
    for (const sub of cloned) {
        if (sub && sub.id) byId.set(sub.id, sub);
    }

    // 1. Apply subject creations/updates
    for (const op of relevantOps) {
        if (op.opType === 'upsert_subject' && op.subjectId && op.data) {
            const existing = byId.get(op.subjectId);
            if (existing) {
                byId.set(op.subjectId, {
                    ...existing,
                    ...deepClone(op.data),
                    id: op.subjectId,
                    grades: Array.isArray(existing.grades) ? existing.grades : (op.data.grades || []),
                    reportCardGrades: (existing.reportCardGrades && typeof existing.reportCardGrades === 'object')
                        ? existing.reportCardGrades
                        : (op.data.reportCardGrades || {})
                });
            } else {
                byId.set(op.subjectId, {
                    grades: [],
                    reportCardGrades: {},
                    examWeightByHalfYear: {},
                    ...deepClone(op.data),
                    id: op.subjectId
                });
            }
        }
    }

    // 2. Group grade and report card ops per subject
    const opsBySubject = new Map();
    for (const op of relevantOps) {
        if (
            op.subjectId &&
            (op.opType === 'upsert_grade' || op.opType === 'delete_grade' || op.opType === 'set_report_card_grade')
        ) {
            if (!opsBySubject.has(op.subjectId)) opsBySubject.set(op.subjectId, []);
            opsBySubject.get(op.subjectId).push(op);
        }
    }

    for (const [subjectId, subOps] of opsBySubject.entries()) {
        const sub = byId.get(subjectId);
        if (!sub) continue;
        sub.grades = mergeGradesWithOps(sub.grades || [], subOps);
        sub.reportCardGrades = mergeReportCardWithOps(sub.reportCardGrades || {}, subOps);
    }

    // 3. Apply subject deletions
    for (const op of relevantOps) {
        if (op.opType === 'delete_subject' && op.subjectId) {
            byId.delete(op.subjectId);
        }
    }

    return Array.from(byId.values());
}

export function mergeTasksWithPendingOps(incomingTasks = [], pendingOps = []) {
    const cloned = Array.isArray(incomingTasks) ? deepClone(incomingTasks) : [];
    const relevantOps = (Array.isArray(pendingOps) ? pendingOps : [])
        .filter((op) => op && (op.opType === 'upsert_task' || op.opType === 'delete_task'))
        .sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));

    if (relevantOps.length === 0) return cloned;

    const byId = new Map();
    for (const t of cloned) {
        if (t && t.id) byId.set(t.id, t);
    }

    for (const op of relevantOps) {
        if (op.opType === 'upsert_task' && op.taskId && op.data) {
            const existing = byId.get(op.taskId) || {};
            byId.set(op.taskId, {
                ...existing,
                ...deepClone(op.data),
                id: op.taskId
            });
        } else if (op.opType === 'delete_task' && op.taskId) {
            byId.delete(op.taskId);
        }
    }

    return Array.from(byId.values());
}

export function mergeConfigWithPendingOps(incomingConfig = {}, pendingOps = []) {
    const base = (incomingConfig && typeof incomingConfig === 'object') ? deepClone(incomingConfig) : {};
    const relevantOps = (Array.isArray(pendingOps) ? pendingOps : [])
        .filter((op) => op && op.opType === 'patch_config' && op.data)
        .sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));

    for (const op of relevantOps) {
        const patch = deepClone(op.data);
        if (patch.timetable && base.timetable) {
            base.timetable = { ...base.timetable, ...patch.timetable };
            delete patch.timetable;
        }
        Object.assign(base, patch);
    }
    return base;
}

export function mergeExamScoresWithPendingOps(incomingScores = {}, pendingOps = []) {
    const base = (incomingScores && typeof incomingScores === 'object') ? deepClone(incomingScores) : {};
    const relevantOps = (Array.isArray(pendingOps) ? pendingOps : [])
        .filter((op) => op && op.opType === 'set_exam_scores' && op.data)
        .sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));

    for (const op of relevantOps) {
        Object.assign(base, deepClone(op.data));
    }
    return base;
}

const activeFlushPromises = new Map();
const pendingReflushUids = new Set();

export function withTimeout(promise, timeoutMs, label = 'sync-timeout') {
    if (!timeoutMs || timeoutMs <= 0 || !promise || typeof promise.then !== 'function') {
        return Promise.resolve(promise);
    }
    return new Promise((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                const err = new Error(label);
                err.code = 'deadline-exceeded';
                reject(err);
            }
        }, timeoutMs);
        Promise.resolve(promise).then(
            (val) => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    resolve(val);
                }
            },
            (err) => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    reject(err);
                }
            }
        );
    });
}

function classifySyncError(err) {
    const code = String(err?.code || '').toLowerCase();
    const msg = String(err?.message || '').toLowerCase();
    const isAuth = code.includes('unauthenticated') || code.includes('permission-denied') || msg.includes('token');
    const isNetwork = !isAuth && (
        code.includes('unavailable') ||
        code.includes('deadline-exceeded') ||
        code.includes('aborted') ||
        code.includes('cancelled') ||
        msg.includes('offline') ||
        msg.includes('network') ||
        msg.includes('timeout') ||
        msg.includes('failed to get document')
    );
    return { isAuth, isNetwork };
}

export async function flushPendingOpsQueue(uid, deps) {
    if (!uid || !deps) return { flushed: 0, remaining: readPendingOps(uid, deps?.storage).length, deferred: 0, hadAuthError: false, hadNetworkError: false };
    const storage = deps.storage || getDefaultStorage();
    if (deps.isOnline && !deps.isOnline()) {
        return { flushed: 0, remaining: readPendingOps(uid, storage).length, deferred: readPendingOps(uid, storage).length, hadAuthError: false, hadNetworkError: true };
    }
    if (deps.getCurrentUid && deps.getCurrentUid() !== uid) {
        return { flushed: 0, remaining: readPendingOps(uid, storage).length, deferred: readPendingOps(uid, storage).length, hadAuthError: true, hadNetworkError: false };
    }

    if (activeFlushPromises.has(uid)) {
        pendingReflushUids.add(uid);
        return activeFlushPromises.get(uid);
    }

    const readTimeoutMs = typeof deps.readTimeoutMs === 'number' ? deps.readTimeoutMs : 15000;
    const writeTimeoutMs = typeof deps.writeTimeoutMs === 'number' ? deps.writeTimeoutMs : 15000;

    const runner = (async () => {
        let totalFlushed = 0;
        let deferredCount = 0;
        let hadAuthError = false;
        let hadNetworkError = false;

        do {
            pendingReflushUids.delete(uid);
            const ops = readPendingOps(uid, storage);
            if (ops.length === 0) break;

            const sortedOps = [...ops].sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
            const { db, doc, setDoc, deleteDoc, getDoc, getDocFromServer } = deps;

            // 1. Flush subject creations/updates first (so grade edits never hit not-found)
            for (const op of sortedOps) {
                if (op.opType !== 'upsert_subject' && op.opType !== 'delete_subject') continue;
                if (deps.getCurrentUid && deps.getCurrentUid() !== uid) break;
                const ref = doc(db, 'users', uid, op.collName || 'subjects', op.subjectId);
                try {
                    if (op.opType === 'upsert_subject') {
                        await withTimeout(setDoc(ref, sanitizeFirestoreValue(op.data), { merge: true }), writeTimeoutMs, 'subject-write-timeout');
                    } else {
                        await withTimeout(deleteDoc(ref), writeTimeoutMs, 'subject-delete-timeout');
                    }
                    removePendingOpsByAck(uid, [{ key: op.key, opId: op.opId }], storage);
                    totalFlushed++;
                } catch (err) {
                    deferredCount++;
                    const cls = classifySyncError(err);
                    if (cls.isAuth) hadAuthError = true;
                    if (cls.isNetwork) hadNetworkError = true;
                    console.warn('[Schooly Sync] subject op deferred:', op.opType, err?.code || err?.message || err);
                }
            }

            // 2. Group and flush grade / report card mutations per subject cleanly against fresh server state
            const gradeGroups = new Map();
            for (const op of sortedOps) {
                if (
                    op.opType === 'upsert_grade' ||
                    op.opType === 'delete_grade' ||
                    op.opType === 'set_report_card_grade'
                ) {
                    const groupKey = `${op.collName || 'subjects'}::${op.subjectId}`;
                    if (!gradeGroups.has(groupKey)) gradeGroups.set(groupKey, []);
                    gradeGroups.get(groupKey).push(op);
                }
            }

            for (const [groupKey, groupOps] of gradeGroups.entries()) {
                if (deps.getCurrentUid && deps.getCurrentUid() !== uid) break;
                const [collName, subjectId] = groupKey.split('::');
                const ref = doc(db, 'users', uid, collName, subjectId);
                try {
                    let serverData = {};
                    let snap = null;
                    if (getDocFromServer) {
                        snap = await withTimeout(getDocFromServer(ref), readTimeoutMs, 'subject-read-timeout');
                    } else if (getDoc) {
                        snap = await withTimeout(getDoc(ref), readTimeoutMs, 'subject-read-timeout');
                    }
                    if (snap && snap.exists && snap.exists()) {
                        serverData = snap.data() || {};
                    } else if (typeof deps.getLocalSubjectFallback === 'function') {
                        const localSub = deps.getLocalSubjectFallback(subjectId);
                        if (localSub) serverData = localSub;
                    }

                    const payload = {};
                    const hasGradeOp = groupOps.some((o) => o.opType === 'upsert_grade' || o.opType === 'delete_grade');
                    const hasReportCardOp = groupOps.some((o) => o.opType === 'set_report_card_grade');

                    if (hasGradeOp) {
                        payload.grades = sanitizeFirestoreValue(mergeGradesWithOps(serverData.grades || [], groupOps));
                    }
                    if (hasReportCardOp) {
                        payload.reportCardGrades = sanitizeFirestoreValue(mergeReportCardWithOps(serverData.reportCardGrades || {}, groupOps));
                    }

                    if (!snap || (snap.exists && !snap.exists())) {
                        // Ensure required baseline fields if doc didn't exist yet on server
                        if (serverData.name) payload.name = serverData.name;
                        if (typeof serverData.isLK === 'boolean') payload.isLK = serverData.isLK;
                        if (serverData.color) payload.color = serverData.color;
                        if (typeof serverData.examWeight === 'number') payload.examWeight = serverData.examWeight;
                        if (serverData.abiType) payload.abiType = serverData.abiType;
                        if (serverData.icon) payload.icon = serverData.icon;
                        if (serverData.examWeightByHalfYear) payload.examWeightByHalfYear = serverData.examWeightByHalfYear;
                    }

                    await withTimeout(setDoc(ref, sanitizeFirestoreValue(payload), { merge: true }), writeTimeoutMs, 'grade-write-timeout');
                    removePendingOpsByAck(uid, groupOps.map((o) => ({ key: o.key, opId: o.opId })), storage);
                    totalFlushed += groupOps.length;
                } catch (err) {
                    deferredCount += groupOps.length;
                    const cls = classifySyncError(err);
                    if (cls.isAuth) hadAuthError = true;
                    if (cls.isNetwork) hadNetworkError = true;
                    console.warn('[Schooly Sync] grade/rc group deferred:', subjectId, err?.code || err?.message || err);
                }
            }

            // 3. Flush tasks
            for (const op of sortedOps) {
                if (op.opType !== 'upsert_task' && op.opType !== 'delete_task') continue;
                if (deps.getCurrentUid && deps.getCurrentUid() !== uid) break;
                const ref = doc(db, 'users', uid, 'tasks', op.taskId);
                try {
                    if (op.opType === 'upsert_task') {
                        await withTimeout(setDoc(ref, sanitizeFirestoreValue(op.data), { merge: true }), writeTimeoutMs, 'task-write-timeout');
                    } else {
                        await withTimeout(deleteDoc(ref), writeTimeoutMs, 'task-delete-timeout');
                    }
                    removePendingOpsByAck(uid, [{ key: op.key, opId: op.opId }], storage);
                    totalFlushed++;
                } catch (err) {
                    deferredCount++;
                    const cls = classifySyncError(err);
                    if (cls.isAuth) hadAuthError = true;
                    if (cls.isNetwork) hadNetworkError = true;
                    console.warn('[Schooly Sync] task op deferred:', op.taskId, err?.code || err?.message || err);
                }
            }

            // 4. Flush config patches
            const configOps = sortedOps.filter((op) => op.opType === 'patch_config');
            if (configOps.length > 0 && (!deps.getCurrentUid || deps.getCurrentUid() === uid)) {
                try {
                    const mergedPatch = {};
                    for (const op of configOps) {
                        const patch = sanitizeFirestoreValue(op.data);
                        if (patch.timetable && mergedPatch.timetable) {
                            mergedPatch.timetable = { ...mergedPatch.timetable, ...patch.timetable };
                            delete patch.timetable;
                        }
                        Object.assign(mergedPatch, patch);
                    }
                    await withTimeout(setDoc(doc(db, 'users', uid, 'settings', 'config'), sanitizeFirestoreValue(mergedPatch), { merge: true }), writeTimeoutMs, 'config-write-timeout');
                    removePendingOpsByAck(uid, configOps.map((o) => ({ key: o.key, opId: o.opId })), storage);
                    totalFlushed += configOps.length;
                } catch (err) {
                    deferredCount += configOps.length;
                    const cls = classifySyncError(err);
                    if (cls.isAuth) hadAuthError = true;
                    if (cls.isNetwork) hadNetworkError = true;
                    console.warn('[Schooly Sync] config patch deferred:', err?.code || err?.message || err);
                }
            }

            // 5. Flush exam scores
            const examOps = sortedOps.filter((op) => op.opType === 'set_exam_scores');
            if (examOps.length > 0 && (!deps.getCurrentUid || deps.getCurrentUid() === uid)) {
                try {
                    const latestExamOp = examOps[examOps.length - 1];
                    await withTimeout(setDoc(doc(db, 'users', uid, 'abitur', 'scores'), sanitizeFirestoreValue(latestExamOp.data), { merge: true }), writeTimeoutMs, 'exam-write-timeout');
                    removePendingOpsByAck(uid, examOps.map((o) => ({ key: o.key, opId: o.opId })), storage);
                    totalFlushed += examOps.length;
                } catch (err) {
                    deferredCount += examOps.length;
                    const cls = classifySyncError(err);
                    if (cls.isAuth) hadAuthError = true;
                    if (cls.isNetwork) hadNetworkError = true;
                    console.warn('[Schooly Sync] exam scores deferred:', err?.code || err?.message || err);
                }
            }
        } while (pendingReflushUids.has(uid));

        return {
            flushed: totalFlushed,
            remaining: readPendingOps(uid, storage).length,
            deferred: deferredCount,
            hadAuthError,
            hadNetworkError
        };
    })();

    activeFlushPromises.set(uid, runner);
    try {
        return await runner;
    } finally {
        activeFlushPromises.delete(uid);
    }
}

export function filterIncomingFriendRequests(notifications = []) {
    if (!Array.isArray(notifications)) return [];
    return notifications
        .filter((n) => n && n.type === 'friend_request' && !n.responded)
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export function countNotificationBadges(notifications = []) {
    if (!Array.isArray(notifications)) return 0;
    const ids = new Set();
    for (const n of notifications) {
        if (!n || !n.id) continue;
        if (!n.read || (n.type === 'friend_request' && !n.responded)) {
            ids.add(n.id);
        }
    }
    return ids.size;
}

export function detectNewFriendNotifications(nextList = [], seenIds = new Set(), isInitialLoad = false) {
    if (!Array.isArray(nextList) || isInitialLoad) return [];
    const out = [];
    for (const n of nextList) {
        if (!n || !n.id || seenIds.has(n.id)) continue;
        if (n.type === 'friend_request' && !n.responded) {
            out.push(n);
        } else if (n.type === 'friend_accepted' && !n.read) {
            out.push(n);
        }
    }
    return out;
}

