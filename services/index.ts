// services/storageService.ts
import { LocalStorageService } from "./localStorageService";
import { IndexedDBService } from "./indexedDBService";

export class StorageService {
  private localStorageService: LocalStorageService;
  private indexedDBService: IndexedDBService;
  private useIndexedDB: boolean;

  constructor(userInfo: { email: string }) {
    this.localStorageService = new LocalStorageService(userInfo);
    this.indexedDBService = new IndexedDBService(userInfo);
    this.useIndexedDB = this.checkDBSupport();
  }

  private checkDBSupport(): boolean {
    return window.indexedDB !== undefined;
  }

  async saveGameSession(gameSession: any): Promise<void> {
    if (this.useIndexedDB) {
      await this.indexedDBService.saveGameSession(gameSession);
    } else {
      await this.localStorageService.saveGameSession(gameSession);
    }
  }

  async getGameSession(): Promise<any> {
    if (this.useIndexedDB) {
      return await this.indexedDBService.getGameSession();
    } else {
      return await this.localStorageService.getGameSession();
    }
  }

  async clearGameSession(): Promise<void> {
    if (this.useIndexedDB) {
      await this.indexedDBService.clearGameSession();
    } else {
      await this.localStorageService.clearGameSession();
    }
  }
}
