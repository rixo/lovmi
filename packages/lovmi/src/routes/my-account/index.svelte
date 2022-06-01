<script>
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"

  import { getUser } from "$lib/user"

  let me

  onMount(() => {
    let destroyed = false
    $getUser()
      .then((user) => {
        if (destroyed) return
        if (!user) goTo("/")
        me = user
      })
      .catch((err) => {
        console.error("Error", err)
        if (destroyed) return
        goto("/")
      })
    return () => {
      destroyed = true
    }
  })
</script>

{#if me}
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <p class="title">Mon compte</p>
        <p class="subtitle">
          Manage <strong>yourself</strong>
        </p>
      </div>
    </div>
  </section>

  <div class="block">
    <div class="container">...</div>
  </div>
{/if}
