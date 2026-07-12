/**
 * Định nghĩa cấu trúc form fields cho từng entity.
 * Các trường có type "select" với options/optionMap sẽ được inject dynamic
 * ở tầng Page (từ API) trước khi truyền vào AddRecordModal.
 */

export const studentFormFields = [
  { name: "lastName", label: "Họ", placeholder: "Nhập họ" },
  { name: "firstName", label: "Tên", placeholder: "Nhập tên" },
  { name: "studentId", label: "Mã sinh viên", placeholder: "Ví dụ: 26010207" },
  { name: "birthDate", label: "Ngày sinh", type: "date" },
  {
    name: "gender",
    label: "Giới tính",
    type: "select",
    options: ["Nam", "Nữ", "Khác"]
  },
  { name: "classCode", label: "Lớp", placeholder: "Ví dụ: IT1" }
];

export const classFormFields = [
  { name: "classCode", label: "Mã lớp", placeholder: "Ví dụ: IT1" },
  { name: "className", label: "Tên lớp", placeholder: "Ví dụ: Công nghệ thông tin 1" },
  {
    name: "department",
    label: "Khoa",
    type: "select",
    options: [] // Được inject dynamic từ useFacultyOptions
  },
  {
    name: "major",
    label: "Ngành",
    type: "select",
    dependsOn: "department",
    optionMap: {} // Được inject dynamic từ useFacultyOptions
  },
  { name: "size", label: "Sĩ số", type: "number", placeholder: "Nhập sĩ số" }
];

export const subjectFormFields = [
  { name: "subjectCode", label: "Mã môn", placeholder: "Ví dụ: CS-101" },
  { name: "subjectName", label: "Tên môn học", placeholder: "Nhập tên môn học" },
  { name: "credits", label: "Số tín chỉ", type: "number", placeholder: "Từ 1 đến 10" },
  {
    name: "department",
    label: "Khoa",
    type: "select",
    options: [] // Được inject dynamic từ useFacultyOptions
  },
  {
    name: "instructor",
    label: "Giảng viên hướng dẫn",
    type: "select",
    dependsOn: "department",
    optionMap: {} // Được inject dynamic từ accounts API
  },
  {
    name: "knowledgeBlock",
    label: "Khối kiến thức",
    type: "select",
    options: ["Giáo dục đại cương", "Chuyên ngành", "Bổ trợ", "Cơ sở ngành"]
  }
];

export const accountFormFields = [
  { name: "lastName", label: "Họ", placeholder: "Nhập họ" },
  { name: "firstName", label: "Tên", placeholder: "Nhập tên" },
  { name: "accountId", label: "ID", placeholder: "Nhập ID tài khoản" },
  { name: "password", label: "Mật khẩu", type: "password", placeholder: "Tối thiểu 6 ký tự" },
  {
    name: "role",
    label: "Vai trò",
    type: "select",
    options: ["Sinh viên", "Giảng viên"]
  },
  {
    name: "department",
    label: "Khoa",
    type: "select",
    options: [], // Được inject dynamic từ useFacultyOptions
    showWhen: { field: "role", value: "Giảng viên" }
  }
];
