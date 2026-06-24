import React from 'react';

const icon = (d: string) => React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => React.createElement('svg', { viewBox:'0 0 20 20', fill:'none', xmlns:'http://www.w3.org/2000/svg', ref, width:20, height:20, ...props },
    React.createElement('path', { d, stroke:'currentColor', strokeWidth:'1.5', strokeLinecap:'round', strokeLinejoin:'round' })
  )
);

export const CloseIcon = icon('M15 5L5 15M5 5l10 10');
export const ChevronDownIcon = icon('M5 8l5 5 5-5');
export const ChevronUpIcon = icon('M5 12l5-5 5 5');
export const ChevronLeftIcon = icon('M12 5l-5 5 5 5');
export const ChevronRightIcon = icon('M8 5l5 5-5 5');
export const CalendarIcon = icon('M3 6h14M3 10h14M3 14h8M6 3v2M14 3v2');
export const TimerIcon = icon('M10 2a8 8 0 100 16A8 8 0 0010 2zM10 6v4l3 3');
export const ResetIcon = icon('M3 10a7 7 0 117 7M3 10V6M3 10H7');
export const FilterDefaultIcon = icon('M3 6h14M6 10h8M9 14h2');
export const PinIcon = icon('M10 2l2 6h4l-3.3 4 1.3 6L10 15l-4 3 1.3-6L4 8h4l2-6z');
export const PinnedIcon = icon('M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5l2-5z');
export const InfoWithBorderIcon = icon('M10 9v5M10 7h.01');
export const SearchMI = icon('M9 4a5 5 0 100 10A5 5 0 009 4zM16 16l-3.5-3.5');
export const SettingsIcon = icon('M10 13a3 3 0 100-6 3 3 0 000 6zM10 2v2M10 16v2M2 10h2M16 10h2');
export const AddIcon = icon('M10 4v12M4 10h12');
export const BankIcon = icon('M2 10L10 3l8 7M4 10v7h12v-7');
export const DeleteIcon = icon('M4 6h12M8 6V4h4v2M9 10v5M11 10v5M5 6l1 11h8l1-11');
export const EditIcon = icon('M14 3l3 3L6 17H3v-3L14 3z');
export const SearchIcon = icon('M9 4a5 5 0 100 10A5 5 0 009 4zM16 16l-3.5-3.5');
export const DownloadIcon = icon('M10 3v10M6 9l4 4 4-4M3 15v2h14v-2');
export const UploadIcon = icon('M10 13V3M6 7l4-4 4 4M3 15v2h14v-2');
export const CopyIcon = icon('M7 7h10v10H7zM3 13V3h10');
export const InfoIcon = icon('M10 9v5M10 7h.01');
export const WarningIcon = icon('M10 2L18.66 17H1.34L10 2zM10 9v3M10 14h.01');
export const TickIcon = icon('M4 10l4 4 8-8');
export const LogoutIcon = icon('M13 10H3M10 13l3-3-3-3M7 5H4a1 1 0 00-1 1v8a1 1 0 001 1h3');
export const UserManagementIcon = icon('M9 11a4 4 0 100-8 4 4 0 000 8zM3 19a6 6 0 0112 0');
export const BilldeskCollapsedLogo = () => React.createElement('svg', { viewBox:'0 0 28 28', fill:'none' },
  React.createElement('rect', { width:28, height:28, rx:7, fill:'#f15701' }),
  React.createElement('text', { x:5, y:20, fontSize:14, fontWeight:'800', fill:'#fff', fontFamily:'sans-serif' }, 'B')
);
export const BilldeskLogo = () => React.createElement('svg', { viewBox:'0 0 100 28', fill:'none' },
  React.createElement('rect', { width:28, height:28, rx:7, fill:'#f15701' }),
  React.createElement('text', { x:5, y:20, fontSize:14, fontWeight:'800', fill:'#fff', fontFamily:'sans-serif' }, 'B'),
  React.createElement('text', { x:35, y:19, fontSize:13, fontWeight:'700', fill:'#1b2029', fontFamily:'sans-serif' }, 'BillDesk')
);
