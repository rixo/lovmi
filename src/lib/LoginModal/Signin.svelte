<script>
  export let close
  export let goToSignup
  export let goToLostPassword
</script>

<header class="modal-card-head">
  <p class="modal-card-title">Connexion</p>
  <button class="delete" aria-label="close" on:click|preventDefault={close} />
</header>

<section class="modal-card-body">
  <div class="content block">
    <p>
      Connectez-vous pour donner votre avis et vous exprimer pleinement sur <span
        class="lovmi">Lovmi</span
      >&nbsp;! 🔥🔥🔥
    </p>
  </div>
  <div class="field">
    <label for="login" class="label">Identifiant</label>
    <div class="control">
      <input id="login" class="input" type="text" />
    </div>
  </div>
  <div class="field">
    <label for="password" class="label">Mot de passe</label>
    <div class="control">
      <input id="password" class="input" type="password" />
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
      <a href on:click|preventDefault={goToSignup} class="has-text-primary"
        >Entrer dans le game</a
      > 🕶
    </p>
  </div>
</section>

<footer class="modal-card-foot">
  <button class="button is-success">Connexion</button>
  <button class="button" on:click|preventDefault={close}>Annuler</button>
</footer>
