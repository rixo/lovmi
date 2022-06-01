<script>
  import { logout } from "$lib/admin"
  import {
    startNewEra,
    startNewPeriod,
    toggleLeaderboard,
    changeSettings,
  } from "$lib/admin/actions"
  import { leaderboardEnabled, xssAttackFixed } from "$lib/api/settings"

  import AdminPostAction from "./AdminPostAction.svelte"
  import XSSAttackAdminAction from "./XSSAttackAdminAction.svelte"

  const startNewEraState = startNewEra.state
</script>

<div class="section">
  <div class="container">
    <div class="is-flex">
      <div class="title is-size-1 is-flex-grow-1">Admin</div>
      <button class="button is-danger" on:click={logout}>Déconnecter</button>
    </div>
    <div class="subtitle is-size-4">
      Le panneau d'administration vous permet de <strong>contrôler</strong> le déroulement
      d'une partie.
    </div>
  </div>
</div>

<div class="section section-game">
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
      <AdminPostAction action={startNewPeriod} class="is-warning">
        Démarrer une nouvelle journée
      </AdminPostAction>
    </div>

    <div class="block">
      <div class="title is-size-4">
        Page classement
        {#if $leaderboardEnabled}
          <span class="tag is-success">Activée</span>
        {:else}
          <span class="tag is-danger is-light">Désactivée</span>
        {/if}
      </div>
      <div class="subtitle is-size-5">
        Afficher ou cacher la page Classement, pour introduire la notion de
        <strong>monétisation</strong> des réseaux.
      </div>
      <AdminPostAction action={toggleLeaderboard} class="is-primary">
        {$leaderboardEnabled
          ? "Désactiver la page classement"
          : "Activer la page classement"}
      </AdminPostAction>
    </div>
  </div>
</div>

<div class="section">
  <div class="container">
    <div class="title is-size-2">Attaques</div>
    <div class="subtitle">
      Déclencher les attaques pour <strong>illustrer le propos</strong>.
    </div>

    <div class="block my-6">
      <div class="title is-size-4">
        Attaque XSS
        {#if $xssAttackFixed}
          <span class="tag is-success is-light">Sécurisée</span>
        {:else}
          <span class="tag is-danger is-light">Vulnérable</span>
        {/if}
      </div>
      <p class="subtitle is-size-6">
        <strong>Cross-Site Scripting</strong>&nbsp;: en utilisant un défaut de
        sécurisation dans l'application, nous allons injecter un script
        malicieux sur la page vue par l'utilisateur, pour exécuter des actions à
        sa place.
      </p>

      <div class="columns">
        <div class="column">
          <XSSAttackAdminAction />
        </div>
        <div class="column">
          <div class="field">
            <span class="label">&nbsp;</span>
            <div class="control">
              <AdminPostAction
                action={changeSettings({ xss_attack_fixed: !$xssAttackFixed })}
                class="is-outlined {$xssAttackFixed
                  ? 'is-danger'
                  : 'is-success'}"
              >
                {#if $xssAttackFixed}
                  Activer la vulnérabilité
                {:else}
                  Sécuriser le site
                {/if}
              </AdminPostAction>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="block">
      <div class="title is-size-4">Attaque CSRF</div>
      <div class="subtitle is-size-6">
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
    <AdminPostAction action={startNewEra} class="is-danger">
      Remettre à zéro
    </AdminPostAction>
  </div>
</div>

<style>
  .section-game .block {
    margin-top: 3rem;
  }
</style>
