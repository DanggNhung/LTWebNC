const accountService = require("../services/accountService");
const asyncHandler = require("../utils/asyncHandler");
const { clearDemoSessionUser, getRequestUser, setDemoSessionUser } = require("../utils/demoSessions");

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await accountService.authenticate(username, password);

  req.session.user = user;
  setDemoSessionUser(req, user);
  res.json({ data: user });
});

const logout = (req, res) => {
  clearDemoSessionUser(req);
  req.session.destroy(() => {
    res.json({ data: { loggedOut: true } });
  });
};

const me = (req, res) => {
  res.json({ data: getRequestUser(req) });
};

module.exports = {
  login,
  logout,
  me
};
