import { ErrorHandler } from "./custom.config"; 

export type PaymentMethod = "BCA" | "MANDIRI" | "BRI";


export interface PaymentAccountInfo {
  bank: string;
  account_name: string;
  account_number: string;
}

const accounts: Record<PaymentMethod, PaymentAccountInfo> = {
  BCA: {
    bank: "BCA",
    account_name: "Rizqy Alfan",
    account_number: "1234567890",
  },
  MANDIRI: {
    bank: "Mandiri",
    account_name: "Rizqy Alfan",
    account_number: "9876543210",
  },
  BRI: {
    bank: "BRI",
    account_name: "Rizqy Alfan",
    account_number: "1122334455",
  },
};

export const getPaymentAccount = (method: string): PaymentAccountInfo => {
  const normalized = method.toUpperCase() as PaymentMethod;

  if (!(normalized in accounts)) {
    throw new ErrorHandler(400, `Metode pembayaran '${method}' tidak dikenali`);
  }

  return accounts[normalized];
};
