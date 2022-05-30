<script>
  import ErrorMessage from "./ErrorMessage.svelte"

  export let action

  $: state = action.state
</script>

<ErrorMessage error={$state.error} />

<button
  type="button"
  class="button is-danger"
  class:is-loading={$state.loading}
  on:click={action}
>
  <slot />
</button>
