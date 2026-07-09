export const formatCurrency = (amount) =>
  Number(amount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
