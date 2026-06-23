export const PRICING = {
  ethiopia: { amount: 300, currency: "ETB", label: "300 ETB" },
  international: { amount: 5, currency: "USD", label: "$5 USD" },
};

export const ADMIN_EMAIL = "hailetadilo@gmail.com";

export const TEMPLATES = [
  { id: "modern", name: "Modern Professional", desc: "Clean split-column layout" },
  { id: "ats", name: "ATS Friendly", desc: "Optimized for applicant tracking systems" },
  { id: "minimalist", name: "Minimalist", desc: "Elegant and spacious" },
  { id: "corporate", name: "Corporate", desc: "Traditional professional structure" },
  { id: "tech", name: "Tech Resume", desc: "Developer & tech focused" },
  { id: "creative", name: "Creative Professional", desc: "Stand out with style" },
  { id: "international", name: "International CV", desc: "Global standard format" },
];

export const PAYMENT_METHODS = {
  ethiopia: [
    { name: "Commercial Bank of Ethiopia (CBE)", account: "1000123456789", holder: "GlobalCV Pro" },
    { name: "Telebirr", account: "+251912345678", holder: "GlobalCV Pro" },
    { name: "Awash Bank", account: "0123456789012", holder: "GlobalCV Pro" },
  ],
  international: [
    { name: "PayPal", account: "pay@globalcvpro.com", note: "Send as Friends & Family" },
    { name: "Wise (TransferWise)", account: "globalcvpro@wise.com", note: "USD transfer" },
  ],
};
