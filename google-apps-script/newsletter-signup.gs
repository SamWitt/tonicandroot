/**
 * Tonic & Root — newsletter signup receiver.
 *
 * This file is NOT deployed automatically (GitHub Pages only serves static
 * files). Paste it into a Google Apps Script project bound to the Google
 * Sheet you want signups to land in. Setup steps live in README.md under
 * "Newsletter signup".
 *
 * Expects a POST body of JSON: {"email": "someone@example.com"}
 * Appends a row [timestamp, email] to the sheet named below (or the active
 * sheet if that name doesn't exist).
 */

var SHEET_NAME = "Signups";
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var email = (body.email || "").trim();

    if (!email || !EMAIL_PATTERN.test(email)) {
      return jsonResponse({ ok: false, error: "invalid_email" });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    // Skip obvious duplicates (case-insensitive) instead of erroring —
    // keeps the sheet clean if someone submits twice.
    var existing = sheet.getRange(1, 2, Math.max(sheet.getLastRow(), 1), 1).getValues();
    var lower = email.toLowerCase();
    for (var i = 0; i < existing.length; i++) {
      if (String(existing[i][0]).toLowerCase() === lower) {
        return jsonResponse({ ok: true, duplicate: true });
      }
    }

    sheet.appendRow([new Date(), email]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: "server_error" });
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
