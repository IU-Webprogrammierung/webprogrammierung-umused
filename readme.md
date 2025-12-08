# Mein Weg zum Halbmarathon

Ein persönlicher Webauftritt über meine Vorbereitung auf einen Halbmarathon.
Willkommen in meinem Repository zu dieses Projekt. Diese Webseite dokumentiert meine Vorbereitung auf einen Halbmarathon und dient als Abgabe für das Modul DLBUXPWP01.

## Ziel

Motivation, Einblick ins Training und Community-Entwicklung rund um das Thema Laufen.

## Struktur

Der Webauftritt besteht aus vier Seiten:
- **Startseite (index.html):** Übersicht, Motivation und Teaser der Inhalte.
- **Über mich (about.html):** Persönlicher Hintergrund mit animierten Elementen (Wolken/sterne) und einem Slider.
- **Training (training.html):** Detailierter Trainingsplan als Tabelle und Erklärung meiner Trainingsphasen.
- **Community (community.html):** Angebot zu einem Community-Run und Kontaktformular


## Responsive Design (Media Queries)

Die Seite folgt einem Responsive-Ansatz. Durch den Einsatz von Media Queries (hauptsächlich @media (max-width: 768px)) passt sich das Layout nahtlos an:

- Navigation: Wandelt sich von einer horizontalen Leiste in einem Hamburger-Menü
- Layouts: Mehrspaltige Grids (z.B auf Startseite oder im Trainingsplan) brechen auf kleineren Endgeräten in eine einspaltige Ansicht um. Flexbox wird für eindimensionale Ausrichtungen wie z.B. die Navigation genutzt
- Schriftgrößen & Abstände: Sie werden auf kleineren Screens für eine bessere Lesbarkeit angepasst.

## Technische Highlights & Besonderheuten

- Dark Mode / Light Mode: Volle Unterstützung mit manueller Toggle-Switch. Umgesetzt mit Variables.
- CSS Nesting: Für bessere lesbarkeit Verschachtelung der CSS-Codes
- HTML mit semantischer Struktur (header, main, footer, section)
- CSS mit Grid und Flexbox (wird in Phase 2 gestaltet)
- 1 Breakpoint bei 768px
- Barrierefreiheit: Optimierte Kontraste, Alt-Texte, ARIA-Labels, sinnvolle Überschriftenstruktur mit Lighthouse-Score-Check
- Scroll-to-Top: Ein mitschwebender Button, der beim Scrollen eingeblendet wird und den User schnell zum Beginn der Seite führt
- Sticky-Navigation: Überall auf der Seite ist die Navigation möglich

## Reflexion & Lernprozess

Während der Erarbeitung hat sich das Projekt sehr weiterentwickelt.

1. CSS-Chaos: Mit Fortschreiten der Webseite wuchs die style.css immer mehr. Anschließend hatte ich versucht, mit mehreren Styles den Überblick zu behalten aber mit jeder weiteren Idee, die ich umgesetzt hatte, war immer die Gefahr, die Styles zu überarbeiten und zu prüfen, ob Inhalte zusammengefasst werden können. Das hat immer wieder zum umwerfen, neudenken und auch zu dopplungen geführt. Mit dem Nesting und dem Sortieren in die verschiedenen Klassen, konnte ich das gut beheben.

2. Javascript: Die Positionierung des Hamburger-Menüs und des Scroll-to-Top-Buttons mit dem dynamischen Laden des Footers war nicht einfach. Es hat mehrere Anläufe gebraucht, bis ich ein verständnis dafür hatte, wo ich welchen Code platzieren kann und wie auch einige Codes zusammenhängen, obwohl technische Unterstützung zur Vefügung stand.

3. Design und Coding: Viele Design-Entscheidungen habe ich während der Entwicklung verworfen, da sie bei der Umsetzung nicht so gewirkt haben, wie ich es in der Skizze mir vorgestellt hatte. Einige Ideen konnten dann auch immer über mehrere Wege und Varianten umgesetzt werden. Ich habe dann versucht immer einen Mittelweg zu finden aber habe mich auch teilweise dem Perfektionismus unterworfen und viel Zeit verloren aber sehr viel Wissen mitgenommen.

4. Abschluss: Es war ein sehr tolles Projekt und ich habe für mich sehr viel mitgenommen. Auch wenn ich bereits mit vielen Tools Webseiten entwickelt habe, war es super spannend, eine recht dynamische und moderne Seite von Grund auf aufzubauen.

## Live-Preview
<a href="https://iu-webprogrammierung.github.io/webprogrammierung-umused/">Webauftritt öffnen</a>