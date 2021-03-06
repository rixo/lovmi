<script>
  import { goto } from "$app/navigation"
  import Fa from "svelte-fa"
  import { faCheck } from "$lib/icons"
  import { scrollToTop } from "$lib/util/scrollIntoView"

  import DrawingPad from "$lib/DrawingPad.svelte"
  import { posts } from "$lib/api"

  export let createPost

  export let redirect = "/"

  export let forceTitle = ""
  export let initialTitle = ""
  export let initialMessage = ""

  let values = {
    title: forceTitle || initialTitle,
    description: initialMessage,
  }
  let getPadDataURL

  $: canSubmit = Object.values(values).some(Boolean)

  let submitting = false

  const submit = () => {
    const data = {}
    if (values.hasDrawing) data.image = getPadDataURL()
    if (values.title) data.title = values.title
    if (values.description) data.description = values.description
    submitting = true
    createPost(data)
      .then(() => {
        if (redirect) goto(redirect)
      })
      .catch((err) => {
        console.error("Failed to create post", err)
      })
      .finally(() => {
        submitting = false
      })
  }

  const scrollIntoView = (e) => {
    scrollToTop(e.target)
    // e.target.scrollIntoViewIfNeeded()
  }

  let activeTab = "drawing"
</script>

<main class="container">
  <div class="section">
    <div class="container">
      <slot name="title-section">
        <h1 class="title">Nouvelle idée 💡</h1>
        <div class="subtitle">
          Poste une idée qui brille et/ou un croquis qui claque pour recevoir de
          l'<strong>amour</strong>&nbsp;!
        </div>
      </slot>
    </div>
  </div>

  <form on:submit|preventDefault={submit}>
    <div class="field">
      <input
        placeholder="Titre"
        id="title"
        bind:value={values.title}
        readonly={!!forceTitle}
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

    <div class="flex" class:flex-large={activeTab === "drawing"}>
      <div class="field" class:is-hidden={activeTab !== "drawing"}>
        <DrawingPad
          bind:getDataURL={getPadDataURL}
          bind:hasData={values.hasDrawing}
          on:focus={scrollIntoView}
        />
      </div>

      <div class="field" class:is-hidden={activeTab !== "message"}>
        <textarea
          id="description"
          class="textarea"
          placeholder="Vous pouvez entrer un message..."
          bind:value={values.description}
          on:focus={scrollIntoView}
        />
      </div>
    </div>

    <div class="buttons-bar are-medium">
      <button
        class="submit button is-medium is-success"
        disabled={!canSubmit || submitting}
      >
        <span class="icon">
          <Fa icon={faCheck} />
        </span>
        <span>Envoyer&nbsp;!</span>
      </button>
      <a
        href="/"
        class="button is-medium is-danger is-outlined"
        on:click={(e) => {
          const currentHref = window.location.href
          history.back()
          if (window.location.href !== currentHref) {
            e.preventDefault()
          }
        }}
      >
        Annuler
      </a>
    </div>
  </form>
</main>

<style lang="scss">
  main.container {
    padding-bottom: 5rem;
    background: $body-background-color;
  }

  .section {
    padding-left: 0;
  }

  form {
    max-width: 640px;
  }

  .flex {
    height: 23rem;
  }

  .buttons-bar {
    padding: 1rem 0;
    background: $body-background-color;
    .button:not(:first-child) {
      margin-left: 0.5rem;
    }
  }

  @media screen and (max-width: 768px) {
    main.container {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      padding-bottom: 0;

      /* padding: 1rem; */
      z-index: 31; /* above navbar (30) */
      background: $body-background-color;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    main.container > * {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .section {
      margin-top: 1rem;
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
      flex-grow: 1;
      height: 8rem;
    }
    .flex-large {
      height: 17.5rem;
    }

    .buttons-bar {
      position: sticky;
      bottom: 0;
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
