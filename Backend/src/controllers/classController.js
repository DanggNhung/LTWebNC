const classService = require("../services/classService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const classes = await classService.listClasses();
  res.json({ data: classes });
});

module.exports = {
  list
};
