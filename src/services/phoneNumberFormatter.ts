const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  return cleaned;
};

export default formatPhoneNumber;
