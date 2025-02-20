<script lang="ts">
  import type { api } from "../convex/_generated/api";
  import type { Id } from "../convex/_generated/dataModel";

  type Anime = typeof api.anime.get._returnType;
  let {
    title,
    list,
    admin,
  }: {
    title: string;
    list: Anime;
    admin?: {
      isAdmin: boolean;
      handleMoveToWatched: (id: Id<"animes">) => void;
    };
  } = $props();
</script>

<div class="bg-secondary/20 rounded-lg p-6">
  <h2 class="text-2xl font-medium mb-6 text-white">{title}</h2>
  <ul class="space-y-4">
    {#each list as anime}
      <li
        class="flex items-center justify-between group hover:bg-secondary/30 p-3 rounded-md transition-colors duration-200"
      >
        <div class="flex items-center gap-3">
          {#if anime.inProgress}
            <span class="text-blue-400">⌛</span>
          {/if}
          <span class="text-noice-light">{anime.title}</span>
        </div>
        <div class="flex items-center gap-4">
          {#if anime.rating !== undefined}
            <span class="text-yellow-400 tracking-wider"
              >{"★".repeat(anime.rating)}</span
            >
          {/if}
          {#if admin?.isAdmin}
            <button
              onclick={() => admin?.handleMoveToWatched?.(anime._id)}
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 rounded-md text-sm text-white"
            >
              Move to Watched
            </button>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</div>
