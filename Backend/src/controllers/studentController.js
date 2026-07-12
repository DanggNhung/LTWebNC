const studentService = require("../services/studentService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const students = await studentService.listStudents();
  res.json({ data: students });
});

const create = asyncHandler(async (req, res) => {
  const result = await studentService.createStudent(req.body);
  res.status(201).json({ data: result });
});

const update = asyncHandler(async (req, res) => {
  const result = await studentService.updateStudent(req.params.id, req.body);
  res.json({ data: result });
});

const remove = asyncHandler(async (req, res) => {
  const result = await studentService.deleteStudent(req.params.id);
  res.json({ data: result });
});

module.exports = {
  create,
  list,
  remove,
  update
};
