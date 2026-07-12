const DEMO_SESSION_HEADER = "x-demo-session-id";

function getDemoSessionId(req) {
  return String(req.get(DEMO_SESSION_HEADER) || "").trim();
}

function getDemoSessionStore(req) {
  if (!req.app.locals.demoSessions) {
    req.app.locals.demoSessions = new Map();
  }

  return req.app.locals.demoSessions;
}

function getDemoSessionUser(req) {
  const demoSessionId = getDemoSessionId(req);
  if (!demoSessionId) return null;
  return getDemoSessionStore(req).get(demoSessionId) || null;
}

function setDemoSessionUser(req, user) {
  const demoSessionId = getDemoSessionId(req);
  if (!demoSessionId) return;
  getDemoSessionStore(req).set(demoSessionId, user);
}

function clearDemoSessionUser(req) {
  const demoSessionId = getDemoSessionId(req);
  if (!demoSessionId) return;
  getDemoSessionStore(req).delete(demoSessionId);
}

function getRequestUser(req) {
  return getDemoSessionUser(req) || req.session?.user || null;
}

module.exports = {
  clearDemoSessionUser,
  getRequestUser,
  setDemoSessionUser
};
