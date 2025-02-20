<script lang="ts">
  let { label, onclick }: { label: string; onclick: () => void } = $props();
</script>

<button
  {onclick}
  class="px-3 py-1 rounded border border-borders text-noice-light cursor-pointer"
>
  {label}
</button>
