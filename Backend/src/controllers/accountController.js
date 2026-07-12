const accountService = require("../services/accountService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const accounts = await accountService.listAccounts();
  res.json({ data: accounts });
});

const create = asyncHandler(async (req, res) => {
  const result = await accountService.createAccount(req.body);
  res.status(201).json({ data: result });
});

const update = asyncHandler(async (req, res) => {
  const result = await accountService.updateAccount(req.params.id, req.body);
  res.json({ data: result });
});

const remove = asyncHandler(async (req, res) => {
  const result = await accountService.deleteAccount(req.params.id);
  res.json({ data: result });
});

module.exports = {
  create,
  list,
  remove,
  update
};
