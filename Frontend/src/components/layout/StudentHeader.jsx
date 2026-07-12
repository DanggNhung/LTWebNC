import { studentProfile } from "../../data/studentData.js";
import UserTopbar from "./UserTopbar.jsx";

export default function StudentHeader() {
  return (
    <UserTopbar
      profileHref="/sinh-vien/ho-so"
      user={{
        avatar: "C",
        name: studentProfile.name
      }}
    />
  );
}
