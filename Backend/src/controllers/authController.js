const accountService = require("../services/accountService");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await accountService.authenticate(username, password);

  req.session.user = user;
  res.json({ data: user });
});

const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ data: { loggedOut: true } });
  });
};

const me = (req, res) => {
  res.json({ data: req.session.user || null });
};

module.exports = {
  login,
  logout,
  me
};
