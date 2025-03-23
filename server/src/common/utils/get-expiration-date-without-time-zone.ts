// maxAge in milliseconds
export const getExpirationDateWithoutTimeZone = (maxAge: number) => {
  const expirationDate = new Date();

  expirationDate.setMinutes(expirationDate.getMinutes() + expirationDate.getTimezoneOffset());
  expirationDate.setTime(expirationDate.getTime() - maxAge);

  return expirationDate;
};
