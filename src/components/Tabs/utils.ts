// eslint-disable-next-line import/prefer-default-export
export const statusBgColor = (status: string) => {
  if (status === 'live') {
    return 'bg-fill-success-medium';
  }
  if (status === 'offline') {
    return 'bg-fill-error-medium';
  }
  return '';
};
