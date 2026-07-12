import { departments, majorsByDepartment } from "./academicStructure.js";

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
    options: departments
  },
  {
    name: "major",
    label: "Ngành",
    type: "select",
    dependsOn: "department",
    optionMap: majorsByDepartment
  },
  { name: "advisor", label: "Giảng viên phụ trách", placeholder: "Nhập tên giảng viên" },
  { name: "size", label: "Sĩ số", type: "number", placeholder: "Nhập sĩ số" }
];

export const subjectFormFields = [
  { name: "subjectCode", label: "Mã môn", placeholder: "Ví dụ: CS-101" },
  { name: "subjectName", label: "Tên môn học", placeholder: "Nhập tên môn học" },
  { name: "credits", label: "Số tín chỉ", type: "number", placeholder: "Nhập số tín chỉ" },
  {
    name: "department",
    label: "Khoa",
    type: "select",
    options: departments
  },
  {
    name: "instructor",
    label: "Giảng viên hướng dẫn",
    type: "select",
    dependsOn: "department",
    optionMap: {}
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
  { name: "password", label: "Mật khẩu", type: "password", placeholder: "Nhập mật khẩu" },
  {
    name: "role",
    label: "Vai trò",
    type: "select",
    options: ["Sinh viên", "Giảng viên", "Quản trị viên"]
  },
  {
    name: "department",
    label: "Khoa",
    type: "select",
    options: departments,
    showWhen: { field: "role", value: "Giảng viên" }
  }
];
