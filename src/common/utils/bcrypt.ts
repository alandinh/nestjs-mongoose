import { hashSync, compare } from "bcrypt";

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export const generateHash = (password: string): string => {
  return hashSync(password, 10);
};

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export const validateHash = (
  password: string,
  hash?: string,
): Promise<boolean> => {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return compare(password, hash);
};
