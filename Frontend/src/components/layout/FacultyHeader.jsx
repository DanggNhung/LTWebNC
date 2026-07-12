import useApiResource from "../../hooks/useApiResource.js";
import UserTopbar from "./UserTopbar.jsx";

function getLastNameInitial(name) {
  return name?.trim().split(/\s+/).at(-1)?.charAt(0).toUpperCase() || "GV";
}

export default function FacultyHeader() {
  const { data: user } = useApiResource("/auth/me", null);
  const name = user?.name || "Giảng viên";

  return (
    <UserTopbar
      showProfileLink={false}
      user={{
        avatar: getLastNameInitial(name),
        name
      }}
    />
  );
}
