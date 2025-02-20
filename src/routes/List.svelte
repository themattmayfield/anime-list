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

<div>
  <h2 class="text-xl mb-4 text-white">{title}</h2>
  <ul class="space-y-2 pl-3">
    {#each list as anime}
      <li class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          {#if anime.inProgress}
            <span class="text-noice">⌛</span>
          {/if}
          <span>{anime.title}</span>
        </div>
        <div class="flex items-center gap-2">
          {#if anime.rating !== undefined}
            <span class="text-yellow-400">{"★".repeat(anime.rating)}</span>
          {/if}
        </div>
        {#if admin?.isAdmin}
          <button
            onclick={() => admin?.handleMoveToWatched?.(anime._id)}
            class="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700"
          >
            Move to Watched
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</div>
