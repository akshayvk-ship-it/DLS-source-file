/* eslint-disable no-console */
import {
  AccountDashboardIcon,
  AddIcon,
  BankIcon,
  HelpIcon,
  LogoutIcon,
  ReportsIcon,
  SavedPaymentIcon,
  SettlementReconIcon,
  SupportIcon,
  UserManagementIcon,
} from '../../../Icons';
import { NavItem, SidebarAccount, SidebarAccountMenu } from './types';

export const navMain: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: AccountDashboardIcon,
    iconClassName: '[&_path]:fill-icon-on-fill',
    iconHoverClassName: 'group-hover/sidebar-button:[&_path]:fill-icon-action',
    iconActiveClassName: '[&_path]:fill-icon-action',
  },
  {
    title: 'Transactions',
    url: '/transactions',
    icon: SavedPaymentIcon,
    iconClassName: '[&_path]:fill-icon-on-fill',
    iconHoverClassName: 'group-hover/sidebar-button:[&_path]:fill-icon-action',
    iconActiveClassName: '[&_path]:fill-icon-action',
    items: [
      {
        title: 'Payments',
        url: '/payments',
      },
      {
        title: 'Repush',
        url: '/repush',
      },
    ],
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: ReportsIcon,
    iconClassName: '[&_path]:fill-icon-on-fill',
    iconHoverClassName: 'group-hover/sidebar-button:[&_path]:fill-icon-action',
    iconActiveClassName: '[&_path]:fill-icon-action',
    items: [
      {
        title: 'TID',
        url: '/tid',
      },
      {
        title: 'Commissions',
        url: '/commissions',
      },
      {
        title: 'Templates',
        url: '/templates',
      },
      {
        title: 'Configuration OU',
        url: '/configuration-ou',
      },
    ],
  },
  {
    title: 'Merchant Manager',
    url: '/merchant-manager',
    icon: BankIcon,
    iconClassName: '[&_path]:fill-icon-on-fill',
    iconHoverClassName: 'group-hover/sidebar-button:[&_path]:fill-icon-action',
    iconActiveClassName: '[&_path]:fill-icon-action',
    items: [
      {
        title: 'Configuration',
        url: '/configuration',
      },
      {
        title: 'Offline Billers',
        url: '/offline-billers',
      },
      {
        title: 'Add Billers',
        url: '/add-billers',
      },
      {
        title: 'Account Details',
        url: '/account-details',
      },
    ],
  },
  {
    title: 'Settlement Recon',
    url: '/settlement-recon',
    icon: SettlementReconIcon,
    iconClassName: '[&_path]:stroke-icon-on-fill',
    iconHoverClassName:
      'group-hover/sidebar-button:[&_path]:stroke-icon-action',
    iconActiveClassName: '[&_path]:stroke-icon-action',
    items: [
      {
        title: 'Settlement Tracker',
        url: '/settlement-tracker',
      },
      {
        title: 'Summary',
        url: '/summary',
      },
    ],
  },
  {
    title: 'User Management',
    url: '/user-management',
    icon: UserManagementIcon,
    iconClassName: '[&_path]:stroke-icon-on-fill',
    iconHoverClassName:
      'group-hover/sidebar-button:[&_path]:stroke-icon-action',
    iconActiveClassName: '[&_path]:stroke-icon-action',
  },
];

export const navSecondary: NavItem[] = [
  {
    title: 'Help',
    url: '/help',
    icon: HelpIcon,
    iconClassName: '[&_path]:fill-icon-on-fill ',
    iconHoverClassName: 'group-hover/sidebar-button:[&_path]:fill-icon-action',
    iconActiveClassName: '[&_path]:fill-icon-action',
  },
  {
    title: 'Support',
    url: '/support',
    icon: SupportIcon,
    iconClassName: '[&_path]:fill-icon-on-fill ',
    iconHoverClassName: 'group-hover/sidebar-button:[&_path]:fill-icon-action',
    iconActiveClassName: '[&_path]:fill-icon-action',
  },
  {
    title: 'Feedback',
    url: '/feedback',
    icon: UserManagementIcon,
    iconClassName: '[&_path]:stroke-icon-on-fill',
    iconHoverClassName:
      'group-hover/sidebar-button:[&_path]:stroke-icon-action',
    iconActiveClassName: '[&_path]:stroke-icon-action',
  },
];

export const sidebarAccount: SidebarAccount = {
  name: 'John Doe',
  email: 'john.doe@billdesk.com',
};

export const sidebarAccountMenu: SidebarAccountMenu = [
  {
    title: 'Profile',
    icon: UserManagementIcon,
    url: '/profile',
    onClick: (e) => console.log(e, 'Profile clicked'),
  },
  {
    title: 'User',
    icon: AddIcon,
    url: '/user',
    onClick: (e) => console.log(e, 'User clicked'),
  },
  {
    title: 'Logout',
    icon: LogoutIcon,
    url: '/logout',
    onClick: (e) => console.log(e, 'Logout clicked'),
    iconClassName: '[&_path]:fill-icon-action',
    textClassName: '!text-icon-action',
  },
];
