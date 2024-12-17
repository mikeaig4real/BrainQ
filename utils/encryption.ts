import CryptoJS from 'crypto-js';

interface UserInfo {
  email: string;
}

// Function to derive a stronger encryption key using PBKDF2 and email as salt
export const deriveKey = (userInfo: UserInfo): string => {
  const salt = CryptoJS.SHA256(userInfo.email).toString(); // Hash email to get a salt
  const iterations = 100000; // Adjust iterations for better security
  return CryptoJS.PBKDF2(JSON.stringify(userInfo), salt, { keySize: 256 / 32, iterations }).toString();
};

// Encrypt function: derives a key from user info (email as salt), then encrypts data
export const encryptData = (data: any, key: string): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// Decrypt function: derives the key from user info (email as salt), then decrypts data
export const decryptData = (encryptedData: string, key: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
