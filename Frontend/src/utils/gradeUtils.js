export function roundOne(value) {
  return Number(value).toFixed(1);
}

export function toGpa(score10) {
  if (score10 >= 8.5) return { score4: 4.0, letter: "A" };
  if (score10 >= 8.0) return { score4: 3.5, letter: "B+" };
  if (score10 >= 7.0) return { score4: 3.0, letter: "B" };
  if (score10 >= 6.5) return { score4: 2.5, letter: "C+" };
  if (score10 >= 5.5) return { score4: 2.0, letter: "C" };
  if (score10 >= 5.0) return { score4: 1.5, letter: "D+" };
  if (score10 >= 4.0) return { score4: 1.0, letter: "D" };
  return { score4: 0.0, letter: "F" };
}

export function summarizeGrades(semesters) {
  const rows = semesters.flatMap((semester) => semester.rows);
  const totalCredits = rows.reduce((sum, row) => sum + row.credits, 0);
  const completedRows = rows.filter((row) => row.score10 !== null && row.score10 !== undefined && row.score10 !== "");
  const accumulatedCredits = rows
    .filter((row) => row.score10 >= 4)
    .reduce((sum, row) => sum + row.credits, 0);

  const completedCredits = completedRows.reduce((sum, row) => sum + row.credits, 0);

  if (completedCredits === 0) {
    return {
      totalCredits,
      accumulatedCredits: 0,
      average10: 0,
      average4: 0,
      averageLetter: "F"
    };
  }

  const weighted10 = completedRows.reduce((sum, row) => sum + row.score10 * row.credits, 0) / completedCredits;
  const weighted4 = completedRows.reduce((sum, row) => sum + toGpa(row.score10).score4 * row.credits, 0) / completedCredits;

  return {
    totalCredits,
    accumulatedCredits,
    average10: weighted10,
    average4: weighted4,
    averageLetter: toGpa(weighted10).letter
  };
}
