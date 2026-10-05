export type LocalReviewStorage = Pick<Storage, "getItem" | "setItem">;

export function loadReviewAutosave<T = Record<string, unknown>>(storage: LocalReviewStorage, key: string) {
  const raw = storage.getItem(key);
  return raw ? JSON.parse(raw) as T : null;
}

export function saveReviewAutosave(storage: LocalReviewStorage, key: string, value: unknown) {
  storage.setItem(key, JSON.stringify(value));
}
