const portalService = require("../services/portalService");
const asyncHandler = require("../utils/asyncHandler");

function getCurrentUserId(req) {
  return req.currentUser?.id || req.session.user.id;
}

const getStudentProfile = asyncHandler(async (req, res) => {
  const data = await portalService.getStudentProfile(getCurrentUserId(req));
  res.json({ data });
});

const updateStudentProfile = asyncHandler(async (req, res) => {
  const data = await portalService.updateStudentProfile(getCurrentUserId(req), req.body);
  res.json({ data });
});

const listAvailableSubjects = asyncHandler(async (req, res) => {
  const data = await portalService.listAvailableSubjects(getCurrentUserId(req));
  res.json({ data });
});

const registerSubjects = asyncHandler(async (req, res) => {
  const data = await portalService.registerSubjects(getCurrentUserId(req), req.body);
  res.status(201).json({ data });
});

const cancelStudentEnrollment = asyncHandler(async (req, res) => {
  const data = await portalService.cancelStudentEnrollment(getCurrentUserId(req), req.params.enrollmentId);
  res.json({ data });
});

const listStudentResults = asyncHandler(async (req, res) => {
  const data = await portalService.listStudentResults(getCurrentUserId(req));
  res.json({ data });
});

const listTeacherSubjects = asyncHandler(async (req, res) => {
  const data = await portalService.listTeacherSubjects(getCurrentUserId(req));
  res.json({ data });
});

const listTeacherScores = asyncHandler(async (req, res) => {
  const data = await portalService.listTeacherScores(getCurrentUserId(req), req.query.subjectId);
  res.json({ data });
});

const updateTeacherScore = asyncHandler(async (req, res) => {
  const data = await portalService.updateTeacherScore(getCurrentUserId(req), req.params.enrollmentId, req.body);
  res.json({ data });
});

module.exports = {
  cancelStudentEnrollment,
  getStudentProfile,
  listAvailableSubjects,
  listStudentResults,
  listTeacherScores,
  listTeacherSubjects,
  registerSubjects,
  updateStudentProfile,
  updateTeacherScore
};
