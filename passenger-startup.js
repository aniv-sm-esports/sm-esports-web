// entry.cjs
function loadApp() {
  const { app } = import("./dist/sm-esports-web/server/server.mjs"); // this is your normal entry file - (index.js, main.js, app.mjs etc.)
}
loadApp();
