<script>
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"
  import Fa from "svelte-fa"
  import { faCheck } from "$lib/icons"

  import DrawingPad from "$lib/DrawingPad.svelte"
  import { getUser } from "$lib/user"
  import { posts } from "$lib/api"

  let me

  onMount(() => {
    let destroyed = false
    $getUser()
      .then((user) => {
        if (destroyed) return
        if (!user) goto("/")
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

  let values = {}
  let getPadDataURL

  $: canSubmit = Object.values(values).some(Boolean)

  const submit = () => {
    const data = {}
    if (values.hasDrawing) data.image = getPadDataURL()
    if (values.title) data.title = values.title
    if (values.description) data.description = values.description
    posts
      .create(me, data)
      .then(() => {
        goto("/")
      })
      .catch((err) => {
        console.error("Failed to create post", err)
      })
  }
</script>

<div class="section">
  <div class="container">
    <h1 class="title">Nouvelle idée 💡</h1>
    <div class="subtitle">
      Poste une idée qui brille et/ou un croquis qui claque pour recevoir de l'<strong
        >amour</strong
      >&nbsp;!
    </div>
  </div>
</div>

<div class="container px-5">
  <form class="container" on:submit|preventDefault={submit}>
    <div class="field">
      <label for="title" class="label">Titre</label>
      <div class="control">
        <input id="title" bind:value={values.title} class="input" type="text" />
      </div>
    </div>

    <div class="field">
      <label for="image" class="label">Illustration</label>
      <div class="control" id="field-image">
        <DrawingPad
          bind:getDataURL={getPadDataURL}
          bind:hasData={values.hasDrawing}
        />
      </div>
    </div>

    <div class="field">
      <label for="description" class="label">Message</label>
      <div class="control">
        <textarea
          id="description"
          class="textarea"
          bind:value={values.description}
        />
      </div>
    </div>

    <div class="buttons are-medium">
      <button class="submit button is-primary" disabled={!canSubmit}>
        <span class="icon">
          <Fa icon={faCheck} />
        </span>
        <span>Envoyer&nbsp;!</span>
      </button>
      <a href="/" class="button">Annuler</a>
    </div>
  </form>
</div>

<style lang="scss">
  form {
    max-width: 600px;
  }

  .buttons {
    margin-top: 1rem;
    padding-top: 1rem;
    position: sticky;
    bottom: 0;
    background: $body-background-color;
    box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
    margin: 0 -1.5rem;
    padding: 1rem 1.5rem 0.5rem;
  }

  #field-image > :global(*) {
    max-height: 45vh;
  }
</style>
