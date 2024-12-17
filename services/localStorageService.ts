// services/localStorageService.ts
import { deriveKey, encryptData, decryptData } from "@/utils/encryption";

export class LocalStorageService {
  private encryptionKey: string;

  constructor(userInfo: { email: string }) {
    this.encryptionKey = deriveKey(userInfo);
  }

  // Save game session to localStorage
  async saveGameSession(gameSession: any): Promise<void> {
    try {
      const encryptedData = encryptData(gameSession, this.encryptionKey);
      localStorage.setItem('gameSession', encryptedData);
    } catch (error) {
      console.error('Error saving to localStorage', error);
      throw error;
    }
  }

  // Retrieve game session from localStorage
  async getGameSession(): Promise<any> {
    try {
      const encryptedData = localStorage.getItem('gameSession');
      if (encryptedData) {
        return decryptData(encryptedData, this.encryptionKey);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error retrieving from localStorage', error);
      throw error;
    }
  }

  // Clear game session data from localStorage
  async clearGameSession(): Promise<void> {
    try {
      localStorage.removeItem('gameSession');
    } catch (error) {
      console.error('Error clearing from localStorage', error);
      throw error;
    }
  }
}
