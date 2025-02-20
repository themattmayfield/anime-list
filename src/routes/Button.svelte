<script lang="ts">
  let {
    label,
    type,
    variant = "default",
    onclick,
  }: {
    label: string;
    onclick?: () => void;
    type: "button" | "submit";
    variant?: "default" | "primary" | "outline";
  } = $props();

  const variants = {
    default: "bg-secondary/50 hover:bg-secondary/70 text-noice-light",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-borders hover:bg-secondary/20 text-noice-light",
  };
</script>

<button
  {onclick}
  {type}
  class="px-3 py-1 rounded-md transition-colors duration-200 cursor-pointer {variants[
    variant
  ]}"
>
  {label}
</button>
