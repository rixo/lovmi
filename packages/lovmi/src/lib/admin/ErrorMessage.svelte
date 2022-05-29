<script>
  import Fa from "svelte-fa"
  import { faTriangleExclamation } from "$lib/icons"

  export let error
</script>

{#if error}
  <div class="block has-text-danger">
    <p class="icon-text">
      <span class="icon">
        <Fa icon={faTriangleExclamation} />
      </span>
      <span>Ça n'a pas marché :(</span>
    </p>
  </div>
  <pre class="block">{error}</pre>
{/if}
