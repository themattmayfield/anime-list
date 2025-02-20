<script lang="ts">
  import { useQuery } from "convex-svelte";
  import { isAdmin } from "$lib/stores.svelte";
  import { api } from "../convex/_generated/api";
  import { addAnime, moveToWatchedList } from "$lib/db/index.js";
  import type { Id } from "../convex/_generated/dataModel";
  import List from "./List.svelte";
  import Button from "./Button.svelte";
  const animes = useQuery(api.anime.get, {});

  let addNewAnime = $state({
    title: "",
    rating: undefined,
    inProgress: false,
    isRecommendation: false,
  });
  let password = $state("");
  let showRecommendModal = $state(false);
  let showAddModal = $state(false);

  const ADMIN_PASSWORD = "anime123";

  let watchedAnimes = $derived(
    animes.data
      ?.filter((anime) => !anime.isRecommendation)
      .sort((a, b) => {
        // Sort in progress items first
        if (a.inProgress && !b.inProgress) return -1;
        if (!a.inProgress && b.inProgress) return 1;
        return 0;
      }) || []
  );
  let recommendedAnimes = $derived(
    animes.data
      ?.filter((anime) => anime.isRecommendation)
      .sort((a, b) => {
        // Sort in progress items first
        if (a.inProgress && !b.inProgress) return -1;
        if (!a.inProgress && b.inProgress) return 1;
        return 0;
      }) || []
  );

  function handleAddAnime() {
    if (!addNewAnime.title) return;
    if (!addNewAnime.isRecommendation && password !== ADMIN_PASSWORD) return;

    addAnime({
      title: addNewAnime.title,
      rating: addNewAnime.isRecommendation ? undefined : addNewAnime.rating,
      isRecommendation: addNewAnime.isRecommendation,
      inProgress: addNewAnime.isRecommendation ? false : addNewAnime.inProgress,
    });

    // Reset form
    addNewAnime.title = "";
    addNewAnime.rating = undefined;
    addNewAnime.inProgress = false;
    addNewAnime.isRecommendation = false;
    password = "";
    showRecommendModal = false;
    showAddModal = false;
  }

  function handleMoveToWatched(id: Id<"animes">) {
    if (!$isAdmin) return;
    if (!addNewAnime.rating) return;

    moveToWatchedList({
      id,
      rating: addNewAnime.rating,
      inProgress: addNewAnime.inProgress,
    });
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    handleAddAnime();
  }
</script>

<main class="min-h-screen bg-primary text-noice">
  <div
    class="flex items-center justify-between mb-8 border-b border-borders p-4"
  >
    <h1 class="text-xl font-bold text-white">MAL</h1>
    <div class="flex gap-3">
      <Button
        type="button"
        label="Recommend"
        variant="outline"
        onclick={() => {
          addNewAnime.isRecommendation = true;
          showRecommendModal = true;
        }}
      />
      <Button
        type="button"
        label="Add"
        variant="outline"
        onclick={() => {
          addNewAnime.isRecommendation = false;
          showAddModal = true;
        }}
      />
    </div>
  </div>
  <div class="max-w-3xl mx-auto">
    <!-- Modal Template (used for both modals) -->
    {#if showRecommendModal || showAddModal}
      <div
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onclick={() =>
          showRecommendModal
            ? (showRecommendModal = false)
            : (showAddModal = false)}
        role="none"
      >
        <div
          class="bg-secondary p-8 rounded-xl w-full max-w-md shadow-xl"
          onclick={(e) => e.stopPropagation()}
          role="none"
        >
          <form onsubmit={handleSubmit} class="space-y-6">
            <h2 class="text-2xl font-medium text-white">
              {showRecommendModal ? "Recommend an Anime" : "Add New Anime"}
            </h2>
            <div class="space-y-4">
              <input
                type="text"
                bind:value={addNewAnime.title}
                placeholder="Anime title"
                class="w-full px-4 py-2.5 bg-input rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />

              {#if !addNewAnime.isRecommendation}
                <input
                  type="number"
                  bind:value={addNewAnime.rating}
                  min="1"
                  max="5"
                  placeholder="Rating (1-5)"
                  class="w-full px-4 py-2.5 bg-input rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <label class="flex items-center gap-3 text-noice-light">
                  <input
                    type="checkbox"
                    bind:checked={addNewAnime.inProgress}
                    class="w-5 h-5 rounded border-gray-600"
                  />
                  In Progress
                </label>
                <input
                  type="password"
                  bind:value={password}
                  placeholder="Enter admin password"
                  class="w-full px-4 py-2.5 bg-input rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              {/if}
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <Button
                label="Cancel"
                type="button"
                variant="outline"
                onclick={() => {
                  showRecommendModal = false;
                  showAddModal = false;
                  addNewAnime.title = "";
                  addNewAnime.rating = undefined;
                  addNewAnime.inProgress = false;
                  password = "";
                }}
              />
              <Button label="Submit" type="submit" variant="primary" />
            </div>
          </form>
        </div>
      </div>
    {/if}

    <div class="space-y-8">
      <List title="Watched Anime" list={watchedAnimes} />
      <List
        title="Recommended Anime"
        list={recommendedAnimes}
        admin={{
          isAdmin: $isAdmin,
          handleMoveToWatched: handleMoveToWatched,
        }}
      />
    </div>
  </div>
</main>
