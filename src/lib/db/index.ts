import { clientStore } from "$lib/stores.svelte";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function addAnime({
  title,
  rating,
  isRecommendation,
  inProgress,
}: {
  title: string;
  rating: number | undefined;
  isRecommendation: boolean;
  inProgress: boolean;
}) {
  clientStore.value?.mutation(api.anime.add, {
    title,
    rating,
    isRecommendation,
    inProgress,
  });
}

export function moveToWatchedList({
  id,
  rating,
  inProgress,
}: {
  id: Id<"animes">;
  rating: number | undefined;
  inProgress: boolean;
}) {
  if (!rating) return;

  clientStore.value?.mutation(api.anime.moveToWatched, {
    id,
    rating,
    inProgress,
  });
}
