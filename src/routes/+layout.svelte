<script lang="ts">
  import { PUBLIC_CONVEX_URL } from "$env/static/public";
  import { clientStore } from "$lib/stores.svelte";
  import { setupConvex, useConvexClient } from "convex-svelte";
  import "../app.css";

  const { children } = $props();
  setupConvex(PUBLIC_CONVEX_URL);
  clientStore.value = useConvexClient();
</script>

{@render children()}
