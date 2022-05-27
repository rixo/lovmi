<script>
  import { signin } from "$lib/user"

  export let close
  export let goToSignup
  export let goToLostPassword

  let username
  let password

  let error

  const submit = () => {
    signin(username, password)
      .then(({ success, message }) => {
        if (success) {
          error = null
          close()
        } else if (message) {
          error = message
        }
      })
      .catch((err) => {
        error = "Ça n'a pas marché o_O"
        console.error("Failed to sign in", err)
      })
  }
</script>

<form on:submit|preventDefault={submit}>
  <header class="modal-card-head">
    <p class="modal-card-title">Connexion</p>
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
        Connectez-vous pour donner votre avis et vous exprimer pleinement sur <span
          class="lovmi">Lovmi</span
        >&nbsp;! 🔥🔥🔥
      </p>
    </div>
    {#if error}
      <div class="content block">
        <p class="has-text-danger">{error}</p>
      </div>
    {/if}
    <div class="field">
      <label for="login" class="label">Identifiant</label>
      <div class="control">
        <input id="login" class="input" type="text" bind:value={username} />
      </div>
    </div>
    <div class="field">
      <label for="password" class="label">Mot de passe</label>
      <div class="control">
        <input
          id="password"
          class="input"
          type="password"
          bind:value={password}
        />
      </div>
    </div>
    <div class="content block is-size-7">
      <a href on:click|preventDefault={goToLostPassword}>
        Mot de passe oublié&nbsp;?
      </a>
    </div>
    <div class="content block">
      <p>
        Pas encore de compte&nbsp;?
        <a
          href
          on:click|preventDefault={goToSignup}
          class="has-text-primary has-text-weight-bold is-link"
          >Entrer dans le game</a
        > 🕶
      </p>
    </div>
  </section>

  <footer class="modal-card-foot">
    <button class="button is-success" disabled={!(username && password)}
      >Connexion</button
    >
    <button type="button" class="button" on:click|preventDefault={close}
      >Annuler</button
    >
  </footer>
</form>
