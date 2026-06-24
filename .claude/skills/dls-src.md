# Skill: Extract DLS Icons from Storybook

## Trigger
Activate this skill when the user types **"DLS src"** or `/dls-src`, or asks to:
- Extract icons from the DLS Storybook
- Update or refresh icons from `blueprint-staging.hatio.dev`
- Add missing icons to the `icons/` folder
- Regenerate the icon set

## What it does
Fetches all icon SVG definitions from the DLS Storybook JS bundles and writes them as typed React components to `icons/index.tsx` and `icons/icons-extended.tsx`.

---

## Step 1 — Discover icon bundle files

Fetch the iframe bundle to find all icon JS file names:

```bash
curl -s "https://blueprint-staging.hatio.dev/assets/iframe-CjL9ryaN.js" | node -e "
const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  const text = chunks.join('');
  const matches = text.match(/[\"'][^\"']*Icon[^\"']*\.js[\"']/g) || [];
  console.log([...new Set(matches)].join('\n'));
});
"
```

---

## Step 2 — Extract General Icons (117 icons)

Run the extraction script below. It fetches icons from:
- `GeneralIcons.stories-D4YRhued.js` — 84 inline icons
- `UserManagementIcon-BNn0u8dT.js` — AddIcon, BankIcon, SavedPaymentIcon, HelpIcon, SupportIcon, AccountDashboardIcon, LogoutIcon, ReportsIcon, SettlementReconIcon, UserManagementIcon
- `PinnedIcon-CjaviviY.js` — FilterDefaultIcon, PinIcon, PinnedIcon
- `UploadIcon-FAyUk39H.js` — DeleteIcon, DownloadIcon, UploadIcon
- Individual single-icon files for: CloseIcon, Chevrons, CopyIcon, BriefcaseAndGearIcon, RupeeSymbolIcon, InfoWithBorderIcon, SettingsIcon, MetroIcon, CloseOutlineIcon, ResetIcon, TimerIcon, TwoFAIcon, CalendarIcon, CardIcon

### Key extraction helpers

```js
// Detect JSX runtime alias per file (varies: o, e, t, n, r, L, etc.)
function getJSXAlias(code) {
  const m = code.match(/import\{j as (\w+)\}from"\.\/jsx-runtime/);
  return m ? m[1] : 'e';
}

// Extract matching brace content (handles nested braces)
function extractBracedContent(code, startIdx) {
  let depth = 1, i = startIdx + 1;
  while (i < code.length && depth > 0) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') depth--;
    i++;
  }
  return code.slice(startIdx, i);
}

// Find all SVG child element calls: alias.jsx("path", {...})
function extractChildElements(code, alias) {
  const elements = [];
  const tags = ['path','circle','rect','ellipse','line','polygon','polyline'];
  for (const tag of tags) {
    for (const suffix of ['','s']) {
      const search = `${alias}.jsx${suffix}("${tag}",`;
      let pos = 0;
      while (pos < code.length) {
        const idx = code.indexOf(search, pos);
        if (idx === -1) break;
        let bp = idx + search.length;
        while (bp < code.length && code[bp] !== '{') bp++;
        if (bp >= code.length) break;
        elements.push({ tag, propsStr: extractBracedContent(code, bp), pos: idx });
        pos = idx + search.length;
      }
    }
  }
  return elements.sort((a,b) => a.pos - b.pos);
}
```

### Important: Multi-icon files use displayName for correct naming

Always read `.displayName` from each function — do NOT guess names from filenames:

```js
// Get real icon names from displayName assignments
const displayNames = {};
const dnRe = /([a-zA-Z_$][\w$]*)\.displayName\s*=\s*"([^"]+)"/g;
let m;
while ((m = dnRe.exec(code)) !== null) displayNames[m[1]] = m[2];
```

Known correct mappings (as of 2026-06-24):
| File | Internal fn | Correct name |
|------|------------|--------------|
| UserManagementIcon | s | AddIcon |
| UserManagementIcon | d | BankIcon |
| UserManagementIcon | i | SavedPaymentIcon |
| UserManagementIcon | C | HelpIcon |
| UserManagementIcon | c | SupportIcon |
| UserManagementIcon | a | AccountDashboardIcon |
| UserManagementIcon | p | LogoutIcon |
| UserManagementIcon | l | ReportsIcon |
| UserManagementIcon | L | SettlementReconIcon |
| UserManagementIcon | u | UserManagementIcon |
| PinnedIcon | C | FilterDefaultIcon |
| PinnedIcon | s | PinIcon |
| PinnedIcon | c | PinnedIcon |
| UploadIcon | r | DeleteIcon |
| UploadIcon | d | DownloadIcon |
| UploadIcon | t | UploadIcon |

### React component template

```tsx
export const IconName: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" width={25} height={25} {...props}>
    <path d="..." fill="#3B475B" />
  </svg>
);
```

---

## Step 3 — Extract Extended Icons

Fetch these additional story files and extract using the same helpers:

| Story file | Icons inside |
|-----------|-------------|
| `txt-icon-D9RoLhhm.js` | CsvIcon, JpgIcon, PdfIcon, PngIcon, XlsxIcon, TxtIcon |
| `zip-icon-GjNjLacz.js` | ZipIcon |
| `BilldeskCollapsedLogo-DAG14x92.js` | BilldeskCollapsedLogo |
| `BilldeskLogo-wPQNKUDM.js` | BilldeskLogo |
| `Logos.stories-6E6T0Iq8.js` | SbiCollapsedLogo, SbiLogo, IciciCollapsedLogo, IciciLogo, HdfcCollapsedLogo, HdfcLogo, BharatBillPayLogo, CitiBankLogo, IndusindBankLogo, BankOfBarodaLogo, PunjabNationalBankLogo, YesBankLogo, KotakMahindraLogo, AxisCollapsedLogo |
| `MasterCardLogo-Cva6bb5_.js` | MasterCardLogo |
| `PaymentMethods.stories-Dbz-SMOv.js` | AmericanExpressLogo, UpiLogo, AMEXLogo, BHIMUpiLogo, RuPayLogo, VISALogo, NetBanking2Logo |
| `PaymentOptions.stories-DIaTG-V5.js` | SavedPaymentOptionPO, CreditDebitCardPO, EmiPO, InternetBankingPO, NetBankingPO, UpiQrPO, WalletsPO, NeftRtgsPO, ChallanPO, UpiPO |
| `Error500-D7yFYySH.js` | Error500Illustration, Error403Illustration, Error404Illustration |
| `Empty-9M_eEbQC.js` | EmptyIllustration |
| `Search-CUJpuvGf.js` | SearchIllustration |
| `EmptyUploadFileIllustration-eiOR8egN.js` | EmptyUploadFileIllustration, EmptyFileIllustration |
| `EmptyNoDataFoundIllustration-BHFYSIFy.js` | EmptyNoDataFoundIllustration |

For story files with inline components, use displayName to get names:
```js
const displayNames = {};
/(\w+)\.displayName\s*=\s*"([^"]+)"/g  // extract name map
```

---

## Step 4 — Write output files

- `icons/index.tsx` — all 117 general icons, sorted alphabetically
- `icons/icons-extended.tsx` — file icons, logos, payment methods, illustrations

Always begin both files with:
```tsx
import React from 'react';
```

---

## Step 5 — Commit and push

```bash
cd /Users/hi10168/Desktop/src-dev
git add icons/
git commit -m "Update DLS icons from Storybook"
git push
```

---

## Storybook URL
`https://blueprint-staging.hatio.dev/?path=/docs/stories-icons-icon--docs`

## Repo
`https://github.com/akshayvk-ship-it/DLS-source-file`

## Output location
`icons/index.tsx` and `icons/icons-extended.tsx`
