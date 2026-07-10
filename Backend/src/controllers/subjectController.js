const subjectService = require("../services/subjectService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const subjects = await subjectService.listSubjects();
  res.json({ data: subjects });
});

module.exports = {
  list
};
