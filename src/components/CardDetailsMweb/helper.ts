export const formatCardNumber = (value: string) =>
  value
    .replace(/[^0-9X]/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();

export const getExpiryDate = (value: string) => {
  const expiry = value.replaceAll(/\s/g, '');
  const month = expiry.slice(0, 2);
  const year = expiry.slice(2, 4);

  return {
    month: month || '',
    year: year || '',
  };
};
