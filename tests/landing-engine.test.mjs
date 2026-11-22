import test from 'node:test';
import assert from 'node:assert/strict';
import {
    clamp,
    lerp,
    resolveTourChapter,
    resolveAbiChapter,
    computeWordRevealOpacities
} from '../public/landing-engine.mjs';

test('clamp & lerp constrain values accurately', () => {
    assert.equal(clamp(-5, 0, 1), 0);
    assert.equal(clamp(1.5, 0, 1), 1);
    assert.equal(clamp(0.42, 0, 1), 0.42);
    assert.equal(lerp(10, 20, 0.5), 15);
    assert.equal(lerp(10, 20, 2), 20);
});

test('resolveTourChapter transitions smoothly across all 4 chapters', () => {
    const s0 = resolveTourChapter(0.05);
    assert.equal(s0.chapterIndex, 0);
    assert.equal(s0.macScreenIndex, 0);
    assert.equal(s0.phoneScreenIndex, 0);

    const s1a = resolveTourChapter(0.30);
    assert.equal(s1a.chapterIndex, 1);
    assert.equal(s1a.phoneScreenIndex, 1);

    const s1b = resolveTourChapter(0.44);
    assert.equal(s1b.chapterIndex, 1);
    assert.equal(s1b.phoneScreenIndex, 2);

    const s2 = resolveTourChapter(0.62);
    assert.equal(s2.chapterIndex, 2);
    assert.equal(s2.macScreenIndex, 1);
    assert.equal(s2.phoneScreenIndex, 3);

    const s3 = resolveTourChapter(0.95);
    assert.equal(s3.chapterIndex, 3);
    assert.equal(s3.macScreenIndex, 2);
    assert.equal(s3.phoneScreenIndex, 4);
});

test('resolveAbiChapter transitions smoothly across all 4 Abitur steps', () => {
    const a0 = resolveAbiChapter(0.08);
    assert.equal(a0.chapterIndex, 0);
    assert.equal(a0.phoneScreenIndex, 0);
    assert.equal(a0.counterLabel, 'Schritt 01 / 04');

    const a1 = resolveAbiChapter(0.35);
    assert.equal(a1.chapterIndex, 1);
    assert.equal(a1.phoneScreenIndex, 1);

    const a2 = resolveAbiChapter(0.60);
    assert.equal(a2.chapterIndex, 2);
    assert.equal(a2.phoneScreenIndex, 1);

    const a3 = resolveAbiChapter(0.90);
    assert.equal(a3.chapterIndex, 3);
    assert.equal(a3.phoneScreenIndex, 2);
    assert.equal(a3.counterLabel, 'Schritt 04 / 04');
});

test('computeWordRevealOpacities progresses monotonically from min to 1', () => {
    const start = computeWordRevealOpacities(0, 10, 0.28);
    const mid = computeWordRevealOpacities(0.5, 10, 0.28);
    const end = computeWordRevealOpacities(1, 10, 0.28);

    assert.equal(start.length, 10);
    assert.equal(start[0], 0.28);
    assert.ok(mid[0] > mid[9]);
    assert.ok(end.every((v) => v === 1));
});

