const lookupRepository = require("../repositories/lookupRepository");
const asyncHandler = require("../utils/asyncHandler");

/**
 * GET /api/faculties
 * Trả về danh sách khoa và ngành từ database.
 * Endpoint này là public — không cần đăng nhập (dùng cho form chọn khoa/ngành).
 */
const list = asyncHandler(async (req, res) => {
  const [faculties, majors] = await Promise.all([
    lookupRepository.findAllFaculties(),
    lookupRepository.findAllMajors()
  ]);

  // Gom majors theo faculty_id
  const majorsByFacultyId = majors.reduce((map, major) => {
    const key = major.faculty_id;
    if (!map[key]) map[key] = [];
    map[key].push(major.major_name);
    return map;
  }, {});

  const result = faculties.map((faculty) => ({
    id: faculty.id,
    code: faculty.faculty_code,
    name: faculty.faculty_name,
    majors: majorsByFacultyId[faculty.id] ?? []
  }));

  res.json({ data: result });
});

module.exports = { list };
