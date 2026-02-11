exports.sendSMS = async (phone, message) => {
  console.log("📩 SMS SENT TO:", phone);
  console.log("💬 MESSAGE:", message);
  return true;
};
