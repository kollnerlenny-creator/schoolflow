# SchoolFlow

SchoolFlow ist eine moderne Web-Anwendung für die gymnasiale Oberstufe und Sekundarstufe zur Notenverwaltung, Klausurplanung, Stundenplanorganisation und Abiturnotenberechnung.

## Features

- **Dashboard (Home)**:
  - Übersichtliche Tagesansicht mit heutigem Stundenplan und fälligen Aufgaben
  - Countdown zur nächsten Klausur
  - Halbjahresschnitt (15-Punkte-System für Oberstufe oder Noten 1–6)
  - LK-Bonus (doppelte Gewichtung für Leistungskurse)
  - Wochenrückblick (Recap-Stories mit Zusammenfassung der Woche)

- **Fächerverwaltung**:
  - Individuelle Fächer mit Fachfarben, Lucide-Icons, LK/GK-Status und Lehrkräften
  - Detaillierte Fachansicht mit Klausur- und Mündlich-Schnitt
  - Einstellbare Klausurgewichtung (%)
  - Zielnoten-Rechner: Berechnet, welche Note in der nächsten Klausur oder im Mündlichen nötig ist, um die Wunschnote zu erreichen
  - Notenliste mit Datum, Gewichtung und Thema
  - Offizielle Zeugnisnoten-Eintragung zur manuellen Übersteuerung

- **Planer & Kalender**:
  - Filterbare Aufgabenübersicht (Klausuren, Tests, Hausaufgaben, Präsentationen, Sonstiges)
  - Monatskalender mit farbigen Terminpunkten
  - Wöchentlicher interaktiver Stundenplan (Montag bis Freitag)
  - Bulk-Import zum schnellen Einfügen mehrerer Termine aus Text

- **Abiturrechner & Zeugnisübersicht**:
  - Qualifikationsphase (Block I) mit 40-Kurse-Standardberechnung und Unterkursprüfung (< 5 Punkte)
  - Abiturprüfungen (Block II, P1–P5) mit 4-facher Gewichtung
  - Gesamtpunktzahl (300–900 Punkte) und offizielle Abiturnote nach KMK-Skala
  - Zeugnisnotenverlauf für Klassen 5–10 und 11/12

- **Statistiken & PDF-Export**:
  - Notenspiegel-Histogramm (Notenverteilung)
  - Stärkstes Fach und Optimierungsbereich
  - Halbjahresverlauf
  - Vollständiger Notenbericht als formatierte PDF-Datei (jsPDF)

- **Einstellungen & Themes**:
  - 9 Farbthemen (Original, Indigo, Violet, Sky, Cyan, Teal, Emerald, Amber, Rose)
  - Notensystem-Umschaltung (15 Punkte vs. Noten 1–6)
  - Klausur-Erinnerungen
  - Lokale Datensicherung als JSON (Export & Wiederherstellung)

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React
- jsPDF & jspdf-autotable
- Canvas Confetti
