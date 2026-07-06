const DB_NAME = "eraplanner";
const STORE_NAME = "state";
const IDB_KEYS = ["castles", "history", "laws", "mines", "resources"] as const;
export const SHARE_STORAGE_KEY = "__shareHash";
type IdbKey = (typeof IDB_KEYS)[number];
type SharedState = Partial<Record<IdbKey, unknown>>;

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const readAllKeys = async (): Promise<SharedState> => {
  const db = await openDB();
  const state: SharedState = {};

  await Promise.all(
    IDB_KEYS.map(
      (key) =>
        new Promise<void>((resolve, reject) => {
          const req = db
            .transaction(STORE_NAME, "readonly")
            .objectStore(STORE_NAME)
            .get(key);

          req.onsuccess = () => {
            if (req.result != null) state[key] = req.result;
            resolve();
          };

          req.onerror = () => reject(req.error);
        }),
    ),
  );

  return state;
};

const writeAllKeys = async (state: SharedState): Promise<void> => {
  const db = await openDB();

  await Promise.all(
    (Object.entries(state) as [IdbKey, unknown][]).map(
      ([key, value]) =>
        new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readwrite");
          tx.objectStore(STORE_NAME).put(value, key);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        }),
    ),
  );
};

const toBase64Url = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf);
  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const fromBase64Url = (s: string): Uint8Array<ArrayBuffer> => {
  const binary = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  const buf = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buf);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
};

const compress = async (data: string): Promise<string> => {
  const stream = new CompressionStream("gzip");
  const writer = stream.writable.getWriter();

  writer.write(new TextEncoder().encode(data));
  writer.close();

  const buf = await new Response(stream.readable).arrayBuffer();
  
  return toBase64Url(buf);
};

const decompress = async (encoded: string): Promise<string> => {
  const bytes = fromBase64Url(encoded);
  const stream = new DecompressionStream("gzip");
  const writer = stream.writable.getWriter();

  writer.write(bytes);
  writer.close();

  const buf = await new Response(stream.readable).arrayBuffer();
  
  return new TextDecoder().decode(buf);
};

/** Reads all IDB stores, compresses them, and returns a full share URL. */
export const encodeShareURL = async (): Promise<string> => {
  const state = await readAllKeys();
  const encoded = await compress(JSON.stringify(state));
  const url = new URL(location.href);
  
  url.hash = `s=${encoded}`;
  
  return url.toString();
};

/**
 * Detects a `#s=` share hash, parks the encoded payload in sessionStorage,
 * and strips the hash from the URL. The actual IDB write happens later via
 * `applyPendingShare` — after a React confirmation modal if needed.
 */
export const applyShareHash = (): void => {
  const hash = location.hash;
  if (!hash.startsWith("#s=")) return;

  sessionStorage.setItem(SHARE_STORAGE_KEY, hash.slice(3));
  history.replaceState(null, "", location.pathname + location.search);
};

/** True when IDB has any previously saved data (user has an existing build). */
export const hasExistingData = async (): Promise<boolean> => {
  const existing = await readAllKeys();
  return Object.keys(existing).length > 0;
};

/**
 * Decodes the given encoded payload, writes it to IDB, clears sessionStorage,
 * then reloads so all stores hydrate from the new data.
 */
export const applyPendingShare = async (encoded: string): Promise<void> => {
  const json = await decompress(encoded);
  const raw: SharedState = JSON.parse(json);
  await writeAllKeys(raw);
  sessionStorage.removeItem(SHARE_STORAGE_KEY);

  // Replace (not push) so the back button doesn't loop back to the hash URL.
  location.replace(location.pathname + location.search);
};
