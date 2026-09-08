# Eingang für neue Projektbilder

Hier neue Originalbilder ablegen, ein Unterordner pro Projekt mit dem Slug
der Case-Seite oder der Kachel in der Übersicht:

    _eingang/nextbed/
    _eingang/bgf/
    _eingang/noey/
    _eingang/wackelzahn/
    _eingang/medium/
    _eingang/conlivo/      (noch ohne Case-Seite, Slug wie in projekte.html)

Formate: JPG, PNG, TIFF oder HEIC in Originalgröße, Videos als MP4.
Die Dateien werden hier nicht ins Git aufgenommen (siehe .gitignore).
Claude Code liest den Ordner, rechnet die Bilder auf Webgröße
(max. 2400 px, JPG 82 %) nach `assets/cases/<slug>/` und baut sie in die
Galerie ein. Dateinamen dürfen sprechend sein, sie werden übernommen.
