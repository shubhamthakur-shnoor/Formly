const CSV_HEADERS = [
  "Response ID",
  "Respondent Name",
  "Respondent Email",
  "Question",
  "Answer",
  "Submitted At",
];

function escapeCsvValue(value) {
  let text = value == null ? "" : String(value);
  // Prevent spreadsheet formula injection.
  if (/^[\s]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  // Escape double quotes and wrap every value.
  return `"${text.replace(/"/g, '""')}"`;
}
export function convertToCsv(rows) {
  const headerRow = CSV_HEADERS.map(escapeCsvValue).join(",");

  const dataRows = rows.map((row) =>
    [
      row.response_id,
      row.respondent_name,
      row.respondent_email,
      row.question_text,
      row.answer,
      row.submitted_at
        ? new Date(row.submitted_at).toISOString()
        : "",
    ]
      .map(escapeCsvValue)
      .join(",")
  );
  // Headers are included even when there are no responses.
  return [headerRow, ...dataRows].join("\r\n") + "\r\n";
}
