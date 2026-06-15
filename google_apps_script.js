/**
 * Sahyadri Finance - Google Sheets Webhook Script
 *
 * INSTRUCTIONS:
 * 1. Open a new Google Sheet.
 * 2. Click on "Extensions" -> "Apps Script".
 * 3. Delete any code there and paste this entire script.
 * 4. Click the "Save" (floppy disk) icon.
 * 5. Click "Deploy" -> "New Deployment".
 * 6. Select type "Web app".
 * 7. Set "Execute as" to "Me".
 * 8. Set "Who has access" to "Anyone" (important for the app to access it).
 * 9. Click "Deploy". Authorize the permissions if prompted.
 * 10. Copy the "Web app URL" provided.
 * 11. Paste that URL into LocationVerification.tsx and SelfieCapture.tsx
 */

// ─── Column indexes (1-based) ────────────────────────────────────────────────
var COL = {
  TIMESTAMP: 1,
  FULL_NAME: 2,
  AADHAAR: 3,
  DOB: 4,
  GENDER: 5,
  MARITAL_STATUS: 6,
  MOBILE: 7,
  ALT_MOBILE: 8,
  SPOUSE_MOBILE: 9,
  SIBLING_MOBILE: 10,
  FRIEND_MOBILE: 11,
  ADDRESS: 12,
  CITY: 13,
  STATE: 14,
  ACCOUNT_NAME: 15,
  ACCOUNT_NUMBER: 16,
  BANK_NAME: 17,
  OTHER_BANK: 18,
  IFSC: 19,
  BRANCH_NAME: 20,
  LATITUDE: 21,
  LONGITUDE: 22,
  SELFIE_LINK: 23,
  MAP_LINK: 24,
};

var HEADERS = [
  'Timestamp',
  'Full Name',
  'Aadhaar',
  'DOB',
  'Gender',
  'Marital Status',
  'Mobile',
  'Alt Mobile',
  'Spouse Mobile',
  'Sibling Mobile',
  'Friend Mobile',
  'Address',
  'City',
  'State',
  'Account Name',
  'Account Number',
  'Bank Name',
  'Other Bank',
  'IFSC',
  'Branch Name',
  'Latitude',
  'Longitude',
  'Selfie Link',
  'Map Link',
];

var SELFIE_FOLDER_NAME = 'Sahyadri Finance Selfies';

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return respond({ result: 'error', error: 'Invalid JSON' });
  }

  // ── Selfie-only request (update existing row) ────────────────────────────
  if (data.selfieBase64) {
    return handleSelfieUpload(data);
  }

  // ── Full application request (new row) ───────────────────────────────────
  return handleNewApplication(data);
}

function handleSelfieUpload(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() < 2) {
    return respond({ result: 'error', error: 'No applications found' });
  }

  // Find row by mobile number
  var mobile = data.mobile || '';
  if (!mobile) {
    return respond({ result: 'error', error: 'Mobile number required' });
  }

  var mobileCol = COL.MOBILE;
  var values = sheet.getRange(2, mobileCol, sheet.getLastRow() - 1, 1).getValues();
  var rowIndex = -1;

  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(mobile).trim()) {
      rowIndex = i + 2; // +2 because data starts at row 2
      break;
    }
  }

  if (rowIndex === -1) {
    return respond({ result: 'error', error: 'No application found with this mobile number' });
  }

  // Save selfie to Drive
  var selfieLink = saveSelfieToDrive(data.selfieBase64, mobile);
  if (!selfieLink) {
    return respond({ result: 'error', error: 'Failed to save selfie' });
  }

  // Update the Selfie Link column
  sheet.getRange(rowIndex, COL.SELFIE_LINK).setValue(selfieLink);

  return respond({ result: 'success', selfieLink: selfieLink });
}

function buildMapLink(lat, lng) {
  if (!lat || !lng) return '';
  return 'https://www.google.com/maps?q=' + encodeURIComponent(lat) + ',' + encodeURIComponent(lng);
}

function handleNewApplication(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Ensure headers exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date(),
    data.fullName || '',
    data.aadhaar || '',
    data.dob || '',
    data.gender || '',
    data.maritalStatus || '',
    data.mobile || '',
    data.altMobile || '',
    data.spouseMobile || '',
    data.siblingMobile || '',
    data.friendMobile || '',
    data.address || '',
    data.city || '',
    data.state || '',
    data.accountName || '',
    data.accountNumber || '',
    data.bankName || '',
    data.otherBankName || '',
    data.ifscCode || '',
    data.branchName || '',
    data.latitude || '',
    data.longitude || '',
    '', // Selfie Link - empty initially
    buildMapLink(data.latitude, data.longitude),
  ]);

  return respond({ result: 'success' });
}

function saveSelfieToDrive(base64Data, mobile) {
  try {
    // Get or create the selfie folder
    var folders = DriveApp.getFoldersByName(SELFIE_FOLDER_NAME);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(SELFIE_FOLDER_NAME);
    }

    // Decode base64
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, 'image/jpeg', 'selfie_' + mobile + '_' + new Date().getTime() + '.jpg');

    // Save to Drive
    var file = folder.createFile(blob);

    // Set permission to "Anyone with the link can view"
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Return the shareable link
    return file.getUrl();
  } catch (e) {
    console.error('Drive save error: ' + e.message);
    return null;
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Sahyadri Finance Webhook is Active')
    .setMimeType(ContentService.MimeType.TEXT);
}

function respond(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
