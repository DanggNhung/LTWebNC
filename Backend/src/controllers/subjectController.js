const subjectService = require("../services/subjectService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const subjects = await subjectService.listSubjects();
  res.json({ data: subjects });
});

const create = asyncHandler(async (req, res) => {
  const result = await subjectService.createSubject(req.body);
  res.status(201).json({ data: result });
});

const update = asyncHandler(async (req, res) => {
  const result = await subjectService.updateSubject(req.params.id, req.body);
  res.json({ data: result });
});

const remove = asyncHandler(async (req, res) => {
  const result = await subjectService.deleteSubject(req.params.id);
  res.json({ data: result });
});

module.exports = {
  create,
  list,
  remove,
  update
};
