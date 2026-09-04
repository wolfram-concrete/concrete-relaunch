// Vorlaunch-Schutz: HTTP Basic Auth fuer alle Routen.
// Benutzer/Passwort kommen aus den Vercel-Umgebungsvariablen
// PREVIEW_USER und PREVIEW_PASSWORD. Ohne gesetztes Passwort ist die
// Seite offen - das ist Absicht, damit ein lokaler Server nicht sperrt.
// Vor dem Livegang: diese Datei loeschen.
export const config = { matcher: "/(.*)" };

export default function middleware(request) {
  const user = process.env.PREVIEW_USER || "concrete";
  const pass = process.env.PREVIEW_PASSWORD;
  if (!pass) return;

  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    const [u, p] = atob(header.slice(6)).split(":");
    if (u === user && p === pass) return;
  }
  return new Response("Vorschau - bitte anmelden.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="CONCRETE Vorschau", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}
