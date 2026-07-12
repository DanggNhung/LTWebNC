import useApiResource from "../../hooks/useApiResource.js";
import UserTopbar from "./UserTopbar.jsx";

function getLastNameInitial(name) {
  return name?.trim().split(/\s+/).at(-1)?.charAt(0).toUpperCase() || "SV";
}

export default function StudentHeader() {
  const { data: student } = useApiResource("/portal/student/profile", null);
  const name = student?.name || "Sinh viên";

  return (
    <UserTopbar
      profileHref="/sinh-vien/ho-so"
      user={{
        avatar: getLastNameInitial(name),
        name
      }}
    />
  );
}
