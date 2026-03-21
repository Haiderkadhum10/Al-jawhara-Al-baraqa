const DB_NAME = "heroMediaDB";
const STORE_NAME = "videos"; 

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
            if (!req.result.objectStoreNames.contains(STORE_NAME)) {
                req.result.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

const channel = new BroadcastChannel('mediaUpdateChannel');

export const watchMediaUpdates = (callback: (key: string) => void) => {
    const handler = (event: MessageEvent) => { callback(event.data.key); };
    channel.addEventListener('message', handler);
    
    const windowHandler = (e: any) => callback(e.detail.key);
    window.addEventListener('mediaStorageUpdate', windowHandler as any);
    
    return () => {
        channel.removeEventListener('message', handler);
        window.removeEventListener('mediaStorageUpdate', windowHandler as any);
    };
};

export async function saveMediaBlob(key: string, blob: Blob): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(blob, key);
        tx.oncomplete = () => {
            window.dispatchEvent(new CustomEvent("mediaStorageUpdate", { detail: { key } }));
            channel.postMessage({ key });
            resolve();
        };
        tx.onerror = () => reject(tx.error);
    });
}

export async function loadMediaBlob(key: string): Promise<Blob | null> {
    const db = await openDB();
    return new Promise((resolve) => {
        const req = db.transaction(STORE_NAME).objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve((req.result as Blob) ?? null);
        req.onerror = () => resolve(null);
    });
}

export async function deleteMediaBlob(key: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => {
            window.dispatchEvent(new CustomEvent("mediaStorageUpdate", { detail: { key } }));
            channel.postMessage({ key });
            resolve();
        };
    });
}
