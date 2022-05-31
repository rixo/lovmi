<script>
  import Fa from "svelte-fa"
  import { faExclamationTriangle } from "$lib/icons"

  export let createUser

  export let close

  let login = ""
  let password = ""

  let errors = {}

  $: hasErrors = Object.keys(errors).length > 0

  $: canSubmit = login && password

  const validate = () => {
    if (!login) {
      errors.login =
        "On ne vous en demande pas beaucoup, faites un effort de votre côté !"
    }
    if (/@/.test(login)) {
      errors.login = "Caractère interdit : @"
    }
    if (!password) {
      errors.password =
        "Essayez de trouver un mot de passe un tout petit peu plus sûr (sérieusement...)"
    }
    return Object.keys(errors).length === 0
  }

  const submit = () => {
    if (!validate()) return
    createUser({ login, password })
      .then(close)
      .catch((err) => {
        console.error("Failed to create user", err)
      })
  }
</script>

<form on:submit|preventDefault={submit}>
  <header class="modal-card-head">
    <p class="modal-card-title">Créer un compte</p>
    <button
      type="button"
      class="delete"
      aria-label="close"
      on:click|preventDefault={close}
    />
  </header>

  <section class="modal-card-body">
    <div class="content block">
      <p>
        Créer un compte pour devenir acteur de la grande aventure <span
          class="lovmi">Lovmi</span
        >&nbsp;! <span class="sparkles">✨</span>
      </p>
    </div>
    <div class="field">
      <label for="login" class="label">Identifiant</label>
      <div class="control has-icons-right">
        <input
          id="login"
          placeholder="Identifiant"
          class="input"
          class:is-danger={errors.login}
          type="text"
          bind:value={login}
        />
        {#if errors.login}
          <span class="icon is-small is-right">
            <Fa icon={faExclamationTriangle} />
          </span>
        {/if}
      </div>
      {#if errors.login}
        <p class="help is-danger">{errors.login}</p>
      {/if}
    </div>
    <div class="field">
      <label for="password" class="label">Mot de passe</label>
      <div class="control">
        <input
          id="password"
          placeholder="Mot de passe"
          class="input"
          class:is-danger={errors.password}
          type="password"
          bind:value={password}
        />
      </div>
      {#if errors.password}
        <p class="help is-danger">{errors.password}</p>
      {/if}
    </div>
  </section>

  <footer class="modal-card-foot">
    <button type="submit" class="button is-success" disabled={!canSubmit}
      >Créer mon compte</button
    >
    <button type="button" class="button" on:click|preventDefault={close}
      >Annuler</button
    >
  </footer>
</form>

<style>
  .field > .label {
    display: none;
  }
</style>
