<script>
  import { page } from "$app/stores"
  import Success from "./_Success.svelte"
  import Error from "./_Error.svelte"

  $: data = JSON.parse(atob($page.params.id))
</script>

{#if data.success}
  <Success {...data} />
{:else}
  <Error {...data} />
{/if}
