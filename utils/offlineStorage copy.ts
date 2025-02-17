import { MMKV } from 'react-native-mmkv';
import logger from './logger';

import { SyncStoragePersister, TokenResponse } from '@gofiled/react-ui';
const ENCRYPTION_KEY = 'MY_APP_KEY';

export const APP_KEY = 'app';
export type StorageKey =
  | 'tokenResponse'
  | 'currentUser'
  | 'currentCompany'
  | 'firebaseToken'
  | (string & {});
type Callback = (value: string | undefined) => void;
class OfflineStorage {
  readonly storage = new MMKV({ id: APP_KEY, encryptionKey: ENCRYPTION_KEY });

  listeners = new Map<StorageKey, Array<Callback>>();

  constructor() {
    this.init();
  }

  private init() {
    // logger.log('offline keys =', this.storage.getAllKeys());
    this.storage.addOnValueChangedListener((changedKey) => {
      if (this.listeners.has(changedKey as StorageKey)) {
        const value = this.get(changedKey as StorageKey);
        const callbacks = this.listeners.get(changedKey as StorageKey)!;
        callbacks.forEach((cb) => cb(value));
      }
    });
  }

  get(key: StorageKey): string | undefined {
    return this.storage.getString(key);
  }

  set(key: StorageKey, value: string) {
    if (typeof value !== 'string') {
      logger.error(`key ${key} is not a string, but we got ${typeof value}`);
    }
    return this.storage.set(key, value);
  }

  listen(Key: StorageKey, callback: (value: string | undefined) => void) {
    if (!this.listeners.has(Key)) {
      this.listeners.set(Key, []);
    }
    this.listeners.get(Key)!.push(callback);
    return () => {
      const callbacks = this.listeners.get(Key)!;
      callbacks.splice(callbacks.indexOf(callback), 1);
    };
  }

  getAsObject<T>(key: StorageKey): T | undefined {
    const objString = this.storage.getString(key);
    if (!objString) {
      return undefined;
    }
    try {
      return JSON.parse(objString) as T;
    } catch (error) {
      return undefined;
    }
  }

  getString(key: StorageKey): string | undefined {
    return this.storage.getString(key);
  }

  clearKey(key: StorageKey) {
    return this.storage.delete(key);
  }

  clearAll() {
    return this.storage.clearAll();
  }
}

export const idpStoragePersister: SyncStoragePersister = {
  getTokenResponse() {
    const result = offlineStorage.getAsObject<TokenResponse>('tokenResponse');
    if (result) {
      return result;
    }
    return null;
  },
  removeTokenResponse() {
    offlineStorage.clearKey('tokenResponse');
  },
  saveTokenResponse(tokenResponse) {
    offlineStorage.set('tokenResponse', JSON.stringify(tokenResponse));
  },
} as const;

export const offlineStorage = new OfflineStorage();
