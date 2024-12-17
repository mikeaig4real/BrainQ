// services/indexedDBService.ts
import { deriveKey, encryptData, decryptData } from "@/utils/encryption";

const DB_NAME = 'BrainQDB';
const STORE_NAME = 'gameSession';
const DB_VERSION = 1;

export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private encryptionKey: string;
  private isDbInitialized: boolean = false;

  constructor(userInfo: { email: string }) {
    this.encryptionKey = deriveKey(userInfo);
    this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isDbInitialized = true;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  async saveGameSession(gameSession: any): Promise<void> {
    if (!this.isDbInitialized) await this.initDB();
    
    const encryptedData = encryptData(gameSession, this.encryptionKey);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(encryptedData, 'currentSession');

      request.onerror = () => {
        console.error('Error saving to IndexedDB', request.error);
        reject(request.error);
      };
      request.onsuccess = () => resolve();
    });
  }

  async getGameSession(): Promise<any> {
    if (!this.isDbInitialized) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('currentSession');

      request.onerror = () => {
        console.error('Error retrieving from IndexedDB', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        if (request.result) {
          const decryptedData = decryptData(request.result, this.encryptionKey);
          resolve(decryptedData);
        } else {
          resolve(null);
        }
      };
    });
  }

  async clearGameSession(): Promise<void> {
    if (this.isDbInitialized) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete('currentSession');

        request.onerror = () => {
          console.error('Error clearing IndexedDB', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          resolve();
        };
      });
    }
  }
}
