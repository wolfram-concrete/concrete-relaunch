# Mux-Video-Migration

Stand: 12.09.2026  
Organisation: CONCRETE – Brandbuilding GmbH  
Environment: CONCRETE Website (`o0id3c`)

## Aktive Website-Zuordnung

| Bisheriger Slug | Thema | Mux Playback-ID |
|---|---|---|
| `verstehen` | Warum beginnt gutes Branding mit Verstehen – und nicht mit Design? | `gHaEc3vcUKwH3KYfK1Otx3jPMtsl8z77YfEXeh8E6qg` |
| `prozess` | Warum ein klarer Prozess so wichtig ist? | `Hdcqs8udIgksH7bcNI1hI3CqPDBrsF01sEgHyjMCqHGk` |
| `verantwortung` | Warum bei CONCRETE Verantwortung nicht abgegeben wird | `tcji9nWz02F5T01UPjXVC9kKBmJCoVxjcivAmebQPRh02w` |
| `erstgespraech` | Das Erstgespräch. Warum es uns so wichtig ist | `bMEULVNtXClXrodV1rePIfYT4YvBf2X2P8nVbK600hCM` |
| `projekt-fit` | Welche Kunden zu CONCRETE passen | `PZC1ej2Z4L02qmocJQ8MjiqUwAGoWJppBL8aiogHSkKI` |
| `definieren` | Warum gutes Design keine Geschmacksfrage ist | `801pPAOZPYyW2MQRBie5ncvXHT76Te2fnE1EtPEo7WhM` |
| `begleiten` | Was passiert nach dem Launch – und warum Markenführung dann wichtig wird | `0284L6ovsRSYERtBiUAvoRYObDiYjN3IjPtmnY5R6xM4` |
| `umsetzen-messbar` | Ist Brandbuilding messbar? | `00bnGuCx87KqH00WTtu02nPwwZX1GZTuPG9ylrnutTwaOE` |

Die Playback-IDs sind absichtlich öffentlich: Die Assets verwenden die
Playback Policy `Public` und werden auf der Website über
`https://player.mux.com/<PLAYBACK_ID>` eingebunden.

## Weitere Assets im kostenlosen Tarif

Zusätzlich liegen diese zwei, aktuell nicht eingebundenen Clips in Mux:

- Was ist eigentlich Brand Building?
- Warum mit CONCRETE arbeiten?

Der kostenlose Tarif erlaubt höchstens zehn Assets. Deshalb sind diese beiden
Quelldateien weiterhin nur im freigegebenen Google-Drive-Ordner vorhanden und
können nach einem Tarif-Upgrade erneut hochgeladen werden:

- Kann ich meine Brand auch mit KI aufbauen?
- Warum Brandbuilding im B2B anders funktioniert

## Technische Regel

Redaktionelle Teaser tragen `data-mux-playback-id` und optional
`data-video-title`. `site.js` erzeugt den Mux-Player erst beim Klick, schließt
vorher einen eventuell laufenden Teaser und entfernt den iframe beim Schließen
vollständig. Poster bleiben bis dahin normale Bilder. Dekorative Autoplay-Clips
und Case-Videos verwenden weiterhin die vorhandene Lazy-Video-Logik. Mux Data,
Mux-Cookies sowie die Speicherung von Lautstärke- und Mute-Präferenzen sind im
Embed deaktiviert; damit wird der redaktionelle Player nicht zu einem weiteren
optionalen Trackingdienst außerhalb der Consent-Steuerung.
