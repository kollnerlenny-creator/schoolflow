export function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
}

export function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
}

export const TOUR_CHAPTERS = [
    {
        id: 'sync',
        code: '01',
        tag: 'LIVE-SYNC',
        title: 'Ein Konto. Handy und Laptop immer synchron.',
        body: 'Trage eine Note unterwegs in Sekunden ein — und sieh denselben Schnitt, alle Aufgaben und deinen Wochenplan sofort am Laptop.',
        macScreenIndex: 0,
        phoneScreenIndex: 0,
        caption: '01 / 04 · Echtzeit-Sync zwischen Smartphone und Laptop'
    },
    {
        id: 'wunschnote',
        code: '02',
        tag: 'FÄCHER & WUNSCHNOTE',
        title: 'Jede Gewichtung exakt. Zielnote vor der Klausur.',
        body: 'Schriftliche und mündliche Anteile sowie der LK-Faktor greifen halbjahresgenau. Der Wunschnoten-Rechner zeigt dir vorab, welche Punktzahl du brauchst.',
        macScreenIndex: 0,
        phoneScreenIndex: 2,
        caption: '02 / 04 · Fächergewichtung & Wunschnoten-Rechner'
    },
    {
        id: 'kalender',
        code: '03',
        tag: 'STUNDENPLAN & KALENDER',
        title: 'Termine, Wochenplan & Google Kalender vereint.',
        body: 'Behalte Hausaufgaben, Klausuren und die Schulferien aller 16 Bundesländer im Blick — inklusive 1-Klick-Sync in deinen Google Kalender.',
        macScreenIndex: 1,
        phoneScreenIndex: 3,
        caption: '03 / 04 · Stundenplan & Google-Kalender-Sync'
    },
    {
        id: 'abitur',
        code: '04',
        tag: 'ABITUR & PDF-EXPORT',
        title: '40 Kurse, Streichungen & Bestehens-Check ohne Excel.',
        body: 'Automatische Einbringungs-Logik für Block I, P1–P5 Simulation, Prüfung aller 5 Abitur-Kriterien und fertiger PDF-Notenspiegel per Klick.',
        macScreenIndex: 2,
        phoneScreenIndex: 4,
        caption: '04 / 04 · Abitur-Check & PDF-Notenspiegel'
    }
];

export function resolveTourChapter(progress) {
    const p = clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
    let chapterIndex = 0;
    if (p < 0.25) chapterIndex = 0;
    else if (p < 0.50) chapterIndex = 1;
    else if (p < 0.75) chapterIndex = 2;
    else chapterIndex = 3;

    const chapter = TOUR_CHAPTERS[chapterIndex];
    let phoneScreenIndex = chapter.phoneScreenIndex;
    if (chapterIndex === 1 && p < 0.37) {
        phoneScreenIndex = 1;
    }

    return {
        chapterIndex,
        macScreenIndex: chapter.macScreenIndex,
        phoneScreenIndex,
        counterLabel: `Kapitel ${chapter.code} / 04`,
        caption: chapter.caption,
        chapter
    };
}

export function computeWordRevealOpacities(progress, wordCount, minOpacity = 0.28) {
    if (!Number.isFinite(wordCount) || wordCount <= 0) return [];
    const p = clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
    const out = [];
    const span = 1 / wordCount;
    for (let i = 0; i < wordCount; i++) {
        const start = i * span * 0.72;
        const end = Math.min(1, start + span * 2.2);
        const local = end > start ? clamp((p - start) / (end - start), 0, 1) : 1;
        out.push(Number(lerp(minOpacity, 1, local).toFixed(3)));
    }
    return out;
}

export const ABI_CHAPTERS = [
    {
        id: 'kurse',
        code: '01',
        tag: 'BLOCK I & II IM ÜBERBLICK',
        title: 'Alle 40 Halbjahreskurse automatisch gesammelt.',
        body: 'schooly führt deine 11/1 bis 12/2 Punkte zusammen, zählt Leistungskurse doppelt und trennt Block I sauber von den Prüfungen in Block II.',
        phoneScreenIndex: 0,
        caption: '01 / 04 · Abitur-Übersicht & Punktekonto'
    },
    {
        id: 'streichung',
        code: '02',
        tag: 'STREICHUNGEN & UNTERKURSE',
        title: 'Bestmögliche Einbringung auf einen Blick.',
        body: 'Pflichtkurse bleiben fest, schwächere Grundkurse werden automatisch geklammert — inklusive sofortiger Warnung bei Unterkursen unter 5 Punkten.',
        phoneScreenIndex: 1,
        caption: '02 / 04 · Kurs-Einbringung & Streichungs-Check'
    },
    {
        id: 'kriterien',
        code: '03',
        tag: 'P1–P5 SIMULATION',
        title: 'Alle 5 Bestehens-Kriterien live geprüft.',
        body: 'Simuliere deine Prüfungsergebnisse (P1–P5) vorab — vom 200-Punkte-Minimum in Block I über 100 Punkte in Block II bis zu deinem Gesamtschnitt.',
        phoneScreenIndex: 1,
        caption: '03 / 04 · 5 Bestehens-Kriterien & P1–P5 Simulation'
    },
    {
        id: 'pdf',
        code: '04',
        tag: 'PDF-EXPORT',
        title: 'Sauberer Notenspiegel mit einem Klick.',
        body: 'Erstelle jederzeit ein übersichtliches PDF mit allen Fächern, Punkten und deinem aktuellen Schnitt — ideal für Bewerbungen oder Praktika.',
        phoneScreenIndex: 2,
        caption: '04 / 04 · 1-Klick PDF-Notenspiegel Export'
    }
];

export function resolveAbiChapter(progress) {
    const p = clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
    let chapterIndex = 0;
    if (p < 0.25) chapterIndex = 0;
    else if (p < 0.50) chapterIndex = 1;
    else if (p < 0.75) chapterIndex = 2;
    else chapterIndex = 3;

    const chapter = ABI_CHAPTERS[chapterIndex];
    return {
        chapterIndex,
        phoneScreenIndex: chapter.phoneScreenIndex,
        counterLabel: `Schritt ${chapter.code} / 04`,
        caption: chapter.caption,
        chapter
    };
}

