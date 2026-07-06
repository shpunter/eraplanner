import { loadShare, saveShare } from "#/server/share";

const DB_NAME = "eraplanner";
const STORE_NAME = "state";
const IDB_KEYS = ["castles", "history", "laws", "mines", "resources"] as const;
export const SHARE_STORAGE_KEY = "__shareId";
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

/** Reads all IDB stores, uploads them to KV, and returns a short share URL. */
export const encodeShareURL = async (): Promise<string> => {
  const state = await readAllKeys();
  const { id } = await saveShare({ data: { state: JSON.stringify(state) } });
  const url = new URL(location.href);

  url.search = `?share=${id}`;
  url.hash = "";

  return url.toString();
};

/**
 * Detects a `?share=` query param, saves the ID to sessionStorage, and
 * strips the param from the URL. The actual KV fetch + IDB write happens
 * later via `applyPendingShare` — after a React confirmation modal if needed.
 */
export const applyShareParam = (): void => {
  const params = new URLSearchParams(location.search);
  const id = params.get("share");
  if (!id) return;

  sessionStorage.setItem(SHARE_STORAGE_KEY, id);
  params.delete("share");
  const search = params.toString();
  history.replaceState(
    null,
    "",
    location.pathname + (search ? `?${search}` : ""),
  );
};

/** True when IDB has any previously saved data (user has an existing build). */
export const hasExistingData = async (): Promise<boolean> => {
  const existing = await readAllKeys();
  return Object.keys(existing).length > 0;
};

/**
 * Fetches the shared state from KV by ID, writes it to IDB, clears
 * sessionStorage, then reloads so all stores hydrate from the new data.
 */
export const applyPendingShare = async (id: string): Promise<void> => {
  const { state } = await loadShare({ data: { id } });
  const raw: SharedState = JSON.parse(state);
  await writeAllKeys(raw);
  sessionStorage.removeItem(SHARE_STORAGE_KEY);

  // Replace (not push) so the back button doesn't loop back to the share URL.
  location.replace(location.pathname + location.search);
};
