import UserTopbar from "./UserTopbar.jsx";

export default function FacultyHeader() {
  return (
    <UserTopbar
      showProfileLink={false}
      user={{
        avatar: "A",
        name: "GV. An"
      }}
    />
  );
}
