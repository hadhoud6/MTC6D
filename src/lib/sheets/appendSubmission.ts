import { google } from "googleapis";

/**
 * Google Sheets saved copy for form submissions (free tier).
 *
 * Required env vars (server only, never expose them to the browser):
 *   GOOGLE_SHEETS_SPREADSHEET_ID
 *   GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_SHEETS_PRIVATE_KEY  (the \n characters in the JSON key stay escaped)
 * Optional:
 *   GOOGLE_SHEETS_DEVIS_TAB    (default: "Devis")
 *   GOOGLE_SHEETS_CONTACT_TAB  (default: "Contact")
 *
 * Setup: create a spreadsheet, create the two tabs with the header rows
 * listed in GOOGLE_SHEETS_SETUP.md, then share the spreadsheet with the
 * service-account email as Editor. Values are appended with RAW input so
 * user text starting with "=" is stored as text, not run as a formula.
 * This function never throws: it returns false and logs only the error
 * message (no submission data) so a Sheets outage never blocks the
 * email path, and vice versa.
 */
export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID &&
      process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SHEETS_PRIVATE_KEY,
  );
}

export function getSheetTab(kind: "devis" | "contact"): string {
  if (kind === "devis") {
    return process.env.GOOGLE_SHEETS_DEVIS_TAB?.trim() || "Devis";
  }
  return process.env.GOOGLE_SHEETS_CONTACT_TAB?.trim() || "Contact";
}

export async function appendSheetRow(
  kind: "devis" | "contact",
  values: (string | number)[],
): Promise<boolean> {
  if (!isSheetsConfigured()) return false;
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(
          /\\n/g,
          "\n",
        ),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `${getSheetTab(kind)}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values.map((value) => String(value))] },
    });
    return true;
  } catch (error) {
    console.error(
      "[sheets] append failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return false;
  }
}
