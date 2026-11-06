# Prüfläufe

Alle Prüfungen laufen gegen den Stand im Arbeitsverzeichnis, keine gegen Live.

## Python

    python3 tools/seo-gauntlet.py        # Title, Description, Canonical, Sitemap, Redirects
    python3 tools/seo-linkgraph.py       # interne Verlinkung ausserhalb von Header und Footer
    python3 tools/technical-preflight.py # Cache-Buster und Struktur

## Node

Der Consent-Gauntlet braucht Playwright. Unter Node 20 ist es nicht installiert,
unter Node 24 liegt es im Codex-Runtime-Cache:

    NODE_PATH=/Users/wolfram/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
      ~/.nvm/versions/node/v24*/bin/node tools/consent-gauntlet.cjs

Der passende Chromium (Revision 1234) liegt seit dem 06.11.2026 unter
`~/Library/Caches/ms-playwright`. Fehlt er, einmalig nachinstallieren:

    NODE_PATH=... ~/.nvm/versions/node/v24*/bin/node \
      /Users/wolfram/.cache/codex-runtimes/.../playwright/cli.js install chromium

Die geprüfte Consent-Version liest das Skript aus `index.html`, es läuft also
automatisch gegen die ausgelieferte Datei.

## Generatoren

    python3 tools/build-wissen-links.py    # Block "Passt dazu" auf Wissensseiten
    python3 tools/build-branchen-links.py  # Branchenzeile im Projektueberblick
    python3 tools/build-schema.py          # strukturierte Daten je Seitentyp

Alle drei sind idempotent und entfernen ihren eigenen Block vor dem Neusetzen.
