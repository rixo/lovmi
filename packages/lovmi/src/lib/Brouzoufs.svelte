<script>
  export let value = 0

  export let raw = false

  $: formatted = String(Number(value).toFixed(2)).replace(".", ",")
</script>

{#if !raw}₿&nbsp;{/if}{formatted}
