# Notenübersicht & Streichungsanalyse im Insights-Tab

Wiederherstellung der klassischen Gesamtnoten-Tabelle im Insights-Tab („wie vor der Abi-Funktion“) und Ergänzung einer transparenten Streichungs- und Prognosetabelle für Block I (Sächsische gymnasiale Oberstufe SOGYA) mit voller mobiler Responsivität und dezenter Farbhervorhebung für prognostizierte Noten.

---

## Benutzer-Entscheidungen & Vorgaben

> [!IMPORTANT]
> **Bereits bestätigte Entscheidungen:**
> - **Darstellung**: Die Notentabelle wird exakt in der bewährten Matrix-Form aus Fächern, Halbjahren (11/1, 11/2, 12/1, 12/2 bzw. Sekundarstufe I) und Durchschnitten/Summen wiederhergestellt („so wie es vor der Abi-Funktion war“).
> - **Prognosen & Simulationen**: Noch nicht offiziell erteilte bzw. simulierte Noten werden dezent farblich unterlegt (`bg-amber-500/10` / `bg-[#fef3c7]`), damit sie sofort von echten Zeugnisnoten unterscheidbar sind.
> - **Umsetzungsfreigabe**: Umsetzung im Code erst nach explizitem Benutzer-OK.

---

## 1. Detaillierte Funktionsweise der Einbringungs- & Streichungsberechnung

In der sächsischen Oberstufe (SOGYA) müssen in **Block I** exakt **40 Kurshalbjahre** eingebracht werden:
- **8 Leistungskurse** (LK1 und LK2 aus 11/1 bis 12/2), jeweils doppelt gewertet ($8 \times 2 = 16\text{ KHE}$).
- **32 Grundkurse** (GK), jeweils einfach gewertet ($32 \times 1 = 32\text{ KHE}$).
- Gesamtzahl gewerteter Kurshalbjahresergebnisse: $16 + 32 = 48\text{ KHE}$.

### Der 4-Phasen-Algorithmus:

```
[ Alle belegten Kurshalbjahre (z. B. 46–50 Kurse) ]
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
Phase 1: LK-Fixierung            Phase 2: GK-Pflichtbelegung
• Alle 8 LK-Halbjahre            • 12 Kurse: P3, P4, P5 (alle 4 HJ)
  (100% Pflicht, kein Streichen) • 4 HJ Deutsch (falls nicht LK)
                                 • 4 HJ Mathematik (falls nicht LK)
                                 • 4 HJ Fremdsprache (fortgeführt)
                                 • 4 HJ Geschichte (2 bei BGY)
                                 • 2 beste HJ Kunst oder Musik
                                 • 8 HJ Naturwissenschaften
                                   (2 NW je 4 HJ oder 1 NW + Inf)
                                 • Mind. 1 bestes HJ jedes weiteren
                                   belegten Fachs (Geo, GRW, Eth/Rel...)
       │                               │
       └───────────────┬───────────────┘
                       ▼
Phase 3: Best-of-Auffüllung bis exakt 32 GK
• Alle restlichen nicht-fixierten Kurse werden nach Notenpunkten absteigend sortiert.
• Die punktbesten Kurse werden hinzugefügt, bis exakt 32 GK erreicht sind.
                       │
                       ▼
Phase 4: Streichung (Klammerung)
• Alle verbleibenden schwächeren Kurse werden gestrichen (geklammert).
• Gestrichene Kurse zählen 0-fach, fließen nicht in die 40 Kurse ein und schützen den Schnitt.
```

1. **Phase 1 (LK-Fixierung)**:
   - Alle 8 Halbjahre der beiden gewählten Leistungskurse (LK1 und LK2) sind gesetzlich bindend.
   - **Streichung bei LKs ist gesetzlich unzulässig**.
2. **Phase 2 (GK-Pflichtprüfung & Mindestbindung)**:
   - Die sächsische Pflichteinbringung markiert bindend die vorgeschriebenen Fächer (P3, P4, P5 je 4 HJ; Deutsch, Mathe, Fremdsprache, Geschichte je 4 HJ; beste 2 HJ Kunst/Musik; 8 HJ Naturwissenschaften; mind. 1 HJ aller weiteren belegten Fächer).
3. **Phase 3 (Gierige Best-of-Auffüllung)**:
   - Nach Erfüllung aller gesetzlichen Mindestauflagen fehlen typischerweise noch 4 bis 8 Kurse zur 32er-Quote.
   - Der Algorithmus sortiert alle verbleibenden wählbaren Kurse streng absteigend nach Punkten und wählt exakt so viele der besten Kurse aus, bis die 32 Grundkurse vollständig sind.
4. **Phase 4 (Streichung / Klammerung)**:
   - Alle Kurse, die weder in Phase 1/2 Pflicht waren noch in Phase 3 zu den 32 besten zählten, werden als **„gestrichen“ (geklammert)** deklariert.
   - Sie werden optisch mit Klammern `(8)` bzw. Durchstreichung dargestellt und fließen **weder in die Punktesumme noch in die Unterkurs-Quote des Abiturs** ein.

---

## 2. Benutzeroberfläche & Layout-Konzept

### A. Ansichts-Umschaltung im Insights-Tab („Statistiken“)
Im oberen Bereich des Insights-Tabs wird eine saubere, intuitive Ansichtssteuerung integriert:
- **Button / Segment 1**: `Notenübersicht` (Klassische Fächer-Matrix wie vor dem Update)
- **Button / Segment 2**: `Abitur: Einbringung & Streichungen` (Detailanalyse Block I)
- **Button / Segment 3**: `Leistungsstatistiken` (Durchschnitte, Verteilung, Trends)

### B. Die klassische Notenübersicht („wie vor der Abi-Funktion“)
- **Struktur**:
  - Zeilen: Alle Fächer des Schülers mit Fachfarbe, Fachbezeichnung und Kursart-Badge (`LK` / `GK`).
  - Spalten für Oberstufe: `11/1`, `11/2`, `12/1`, `12/2` sowie `Durchschnitt` und `Gesamtpunkte`.
  - Spalten für Klassen 5–10: `1. Halbjahr`, `2. Halbjahr`, `Jahresnote`.
- **Echte Noten vs. Prognosen**:
  - Echte Zeugnisnoten: Standard-Darstellung (kontrastreich, fett).
  - Prognostizierte/Simulierte Noten: Dezent farblich unterlegt mit sanftem Amber-/Pastell-Hintergrund (`bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200/50`) und kleinem Indikator `*`.

### C. Die neue Tabelle: Streichungen & Abitur-Einbringung
- **Spalten**:
  1. `Fach & Kursart`: Fachname mit Farbpunkt + `LK` / `GK` / `Prüfungsfach (P1–P5)`.
  2. `Halbjahr`: z. B. `11/1`, `11/2`, `12/1`, `12/2`.
  3. `Punkte`: Notenpunkte (z. B. `11 P.`), farblich dezent hinterlegt falls Prognose.
  4. `Status / Einbringung`:
     - **Eingebracht (LK, 2-fach)**: Grüner dezenter Text `Eingebracht (2×)` mit KHE-Wert `2 KHE`.
     - **Eingebracht (GK, 1-fach)**: Grüner dezenter Text `Eingebracht (1×)` mit KHE-Wert `1 KHE`.
     - **Gestrichen (Geklammert)**: Durchgestrichener Punktewert, z. B. `~~06 P.~~`, Status: `Gestrichen (Schont den Schnitt)`.
  5. `Begründung / Regel`: z. B. `Pflicht (P3)`, `Pflicht (Kernfach)`, `Pflicht (Naturwissenschaft)`, `Best-of Grundkurs`, `Gestrichen (Überzählig & schwächer)`.
- **Mobile Optimierung**:
  - Horizontale Scroll-Container (`overflow-x-auto no-scrollbar`) mit sticky Fächer-Spalte für einfache Navigation auf schmalen Displays.
  - Alternativ eine kompakte Karten-Ansicht auf Mobilgeräten (`md:hidden`), die pro Fach direkt zeigt: Eingebrachte vs. gestrichene Halbjahre.

---

## 3. Technische Architektur & Datenfluss

```
┌────────────────────────────────────────────────────────┐
│ App State (subjects, grades, customSettings, abiConfig) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
              calculateSaxonAbitur(state)
                            │
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
eingebrachte_kurse                      gestrichene_kurse
(8 LK × 2 + 32 GK × 1)                  (alle überzähligen Kurse)
• punkte_block_1_roh                    • schwächere Noten geklammert
• anzahl_gewichtete_khe (48)            • kein Einfluss auf Schnitt
• unterkurse_lk / gk                    • Detailbegründung je Fach
       │                                         │
       └────────────────────┬────────────────────┘
                            │
                            ▼
             Insights Tab (currentTab === 'stats')
       ┌────────────────────────────────────────┐
       │ Segment: [ Notenübersicht | Streichungen | Trends ] │
       ├────────────────────────────────────────┤
       │ 1. Vollständige Matrix-Notentabelle   │
       │    (Desktop: Table, Mobil: Touch-Table)│
       │ 2. Streichungs- & Prognosetabelle      │
       │    (Prognosen: dezent warm unterlegt)  │
       │ 3. KPI-Strip: 40/40 Kurse, KHE, Schnitt│
       └────────────────────────────────────────┘
```

---

## 4. Verifikation nach Freigabe

1. **Funktionale Validierung**:
   - Stimmt die Summe der eingebrachten Kurse immer exakt mit 8 LKs + 32 GKs = 40 Kursen überein?
   - Werden Pflichtfächer (P3–P5, De, Ma, FS, Ge, NW) niemals fälschlicherweise gestrichen?
   - Werden schwächere, überzählige Halbjahre korrekt als gestrichen markiert?
2. **Visuelle Validierung**:
   - Notenmatrix entspricht dem originalen Schooly-Design.
   - Dezent farbliche Kennzeichnung für prognostizierte Noten ist harmonisch und kontrastreich.
   - Perfekte Lesbarkeit und Bedienbarkeit auf dem Smartphone (375px/390px Viewport) ohne horizontales Seiten-Ausbrechen.
