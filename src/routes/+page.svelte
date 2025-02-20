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
    animes.data?.filter((anime) => !anime.isRecommendation) || []
  );
  let recommendedAnimes = $derived(
    animes.data?.filter((anime) => anime.isRecommendation) || []
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
</script>

<main class="min-h-screen bg-primary text-noice p-8">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Anime Tracker</h1>

    <!-- Action Buttons -->
    <div class="flex gap-2 mb-8">
      <Button
        label="Recommend"
        onclick={() => {
          addNewAnime.isRecommendation = true;
          showRecommendModal = true;
        }}
      />
      <Button
        label="Add"
        onclick={() => {
          addNewAnime.isRecommendation = false;
          showAddModal = true;
        }}
      />
    </div>

    <!-- Recommend Modal -->
    {#if showRecommendModal}
      <div
        class="fixed inset-0 bg-black/90 flex items-center justify-center"
        onclick={() => (showRecommendModal = false)}
        role="none"
      >
        <div
          class="bg-secondary p-6 rounded-lg w-96"
          onclick={(e) => e.stopPropagation()}
          role="none"
        >
          <h2 class="text-xl mb-4">Recommend an Anime</h2>
          <input
            type="text"
            bind:value={addNewAnime.title}
            placeholder="Anime title"
            class="w-full px-3 py-2 bg-input rounded text-white mb-4 focus:outline-none"
          />
          <div class="flex justify-end gap-2">
            <Button
              label="Cancel"
              onclick={() => {
                showRecommendModal = false;
                addNewAnime.title = "";
              }}
            />
            <Button label="Submit" onclick={handleAddAnime} />
          </div>
        </div>
      </div>
    {/if}

    <!-- Add Anime Modal -->
    {#if showAddModal}
      <div
        class="fixed inset-0 bg-black/90 flex items-center justify-center"
        onclick={() => (showAddModal = false)}
        role="none"
      >
        <div
          class="bg-secondary p-6 rounded-lg w-96"
          onclick={(e) => e.stopPropagation()}
          role="none"
        >
          <h2 class="text-xl mb-4">Add New Anime</h2>
          <input
            type="text"
            bind:value={addNewAnime.title}
            placeholder="Anime title"
            class="w-full px-3 py-2 bg-input rounded text-white mb-4 focus:outline-none"
          />
          <input
            type="number"
            bind:value={addNewAnime.rating}
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            class="w-full px-3 py-2 bg-input rounded text-white mb-4 focus:outline-none"
          />
          <label class="flex items-center gap-2 mb-4">
            <input type="checkbox" bind:checked={addNewAnime.inProgress} />
            In Progress
          </label>
          <input
            type="password"
            bind:value={password}
            placeholder="Enter admin password"
            class="w-full px-3 py-2 bg-input rounded text-white mb-4 focus:outline-none"
          />
          <div class="flex justify-end gap-2">
            <Button
              label="Cancel"
              onclick={() => {
                showAddModal = false;
                addNewAnime.title = "";
                addNewAnime.rating = undefined;
                addNewAnime.inProgress = false;
                password = "";
              }}
            />
            <Button label="Submit" onclick={handleAddAnime} />
          </div>
        </div>
      </div>
    {/if}

    <div class="flex flex-col gap-8">
      <!-- Watched anime list -->
      <List title="Watched Anime" list={watchedAnimes} />

      <!-- Recommended anime list -->
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
