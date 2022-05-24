<script>
  import { login, auth, loading } from "$lib/admin"
  import Login from "$lib/admin/Login.svelte"
  import Admin from "$lib/admin/Admin.svelte"
</script>

{#if $loading}
  <span />
{:else if $auth}
  <Admin />
{:else}
  <Login />
{/if}
