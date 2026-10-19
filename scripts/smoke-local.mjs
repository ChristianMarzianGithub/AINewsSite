const base = process.env.SMOKE_BASE || "http://localhost:3000";
const password = process.env.SMOKE_PASSWORD;
if (!password) throw new Error("SMOKE_PASSWORD fehlt.");
const home = await fetch(base);
if (home.status !== 200) throw new Error(`Startseite: ${home.status}`);
const loginPage = await fetch(`${base}/admin/login`);
const html = await loginPage.text();
const action = html.match(/name="(\$ACTION_ID_[^"]+)"/);
if (!action) throw new Error("Login-Formular nicht gefunden.");
const data = new FormData();
data.set(action[1], "");
data.set("password", password);
const login = await fetch(`${base}/admin/login`, { method: "POST", headers: { origin: base }, body: data, redirect: "manual" });
const cookie = login.headers.get("set-cookie")?.split(";")[0];
if (!cookie?.startsWith("nb_session=")) {
  const body = await login.text();
  throw new Error(`Sitzung nicht gesetzt: ${login.status}; Aktion: ${action[1].slice(0,24)}; Fehlerseite: ${body.includes("Passwort ungültig")}; Ort: ${login.headers.get("location")}; Typ: ${login.headers.get("content-type")}; Anfang: ${body.slice(0,150)}`);
}
const admin = await fetch(`${base}/admin`, { headers: { cookie }, redirect: "manual" });
if (admin.status !== 200) throw new Error(`Redaktion: ${admin.status}`);
console.log(JSON.stringify({ homepage: home.status, login: login.status, admin: admin.status }));
