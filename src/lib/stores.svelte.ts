import { writable } from "svelte/store";
import { ConvexClient } from "convex/browser";

interface ClientStore {
  value: ConvexClient | null;
}

export const isAdmin = writable(false);
export let clientStore = $state<ClientStore>({ value: null });
