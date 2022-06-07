<script>
  import { page } from "$app/stores"
  import Success from "./_Success.svelte"
  import Error from "./_Error.svelte"

  $: data = JSON.parse(atob($page.params.id))
  $: ({ recipient, amount, message } = data)
</script>

{#if data.success}
  <Success {recipient} {amount} />
{:else}
  <Error {message} />
{/if}
