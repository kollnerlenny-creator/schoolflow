const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// 1. Fix Insights double <div class="grid grid-cols-2 gap-3 stats-card-enter">
const brokenInsightsGrid = `                    <!-- Schnellübersicht: 4 KPI-Kacheln -->
                    <div class="grid grid-cols-2 gap-3 stats-card-enter" style="animation-delay:0.05s">
                        <!-- Schnellübersicht: 4 KPI-Kacheln -->
                        <div class="grid grid-cols-2 gap-3 stats-card-enter" style="animation-delay:0.05s">`;

const fixedInsightsGrid = `                    <!-- Schnellübersicht: 4 KPI-Kacheln -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 stats-card-enter" style="animation-delay:0.05s">`;

if (html.includes(brokenInsightsGrid)) {
    html = html.replace(brokenInsightsGrid, fixedInsightsGrid);
    console.log("SUCCESS: Fixed Insights grid layout bug!");
} else {
    console.log("WARNING: brokenInsightsGrid pattern not found directly");
}

// 2. Fix clean Zeugnisnoten Oberstufe table (remove gestrichen badges from clean table)
const modifiedZeugnisTd = `<td v-for="hy in halfYears" :key="hy" class="py-2.5 text-center px-1">
                                                <div class="inline-flex flex-col items-center gap-1 justify-center">
                                                    <!-- Status badge (Eingebracht vs. Gestrichen) -->
                                                    <span class="text-[8.5px] font-black px-1.5 py-0.2 rounded-md leading-none tracking-tight"
                                                          :class="saxonAbiturResult.eingebrachte_kurse.some(c => c.fach === s.name && c.halbjahr === hy) ? (s.isLK ? 'bg-[#2d694c] text-white' : 'bg-[#2d694c]/15 text-[#2d694c]') : 'bg-[#ede4dc] text-[#857e72] line-through'">
                                                        {{ saxonAbiturResult.eingebrachte_kurse.some(c => c.fach === s.name && c.halbjahr === hy) ? (s.isLK ? 'LK 2x' : 'GK 1x') : 'Gestrichen' }}
                                                    </span>
                                                    <span v-if="s.reportCardGrades?.[hy] !== undefined && s.reportCardGrades[hy] !== null" class="text-[#b45309] flex items-center gap-0.5">
                                                        <i data-lucide="award" class="w-3.5 h-3.5 text-[#b45309]"></i>
                                                        <span class="text-xs sm:text-sm font-black">{{ s.reportCardGrades[hy] }}</span>
                                                    </span>
                                                    <span v-else class="text-xs sm:text-sm font-black text-[#1f1b16]">
                                                        {{ getCalculatedSemesterPoints(s, hy) }}
                                                    </span>
                                                </div>
                                            </td>`;

const cleanZeugnisTd = `<td v-for="hy in halfYears" :key="hy" class="py-3 text-center font-extrabold text-sm sm:text-base">
                                                <div class="inline-flex items-center gap-1 justify-center">
                                                    <span v-if="s.reportCardGrades?.[hy] !== undefined && s.reportCardGrades[hy] !== null" class="text-[#b45309] flex items-center gap-0.5">
                                                        <i data-lucide="award" class="w-4 h-4 text-[#b45309]"></i>
                                                        <span class="text-xs sm:text-sm font-black">{{ s.reportCardGrades[hy] }}</span>
                                                    </span>
                                                    <span v-else class="text-[#1f1b16]">
                                                        {{ getCalculatedSemesterPoints(s, hy) }}
                                                    </span>
                                                </div>
                                            </td>`;

if (html.includes(modifiedZeugnisTd)) {
    html = html.replace(modifiedZeugnisTd, cleanZeugnisTd);
    console.log("SUCCESS: Restored clean Zeugnisnoten Oberstufe table!");
} else {
    console.log("WARNING: modifiedZeugnisTd pattern not found directly");
}

fs.writeFileSync("index.html", html, "utf8");
