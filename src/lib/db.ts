// Simple IndexedDB utility for CRUD operations
export function openDB(dbName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // Always use the latest version number
    const request = indexedDB.open(dbName, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("health")) db.createObjectStore("health", { keyPath: "id" });
      if (!db.objectStoreNames.contains("diet")) db.createObjectStore("diet", { keyPath: "id" });
      if (!db.objectStoreNames.contains("exercise")) db.createObjectStore("exercise", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addRecord<T>(dbName: string, storeName: string, record: T) {
  const db = await openDB(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(record);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllRecords<T>(dbName: string, storeName: string): Promise<T[]> {
  const db = await openDB(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
