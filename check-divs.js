import fs from 'fs';
import { JSDOM } from 'jsdom';

let html = fs.readFileSync('./index.html', 'utf-8');
html = html.replace('<!-- 6. STATS -->', '</div> <!-- / Ende ABI-Rechner (currentTab === abitur) -->\n\n                <!-- 6. STATS -->');

const dom = new JSDOM(html);
const document = dom.window.document;

const app = document.querySelector('#app');
console.log("app direct children count:", app.children.length);
for (let i = 0; i < app.children.length; i++) {
  const c = app.children[i];
  console.log(`app[${i}]: tag=${c.tagName}, class=${c.className.slice(0, 30)}, v-if=${c.getAttribute('v-if')}`);
}

const nav = document.querySelector('nav.liquid-dock');
console.log("nav found?", !!nav, "parent:", nav?.parentElement?.parentElement?.className);
