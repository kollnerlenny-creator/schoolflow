import puppeteer from 'puppeteer';
import path from 'path';

async function capture() {
  console.log('Launching browser for updated Schooly screenshot capture...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Helper to seed complete, realistic data before page scripts run via evaluateOnNewDocument
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('sf_build_id', 'schooly-v17');
    localStorage.setItem('sf_last_uid', 'demo123');
    localStorage.setItem('sf_cached_user', JSON.stringify({
      uid: 'demo123',
      email: 'lenny@schooly.de',
      displayName: 'Lenny'
    }));
    localStorage.setItem('sf_user_config_demo123', JSON.stringify({
      userName: 'Lenny',
      schoolStartYear: 2025,
      currentClass: 11,
      gradeSystem: '15',
      onboardingCompleted: true,
      halfYears: ['11/1', '11/2', '12/1', '12/2'],
      saxonP3: 'Deutsch',
      saxonP4: 'Englisch',
      saxonP5: 'Geschichte',
      timetable: {
        mo: ['sub-mathe', 'sub-deutsch', 'sub-physik'],
        di: ['sub-englisch', 'sub-chemie', 'sub-geschichte'],
        mi: ['sub-mathe', 'sub-physik', 'sub-bio'],
        do: ['sub-deutsch', 'sub-englisch', 'sub-info'],
        fr: ['sub-mathe', 'sub-chemie', 'sub-sport'],
        sa: ['sub-mathe', 'sub-physik', 'sub-englisch', 'sub-geschichte'],
        so: []
      }
    }));
  });

  const applyDemoDataScript = () => {
    const el = document.getElementById('app');
    if (el && el._vnode && el._vnode.component) {
      const state = el._vnode.component.setupState;
      state.user = { uid: 'demo123', email: 'lenny@schooly.de', displayName: 'Lenny' };
      state.authLoading = false;
      state.isOnboarding = false;
      state.displayName = 'Lenny';
      state.currentClass = 11;
      state.gradeSystem = '15';
      state.lkBonusActive = true;
      state.selectedHalfYear = '11/1';
      state.halfYears = ['11/1', '11/2', '12/1', '12/2'];

      state.timetable = {
        mo: ['sub-mathe', 'sub-deutsch', 'sub-physik'],
        di: ['sub-englisch', 'sub-chemie', 'sub-geschichte'],
        mi: ['sub-mathe', 'sub-physik', 'sub-bio'],
        do: ['sub-deutsch', 'sub-englisch', 'sub-info'],
        fr: ['sub-mathe', 'sub-chemie', 'sub-sport'],
        sa: ['sub-mathe', 'sub-physik', 'sub-englisch', 'sub-geschichte'],
        so: []
      };

      state.subjects = [
        {
          id: 'sub-mathe',
          name: 'Mathematik',
          color: '#2d694c',
          icon: 'calculator',
          isLK: true,
          examWeight: 50,
          grades: [
            { id: 'g1', type: 'Klausur', points: 14, semester: '11/1', date: '2026-10-12', name: 'Analysis I' },
            { id: 'g2', type: 'Sonstige Leistung', points: 13, semester: '11/1', date: '2026-10-25', name: 'Mitarbeit' },
            { id: 'g2b', type: 'Klausur', points: 14, semester: '11/2', date: '2027-02-18', name: 'Vektoren' }
          ]
        },
        {
          id: 'sub-physik',
          name: 'Physik',
          color: '#4f46e5',
          icon: 'atom',
          isLK: true,
          examWeight: 50,
          grades: [
            { id: 'g3', type: 'Klausur', points: 13, semester: '11/1', date: '2026-10-18', name: 'Elektrodynamik' },
            { id: 'g4', type: 'Sonstige Leistung', points: 14, semester: '11/1', date: '2026-11-02', name: 'Praktikum' },
            { id: 'g4b', type: 'Klausur', points: 13, semester: '11/2', date: '2027-03-04', name: 'Induktion' }
          ]
        },
        {
          id: 'sub-deutsch',
          name: 'Deutsch',
          color: '#d97706',
          icon: 'book-open',
          isLK: false,
          examWeight: 50,
          grades: [
            { id: 'g5', type: 'Klausur', points: 12, semester: '11/1', date: '2026-10-05', name: 'Gedichtanalyse' },
            { id: 'g5b', type: 'Sonstige Leistung', points: 13, semester: '11/1', date: '2026-10-29', name: 'Vortrag' }
          ]
        },
        {
          id: 'sub-englisch',
          name: 'Englisch',
          color: '#0891b2',
          icon: 'globe',
          isLK: false,
          examWeight: 50,
          grades: [
            { id: 'g6', type: 'Klausur', points: 13, semester: '11/1', date: '2026-10-20', name: 'Essay Writing' },
            { id: 'g6b', type: 'Sonstige Leistung', points: 14, semester: '11/1', date: '2026-11-06', name: 'Debate' }
          ]
        },
        {
          id: 'sub-chemie',
          name: 'Chemie',
          color: '#2563eb',
          icon: 'flask-conical',
          isLK: false,
          examWeight: 40,
          grades: [
            { id: 'g7', type: 'Klausur', points: 12, semester: '11/1', date: '2026-10-28', name: 'Reaktionskinetik' },
            { id: 'g7b', type: 'Sonstige Leistung', points: 12, semester: '11/1', date: '2026-11-08', name: 'Laborprotokoll' }
          ]
        },
        {
          id: 'sub-geschichte',
          name: 'Geschichte',
          color: '#b45309',
          icon: 'landmark',
          isLK: false,
          examWeight: 40,
          grades: [
            { id: 'g8', type: 'Klausur', points: 13, semester: '11/1', date: '2026-10-15', name: 'Quellenanalyse' }
          ]
        },
        {
          id: 'sub-info',
          name: 'Informatik',
          color: '#7c3aed',
          icon: 'cpu',
          isLK: false,
          examWeight: 50,
          grades: [
            { id: 'g9', type: 'Sonstige Leistung', points: 15, semester: '11/1', date: '2026-11-04', name: 'Algorithmen' }
          ]
        },
        {
          id: 'sub-bio',
          name: 'Biologie',
          color: '#16a34a',
          icon: 'leaf',
          isLK: false,
          examWeight: 40,
          grades: [
            { id: 'g10', type: 'Klausur', points: 11, semester: '11/1', date: '2026-10-22', name: 'Zellbiologie' }
          ]
        }
      ];

      // Build dates dynamically around current date (or fixed 2026-11-14)
      const today = new Date();
      const fmtOffset = (days) => {
        const d = new Date(today);
        d.setDate(d.getDate() + days);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };

      state.tasks = [
        { id: 't1', title: 'Induktion & Schwingungen lernen', type: 'Klausur', subjectId: 'sub-physik', date: fmtOffset(3), done: false, notes: 'Kapitel 3 & Formelsammlung' },
        { id: 't2', title: 'Vektorrechnung Übungsblatt', type: 'Hausaufgabe', subjectId: 'sub-mathe', date: fmtOffset(0), done: false, notes: 'S. 142 Nr. 4-8' },
        { id: 't3', title: 'Vokabeltest Unit 4', type: 'Test', subjectId: 'sub-englisch', date: fmtOffset(5), done: false, notes: 'Globalization & Media' },
        { id: 't4', title: 'Gedichtsvergleich Gliederung', type: 'Hausaufgabe', subjectId: 'sub-deutsch', date: fmtOffset(1), done: false, notes: 'Epoche Romantik' },
        { id: 't5', title: 'Titration Auswertung', type: 'Hausaufgabe', subjectId: 'sub-chemie', date: fmtOffset(6), done: false, notes: 'Säure-Base-Reaktion' },
        { id: 't6', title: 'Quelleninterpretation Weimar', type: 'Klausur', subjectId: 'sub-geschichte', date: fmtOffset(9), done: false, notes: 'Arbeitsblätter wiederholen' }
      ];

      // Friends & Comparison Data (computed from friendSubjectsLoaded!)
      const lukas = { uid: 'f1', displayName: 'Lukas M.', email: 'lukas@schooly.de', currentClass: 11, photoUrl: '' };
      const mia = { uid: 'f2', displayName: 'Mia K.', email: 'mia@schooly.de', currentClass: 11, photoUrl: '' };
      state.friends = [lukas, mia];
      state.selectedFriend = lukas;
      state.friendSubjectsLoaded = [
        { id: 'fs1', name: 'Mathematik', examWeight: 50, grades: [{ points: 12, semester: '11/1', type: 'Klausur' }] },
        { id: 'fs2', name: 'Physik', examWeight: 50, grades: [{ points: 11, semester: '11/1', type: 'Klausur' }] },
        { id: 'fs3', name: 'Deutsch', examWeight: 50, grades: [{ points: 13, semester: '11/1', type: 'Klausur' }] },
        { id: 'fs4', name: 'Englisch', examWeight: 50, grades: [{ points: 12, semester: '11/1', type: 'Klausur' }] },
        { id: 'fs5', name: 'Chemie', examWeight: 40, grades: [{ points: 11, semester: '11/1', type: 'Klausur' }] },
        { id: 'fs6', name: 'Geschichte', examWeight: 40, grades: [{ points: 12, semester: '11/1', type: 'Klausur' }] }
      ];

      // ABI state (populated cleanly for Saxon Abitur view)
      state.saxonSchoolType = 'Allgemeinbildendes Gymnasium';
      state.saxonP3 = 'Deutsch';
      state.saxonP4 = 'Englisch';
      state.saxonP5 = 'Geschichte';
      state.saxonActiveSubTab = 'calculator';
      state.examScores = { P1: 14, P2: 13, P3: 12, P4: 13, P5: 14 };
      state.saxonSimulatedGrades = {
        'Mathematik|11/1': 14, 'Mathematik|11/2': 14, 'Mathematik|12/1': 13, 'Mathematik|12/2': 14,
        'Physik|11/1': 13, 'Physik|11/2': 13, 'Physik|12/1': 14, 'Physik|12/2': 13,
        'Deutsch|11/1': 12, 'Deutsch|11/2': 12, 'Deutsch|12/1': 13, 'Deutsch|12/2': 12,
        'Englisch|11/1': 13, 'Englisch|11/2': 13, 'Englisch|12/1': 14, 'Englisch|12/2': 13,
        'Chemie|11/1': 12, 'Chemie|11/2': 12, 'Chemie|12/1': 12, 'Chemie|12/2': 13,
        'Geschichte|11/1': 13, 'Geschichte|11/2': 13, 'Geschichte|12/1': 13, 'Geschichte|12/2': 14,
        'Informatik|11/1': 15, 'Informatik|11/2': 14, 'Informatik|12/1': 14, 'Informatik|12/2': 15,
        'Biologie|11/1': 11, 'Biologie|11/2': 12, 'Biologie|12/1': 12, 'Biologie|12/2': 12
      };
    }
  };

  const waitReady = async () => {
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    });
    await new Promise(r => setTimeout(r, 700));
  };

  const screenshotsDir = path.resolve('./public/assets');

  // 1. Laptop Dashboard (1440x900)
  console.log('1/7 Capturing Laptop Dashboard...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(applyDemoDataScript);
  await waitReady();
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_dashboard.png') });

  // 2. Mobile Dashboard (390x844)
  console.log('2/7 Capturing Mobile Dashboard...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(applyDemoDataScript);
  await waitReady();
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_dashboard_mobile.png') });

  // 3. Mobile Fächer & Noten (390x844)
  console.log('3/7 Capturing Mobile Fächer...');
  await page.evaluate(() => {
    const state = document.getElementById('app')._vnode.component.setupState;
    state.currentTab = 'subjects';
    state.selectedSubject = null;
  });
  await waitReady();
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_faecher_mobile.png') });

  // 4. Laptop Kalender (1440x900)
  console.log('4/7 Capturing Laptop Kalender...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const state = document.getElementById('app')._vnode.component.setupState;
    state.currentTab = 'planner';
    state.plannerTab = 'calendar';
    state.calendarViewMode = 'month';
    const today = new Date();
    state.selectedCalendarDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  await waitReady();
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_kalender_laptop.png') });

  // 5. Mobile Insights Vergleich / Duell (390x844)
  console.log('5/7 Capturing Mobile Insights (Vergleich Duell)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const state = document.getElementById('app')._vnode.component.setupState;
    state.currentTab = 'stats';
    state.insightsSubTab = 'compare';
  });
  await waitReady();
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_insights_mobile.png') });

  // 6. Laptop Insights Diagramme (1440x900)
  console.log('6/7 Capturing Laptop Insights (Diagramme)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const state = document.getElementById('app')._vnode.component.setupState;
    state.currentTab = 'stats';
    state.insightsSubTab = 'charts';
  });
  await new Promise(r => setTimeout(r, 900));
  await waitReady();
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_insights_charts_laptop.png') });

  // 7. Laptop ABI-Rechner (1440x900)
  console.log('7/7 Capturing Laptop ABI-Rechner...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const state = document.getElementById('app')._vnode.component.setupState;
    state.currentTab = 'abitur';
    state.saxonActiveSubTab = 'calculator';
  });
  await waitReady();
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_abi_laptop.png') });

  console.log('All 7 screenshots captured cleanly!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
