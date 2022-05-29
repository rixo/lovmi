<script>
  import { logout } from "$lib/admin"
  import { startNewEra } from "$lib/admin/actions"

  import ErrorMessage from "./ErrorMessage.svelte"

  const startNewEraState = startNewEra.state
</script>

<div class="section">
  <div class="container">
    <div class="is-flex">
      <div class="title is-size-1 is-flex-grow-1">Admin</div>
      <button class="button is-warning" on:click={logout}>Déconnecter</button>
    </div>
    <div class="subtitle">
      Le panneau d'administration vous permet de <strong>contrôler</strong> le déroulement
      d'une partie.
    </div>
  </div>
</div>

<div class="section">
  <div class="container">
    <div class="title is-size-2">Jeu</div>
    <div class="subtitle">
      Les différentes actions qui vont faire <strong>
        évoluer la session de jeu
      </strong>.
    </div>

    <div class="block">
      <div class="title is-size-4">Nouvelle "journée"</div>
      <div class="subtitle is-size-5">
        Simuler le passage du temps, pour que les joueurs touchent leurs
        récompenses. Les meilleurs posts de la "journée" seront récompensés.
      </div>
      <button class="button is-success">Démarrer une nouvelle journée</button>
    </div>
  </div>
</div>

<div class="section">
  <div class="container">
    <div class="title is-size-2">Attaques</div>
    <div class="subtitle">
      Déclencher les attaques pour <strong>illustrer le propos</strong>.
    </div>

    <div class="block">
      <div class="title is-size-4">Attaque XSS</div>
      <div class="subtitle is-size-5">
        <strong>Cross-Site Scripting</strong>&nbsp;: en utilisant un défaut de
        sécurisation dans l'application, nous allons injecter un script
        malicieux sur la page vue par l'utilisateur, pour exécuter des actions à
        sa place.
      </div>
      <button class="button is-primary">Post XSS</button>
    </div>

    <div class="block">
      <div class="title is-size-4">Attaque CSRF</div>
      <div class="subtitle is-size-5">
        <strong>Cross-Site Request Forgery</strong>&nbsp;: à l'aide d'un peu
        d'ingénierie sociale (un lien aguichant), nous allons exécuter une
        action à la place de l'utilisateur en utilisant les droits de sa session
        actuelle.
      </div>
      <button class="button is-primary">Post CSRF</button>
    </div>
  </div>
</div>

<div class="section">
  <div class="container">
    <div class="title is-size-3">Nouvelle partie</div>
    <div class="subtitle">
      Tout remettre à zéro pour commencer une nouvelle session.
    </div>
    <ErrorMessage error={$startNewEraState.error} />
    <button
      class="button is-danger"
      class:is-loading={$startNewEraState.loading}
      on:click={startNewEra}
    >
      Remettre à zéro
    </button>
  </div>
</div>
