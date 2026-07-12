const classService = require("../services/classService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const classes = await classService.listClasses();
  res.json({ data: classes });
});

const create = asyncHandler(async (req, res) => {
  const result = await classService.createClass(req.body);
  res.status(201).json({ data: result });
});

const update = asyncHandler(async (req, res) => {
  const result = await classService.updateClass(req.params.id, req.body);
  res.json({ data: result });
});

const remove = asyncHandler(async (req, res) => {
  const result = await classService.deleteClass(req.params.id);
  res.json({ data: result });
});

module.exports = {
  create,
  list,
  remove,
  update
};
