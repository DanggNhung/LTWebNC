const studentService = require("../services/studentService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const students = await studentService.listStudents();
  res.json({ data: students });
});

module.exports = {
  list
};
