# Google Sheets saved copy — setup (free)

Every quote (`/devis`) and contact (`/contact`) submission is appended
to a Google Sheet as a second delivery channel, so a lead is never
lost if the email fails. The sheet is only written from the server;
no key ever reaches the browser.

## 1. Create the spreadsheet (5 minutes, free)

1. In Google Drive, create a new spreadsheet, e.g. `MTC — Demandes`.
2. Rename the first tab to `Devis` and add this header row in A1:K1:
   `Timestamp | Type | Prénom | Nom | Email | Téléphone | Pays téléphone | Produits (JSON) | Commentaire | Fichier URL | Statut email`
   The `Produits (JSON)` cell holds one JSON object per product (up to 3), each with all its fields together, without duplicated label fields: `type`, `variete`, `longueur_cm`, `largeur_cm`, `epaisseur_cm`, `dimensions`, `quantite_m2`, `finition`, and `finition_autre` only when the visitor typed one.
3. Create a second tab named `Contact` with this header row in A1:I1:
   `Timestamp | Type | Nom | Email | Téléphone | Pays téléphone | Message | Fichier URL | Statut email`
   (Contact rows leave the phone columns empty; the form has no phone field.)
4. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`

## 2. Create a service account (free, no credit card)

1. Go to Google Cloud Console → create/select a project → **APIs & Services → Library** → enable **Google Sheets API**.
2. **APIs & Services → Credentials → Create Credentials → Service account**.
3. Open the service account → **Keys → Add key → Create new key → JSON** and download it. Keep this file private; it is a credential.
4. From the JSON, note `client_email` and `private_key`.

## 3. Share the sheet with the service account

In the spreadsheet: **Share → add the service-account email → Editor**.
Without this step every append fails with a permission error, and the
server logs `[sheets] append failed` (no submission data is logged).

## 4. Set the environment variables on the host

Set these on the hosting project and redeploy.
Do **not** commit real values to git.

| Name | Value |
| --- | --- |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | ID from step 1 |
| `GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL` | `client_email` from the JSON |
| `GOOGLE_SHEETS_PRIVATE_KEY` | `private_key` from the JSON, with `\n` kept escaped |
| `RESEND_API_KEY` | Resend API key (see `.env.local.example`) |
| `FORM_OWNER_EMAIL` | Test: your own email. Production: client mailbox |
| `RESEND_FROM_EMAIL` | Test: `onboarding@resend.dev`. Production: remove this line |
| `BLOB_READ_WRITE_TOKEN` | Only needed for submissions with a file |

## 5. Test

1. Submit the quote form once with test data and your own email.
2. Check: (a) your inbox got the owner copy, (b) a new row appeared
   in the `Devis` tab with `Statut email = email_sent` (or
   `email_sent_owner_only` in test mode), (c) no duplicate row.
3. Submit once with a file attached and confirm the file URL lands
   in the sheet row.

## Behaviour when something is down

- Sheet saved + email failed → the visitor sees success (the lead is
  in the sheet and the owner can follow up); the failure is logged
  server-side and recorded in the row's `Statut email` column.
- Email delivered + sheet failed → the visitor sees success (the
  lead is in the owner's inbox); the failure is logged server-side.
- Both failed → the visitor sees the existing error message and
  is asked to call / WhatsApp, as before. Nothing is silently lost
  in a way the visitor cannot see.
