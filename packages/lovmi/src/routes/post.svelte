<script>
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"
  import Fa from "svelte-fa"
  import { faCheck } from "$lib/icons"
  import { scrollToTop } from "$lib/util/scrollIntoView"

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

  const scrollIntoView = (e) => {
    scrollToTop(e.target)
    // e.target.scrollIntoViewIfNeeded()
  }

  let activeTab = "drawing"

  const handleTabClick = (e) => {}
</script>

<main class="container">
  <div class="section">
    <div class="container">
      <h1 class="title">Nouvelle idée 💡</h1>
      <div class="subtitle">
        Poste une idée qui brille et/ou un croquis qui claque pour recevoir de
        l'<strong>amour</strong>&nbsp;!
      </div>
    </div>
  </div>

  <form on:submit|preventDefault={submit}>
    <div class="field">
      <input
        placeholder="Titre"
        id="title"
        bind:value={values.title}
        class="input"
        type="text"
        on:focus={scrollIntoView}
      />
    </div>

    <div class="tabs">
      <ul>
        <li class:is-active={activeTab === "drawing"}>
          <a href on:click|preventDefault={() => (activeTab = "drawing")}>
            Illustration
          </a>
        </li>
        <li class:is-active={activeTab === "message"}>
          <a href on:click|preventDefault={() => (activeTab = "message")}>
            Message
          </a>
        </li>
      </ul>
    </div>

    <div class="flex">
      {#if activeTab == null || activeTab === "drawing"}
        <div class="field">
          <DrawingPad
            bind:getDataURL={getPadDataURL}
            bind:hasData={values.hasDrawing}
            on:focus={scrollIntoView}
          />
        </div>
      {/if}

      {#if activeTab == null || activeTab === "message"}
        <div class="field">
          <textarea
            id="description"
            class="textarea"
            placeholder="Vous pouvez entrer un message..."
            bind:value={values.description}
            on:focus={scrollIntoView}
          />
        </div>
      {/if}
    </div>

    <div class="buttons are-medium">
      <button class="submit button is-primary" disabled={!canSubmit}>
        <span class="icon">
          <Fa icon={faCheck} />
        </span>
        <span>Envoyer&nbsp;!</span>
      </button>
      <a
        href="/"
        class="button"
        on:click={(e) => {
          const currentHref = window.location.href
          history.back()
          if (window.location.href !== currentHref) {
            e.preventDefault()
          }
        }}>Annuler</a
      >
    </div>
  </form>
</main>

<style lang="scss">
  .section {
    padding-left: 0;
  }

  form {
    max-width: 600px;
  }

  .flex {
    /* flex: 1; */
    height: 23rem;
  }

  .buttons {
    margin-top: 1rem;
    padding-top: 1rem;
    /* position: sticky;
    bottom: 0; */
    background: $body-background-color;
    box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
    margin: 0 -1.5rem;
    padding: 1rem 1.5rem 0.5rem;
  }

  #field-image > :global(*) {
    /* max-height: 45vh; */
  }

  @media screen and (max-width: 768px) {
    main.container {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem 1rem 0.5rem;
      z-index: 31; /* above navbar (30) */
      background: $body-background-color;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    .section:first-child {
      padding-top: 0;
      padding-bottom: 0;
    }
    .section:first-child .subtitle {
      display: none;
    }

    form {
      flex: 1;
    }

    .flex {
      flex: 1;
      height: auto;
      /* max-height: 90vh; */
    }
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: strecth;
  }

  .flex > .field {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .flex > .field > textarea {
    height: 100%;
  }
</style>
