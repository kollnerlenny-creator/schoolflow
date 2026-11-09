import puppeteer from 'puppeteer';
import path from 'path';

async function capture() {
  console.log('Launching browser for enriched screenshot capture...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set viewport for Laptop (1440x900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  console.log('Navigating to app...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));

  const applyDemoDataScript = () => {
    const el = document.getElementById('app');
    if (el && el._vnode && el._vnode.component) {
      const state = el._vnode.component.setupState;
      state.user = { uid: 'demo123', email: 'lenny@schooly.de', displayName: 'Lenny' };
      state.authLoading = false;
      state.displayName = 'Lenny';
      state.currentClass = '11';
      state.selectedHalfYear = '11/1';

      // Demo subjects with real grades
      state.subjects = [
        {
          id: 'sub-mathe',
          name: 'Mathematik',
          color: '#6366f1',
          isLK: true,
          grades: [
            { id: 'g1', type: 'Klausur', points: 14, semester: '11/1', date: '2026-10-12', name: 'Klausur 1' },
            { id: 'g2', type: 'Sonstige', points: 13, semester: '11/1', date: '2026-10-25', name: 'Mitarbeit' }
          ]
        },
        {
          id: 'sub-physik',
          name: 'Physik',
          color: '#ec4899',
          isLK: true,
          grades: [
            { id: 'g3', type: 'Klausur', points: 13, semester: '11/1', date: '2026-10-18', name: 'Klausur 1' },
            { id: 'g4', type: 'Sonstige', points: 14, semester: '11/1', date: '2026-11-02', name: 'Experiment' }
          ]
        },
        {
          id: 'sub-deutsch',
          name: 'Deutsch',
          color: '#f59e0b',
          isLK: false,
          grades: [
            { id: 'g5', type: 'Klausur', points: 12, semester: '11/1', date: '2026-10-05', name: 'Gedichtsinterpretation' }
          ]
        },
        {
          id: 'sub-englisch',
          name: 'Englisch',
          color: '#10b981',
          isLK: false,
          grades: [
            { id: 'g6', type: 'Klausur', points: 13, semester: '11/1', date: '2026-10-20', name: 'Essay' }
          ]
        },
        {
          id: 'sub-chemie',
          name: 'Chemie',
          color: '#3b82f6',
          isLK: false,
          grades: [
            { id: 'g7', type: 'Klausur', points: 12, semester: '11/1', date: '2026-10-28', name: 'Test 1' }
          ]
        }
      ];

      // Demo tasks for Kalender
      state.tasks = [
        { id: 't1', title: 'Physik LK Klausur vorzubereiten', type: 'Klausur', subjectId: 'sub-physik', date: '2026-11-14', done: false, notes: 'Kapitel 3: Induktion & Schwingungen' },
        { id: 't2', title: 'Mathe Übungsblatt Vektoren', type: 'Hausaufgabe', subjectId: 'sub-mathe', date: '2026-11-10', done: false, notes: 'S. 142 Nr. 4-8' },
        { id: 't3', title: 'Deutsch Lektüre lesen', type: 'Hausaufgabe', subjectId: 'sub-deutsch', date: '2026-11-12', done: true, notes: 'Kapitel 4-6' },
        { id: 't4', title: 'Chemie Laborprotokoll abgeben', type: 'Abgabe', subjectId: 'sub-chemie', date: '2026-11-16', done: false, notes: 'Säure-Base-Titration' }
      ];

      // Friends comparison feature data for Insights
      state.friends = [
        { uid: 'f1', displayName: 'Lukas M.', email: 'lukas@schooly.de', currentClass: '11', photoUrl: '' }
      ];
      state.selectedFriend = { uid: 'f1', displayName: 'Lukas M.', email: 'lukas@schooly.de', currentClass: '11', photoUrl: '' };
      state.comparisonSummary = {
        myOverall: 13.2,
        friendOverall: 12.1,
        myWins: 4,
        friendWins: 1,
        diff: 1.1
      };
      state.comparisonData = [
        { subjectName: 'Mathematik (LK)', myAvg: 14.0, friendAvg: 12.0 },
        { subjectName: 'Physik (LK)', myAvg: 13.5, friendAvg: 11.5 },
        { subjectName: 'Deutsch', myAvg: 12.0, friendAvg: 12.5 },
        { subjectName: 'Englisch', myAvg: 13.0, friendAvg: 12.0 },
        { subjectName: 'Chemie', myAvg: 12.0, friendAvg: 11.0 }
      ];
    }
  };

  console.log('Injecting initial demo state...');
  await page.evaluate(applyDemoDataScript);
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));

  const screenshotsDir = path.resolve('./public/assets');

  // 1. Dashboard Screenshot (Laptop)
  console.log('Capturing Dashboard (Laptop)...');
  await page.evaluate(applyDemoDataScript);
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_dashboard.png') });

  // Mobile Viewport for Phone Screenshots
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));

  // 2. Dashboard Mobile Screenshot
  console.log('Capturing Mobile Dashboard...');
  await page.evaluate(applyDemoDataScript);
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_dashboard_mobile.png') });

  // Switch to Fächer Tab
  console.log('Switching to Fächer tab...');
  await page.evaluate(() => {
    const el = document.getElementById('app');
    if (el && el._vnode && el._vnode.component) {
      el._vnode.component.setupState.currentTab = 'subjects';
    }
  });
  await page.evaluate(applyDemoDataScript);
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_faecher_mobile.png') });

  // Switch to Kalender Tab (Laptop)
  console.log('Switching to Kalender tab (Laptop)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const el = document.getElementById('app');
    if (el && el._vnode && el._vnode.component) {
      el._vnode.component.setupState.currentTab = 'planner';
      el._vnode.component.setupState.plannerTab = 'calendar';
    }
  });
  await page.evaluate(applyDemoDataScript);
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_kalender_laptop.png') });

  // Switch to Insights Tab (Mobile - with Comparison Duell Feature)
  console.log('Switching to Insights tab (Mobile with Comparison Duell)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const el = document.getElementById('app');
    if (el && el._vnode && el._vnode.component) {
      el._vnode.component.setupState.currentTab = 'stats';
    }
  });
  await page.evaluate(applyDemoDataScript);
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_insights_mobile.png') });

  // Switch to ABI Tab (Laptop)
  console.log('Switching to ABI tab (Laptop)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const el = document.getElementById('app');
    if (el && el._vnode && el._vnode.component) {
      el._vnode.component.setupState.currentTab = 'saxon_abitur';
    }
  });
  await page.evaluate(applyDemoDataScript);
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_abi_laptop.png') });

  console.log('All screenshots re-asserted & captured successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
