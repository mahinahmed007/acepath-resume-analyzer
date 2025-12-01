// src/lib/storage.ts
// Simple typed localStorage helper for StoredResumeItem

import type { StoredResumeItem } from "../types";

const STORAGE_KEY = "resume_analyzer_history_v1";

/**
 * Load all stored resume items from localStorage.
 */
export function loadAll(): StoredResumeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredResumeItem[];
  } catch (err) {
    console.error("Failed to load resume history:", err);
    return [];
  }
}

/**
 * Save a single StoredResumeItem to localStorage.
 * Appends to the array (most recent first).
 */
export function save(item: StoredResumeItem): void {
  try {
    const all = loadAll();
    // put newest at front
    const next = [item, ...all];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error("Failed to save resume item:", err);
  }
}

/**
 * Optional: helper to remove a stored item by id
 */
export function removeById(id: string): void {
  try {
    const all = loadAll();
    const filtered = all.filter((x) => x.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to remove resume item:", err);
  }
}

/**
 * Optional: clear all history
 */
export function clearAll(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear storage:", err);
  }
}
