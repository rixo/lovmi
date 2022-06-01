<script>
  import ErrorMessage from "./ErrorMessage.svelte"

  export let action

  let cls = ""
  export { cls as class }

  $: state = action.state
</script>

<ErrorMessage error={$state.error} />

<button
  type="button"
  class="button {cls}"
  class:is-loading={$state.loading}
  on:click={action}
>
  <slot />
</button>
