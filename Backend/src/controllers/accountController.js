const accountService = require("../services/accountService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const accounts = await accountService.listAccounts();
  res.json({ data: accounts });
});

module.exports = {
  list
};
