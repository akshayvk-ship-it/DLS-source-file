# DLS Repo Skill

You are working inside the BillDesk DLS (Design Language System) source repository.

## What's available in this repo

### Icons — `icons/`
- `icons/index.tsx` — **117 general icons** (alphabetical, all named with `Icon` suffix):
  - Navigation: `ChevronDownIcon`, `ChevronUpIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `LeftArrowIcon`, `RightArrowIcon`
  - Actions: `AddIcon`, `CloseIcon`, `CloseOutlineIcon`, `CopyIcon`, `DeleteIcon`, `DeactivateIcon`, `DuplicateIcon`, `DownloadIcon`, `UploadIcon`, `EditIcon`, `FilterDefaultIcon`, `ResetIcon`, `ShareIcon`, `SortIcon`
  - Status: `FailedIcon`, `InfoIcon`, `InfoWithBorderIcon`, `LoadingIcon`, `TickIcon`, `WarningIcon`, `WarningWithBorderIcon`, `SuccessAmountIcon`, `SuccessCountIcon`, `SuccessRateIcon`
  - Finance: `BankIcon`, `CardIcon`, `RupeeSymbolIcon`, `UpiIcon`, `WalletIcon`, `MoneyIcon`, `PricingIcon`, `InvoiceIcon`, `RewardsIcon`, `RefundIcon`, `ChargeBackIcon`, `SettlementReconIcon`
  - User/Auth: `UserBasicIcon`, `UserManagementIcon`, `LockIcon`, `PasswordIcon`, `TwoFAIcon`, `OTPIcon`, `EmailVerificationIcon`, `AccountVerificationIcon`, `MobileVerificationIcon`
  - Navigation/Sections: `DashboardIcon`, `AccountDashboardIcon`, `AccountsIcon`, `LogoutIcon`, `NotificationIcon`, `SettingsIcon`, `HelpIcon`, `SupportIcon`, `QuestionMarkIcon`, `SideNavIcon`
  - Transport: `MetroIcon`, `CarIcon`, `BusIcon`, `PlaneIcon`, `TicketIcon`
  - And many more: `QrIcon`, `CalendarIcon`, `TimerIcon`, `SearchIcon`, `PinnedIcon`, `PinIcon`, `SwapIcon`, `MandateIcon`, `AnalyticsIcon`, etc.

- `icons/icons-extended.tsx` — **60+ additional icons**:
  - File icons: `CsvIcon`, `JpgIcon`, `PdfIcon`, `PngIcon`, `XlsxIcon`, `TxtIcon`, `ZipIcon`
  - Bank logos: `BilldeskLogo`, `BilldeskCollapsedLogo`, `SbiLogo`, `IciciLogo`, `HdfcLogo`, `KotakMahindraLogo`, `AxisCollapsedLogo`, `CitiBankLogo`, `IndusindBankLogo`, `BankOfBarodaLogo`, `PunjabNationalBankLogo`, `YesBankLogo`, `BharatBillPayLogo`
  - Payment methods: `MasterCardLogo`, `AmericanExpressLogo`, `UpiLogo`, `BHIMUpiLogo`, `RuPayLogo`, `VISALogo`, `NetBanking2Logo`
  - Payment option icons: `UpiPO`, `CreditDebitCardPO`, `EmiPO`, `WalletsPO`, `NetBankingPO`, `UpiQrPO`, `NeftRtgsPO`, `ChallanPO`, `SavedPaymentOptionPO`, `InternetBankingPO`
  - Illustrations: `EmptyIllustration`, `SearchIllustration`, `Error500Illustration`, `Error403Illustration`, `Error404Illustration`, `EmptyUploadFileIllustration`, `EmptyNoDataFoundIllustration`

**Icon usage:**
```tsx
import { ChevronDownIcon, SearchIcon } from './icons';
import { MasterCardLogo, UpiLogo } from './icons/icons-extended';

<SearchIcon width={20} height={20} />
<ChevronDownIcon className="text-gray-500" />
```

All icons are `React.FC<React.SVGProps<SVGSVGElement>>` — they accept all standard SVG props including `width`, `height`, `className`, `style`, `fill`, `stroke`.

---

### DLS Components — `src/components/`

| Component | Path |
|-----------|------|
| Accordion | `src/components/Accordion` |
| Avatar | `src/components/Avatar` |
| Banner | `src/components/Banner` |
| Breadcrumbs | `src/components/Breadcrumbs` |
| Button | `src/components/Button` |
| Cards | `src/components/Cards` |
| CardDetailsMweb | `src/components/CardDetailsMweb` |
| Charts | `src/components/Charts` |
| Chips | `src/components/Chips` |
| CoachMark | `src/components/CoachMark` |
| ColorPicker | `src/components/ColorPicker` |
| ContextMenu | `src/components/ContextMenu` |
| DatePicker | `src/components/DatePicker` |
| DateRange | `src/components/DateRange` |
| DateRangeFilter | `src/components/DateRangeFilter` |
| DateRangeMonth | `src/components/DateRangeMonth` |
| DropDown | `src/components/DropDown` |
| DropdownMweb | `src/components/DropdownMweb` |
| DualListBox | `src/components/DualListBox` |
| EmptyState | `src/components/EmptyState` |
| ErrorPage | `src/components/ErrorPage` |
| Footer | `src/components/Footer` |
| GeoMap | `src/components/GeoMap` |
| Header | `src/components/Header` |
| Input | `src/components/Input` |
| ListCell | `src/components/ListCell` |
| ListGroup | `src/components/ListGroup` |
| Loaders | `src/components/Loaders` |
| Modal | `src/components/Modal` |
| PageHeader | `src/components/PageHeader` |
| Pagination | `src/components/Pagination` |
| PriceSlider | `src/components/PriceSlider` |
| ProgressBar | `src/components/ProgressBar` |
| SelectionControls | `src/components/SelectionControls` |
| SelectionList | `src/components/SelectionList` |
| SideDrawer | `src/components/SideDrawer` |
| Stepper | `src/components/Stepper` |
| Table | `src/components/Table` |
| TableColumnFilter | `src/components/TableColumnFilter` |
| Tabs | `src/components/Tabs` |
| Ticker | `src/components/Ticker` |
| TimePickerComponent | `src/components/TimePickerComponent` |
| Toast | `src/components/Toast` |
| Toggle | `src/components/Toggle` |
| ToolTip | `src/components/ToolTip` |
| Upload | `src/components/Upload` |
| Wallet | `src/components/Wallet` |

---

## How to use this skill

When the user asks you to build UI using DLS components or icons:

1. **Read the relevant component source** before using it — check its `index.ts` or `index.tsx` to understand props and exports.
2. **Prefer DLS components** over plain HTML elements wherever a component exists.
3. **Use icons from `icons/index.tsx`** for any iconography — do not use external icon libraries.
4. **Check component props** from the `.tsx` source file before writing usage code.
5. When the user asks "what components are available" or "what icons exist", refer to this file.

## Example

```tsx
import { Button } from './src/components/Button';
import { Input } from './src/components/Input';
import { SearchIcon, CloseIcon } from './icons';

function SearchBar() {
  return (
    <div>
      <Input prefix={<SearchIcon width={16} height={16} />} placeholder="Search..." />
      <Button>Search</Button>
    </div>
  );
}
```
