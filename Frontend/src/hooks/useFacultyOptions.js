import { useMemo } from "react";
import useApiRows from "./useApiRows.js";

/**
 * Hook lấy danh sách khoa và ngành từ API /faculties.
 * Trả về departments (mảng tên khoa), majorsByDepartment (map tên khoa → mảng tên ngành),
 * và loading/error state.
 */
export default function useFacultyOptions() {
  const { rows, loading, error } = useApiRows("/faculties", []);

  const departments = useMemo(() => rows.map((faculty) => faculty.name), [rows]);

  const majorsByDepartment = useMemo(
    () =>
      rows.reduce((map, faculty) => {
        map[faculty.name] = faculty.majors ?? [];
        return map;
      }, {}),
    [rows]
  );

  return { departments, majorsByDepartment, loading, error };
}
