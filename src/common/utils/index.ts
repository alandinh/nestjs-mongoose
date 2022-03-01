import { isEmail } from "class-validator";

export const validateEmail = (address: string, fieldName: string) => {
  if (!isEmail(address)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};
