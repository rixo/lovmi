<script>
  import Fa from "svelte-fa"
  import {
    faUser,
    faDoorOpen,
    faCirclePlus,
    faTrophy,
    faGavel,
  } from "$lib/icons"
  import { isAdmin } from "$lib/admin"
  import { leaderboardEnabled } from "$lib/api/settings"

  export let user

  $: userLoading = user.loading
  $: disconnect = () => {
    user.disconnect()
    menuActive = false
  }

  export let loginModal

  let menuActive = false

  const closeMenu = () => {
    menuActive = false
  }

  const closeAnd = (action) => () => {
    menuActive = false
    action()
  }

  const toggleMenu = () => {
    menuActive = !menuActive
  }
</script>

<nav class="navbar">
  <div class="container">
    <div class="navbar-brand">
      <a class="navbar-item is-size-4" href="/">
        <strong class="lovmi-brand">Lovmi</strong>
      </a>

      <div class="navbar-item">
        <a href="/post" class="button is-primary">
          <span class="icon"><Fa icon={faCirclePlus} /></span>
          <span><strong>Idée</strong></span>
        </a>
      </div>

      {#if $leaderboardEnabled}
        <div class="navbar-item">
          <a href="/leaderboard" class="button is-link is-inverted">
            <span class="icon"><Fa icon={faTrophy} /></span>
            <span>Classement</span>
          </a>
        </div>
      {/if}

      <a
        href
        role="button"
        class="navbar-burger"
        class:is-active={menuActive}
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        on:click={toggleMenu}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div class="navbar-menu" class:is-active={menuActive}>
      <!-- <div class="navbar-start">
        <a href="/posts/latest" class="navbar-item">Les plus récents</a>
        <a href="/posts/trending" class="navbar-item">Trendy</a>
        <a href="/posts/hot" class="navbar-item">Les mieux notés</a>
        <a href="/posts/controversial" class="navbar-item">Contreversés</a>
      </div> -->
      <div class="navbar-end">
        {#if $isAdmin}
          <a class="navbar-item" href="/admin" on:click={closeMenu}>
            <Fa icon={faGavel} class="icon" />
            <span>Admin</span>
          </a>
        {/if}

        {#if $userLoading}
          <span />
        {:else if $user}
          <div class="navbar-item has-dropdown is-hoverable">
            <div class="navbar-link">
              <Fa icon={faUser} class="icon" />
              <span>{$user.name}</span>
            </div>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/my-account" on:click={closeMenu}>
                <!-- <Fa icon={faDoorOpen} class="icon" /> -->
                <span>Mon compte</span>
              </a>
              <a class="navbar-item" href on:click|preventDefault={disconnect}>
                <!-- <span class="icon"><Fa icon={faDoorOpen}  /></span> -->
                <span>Déconnexion</span>
              </a>
            </div>
          </div>
        {:else}
          <div class="navbar-item">
            <div class="buttons">
              <a
                href
                class="button is-outlined"
                on:click|preventDefault={closeAnd(loginModal.goToSignup)}
              >
                Créer mon compte
              </a>
              <a
                href
                class="button is-success is-outlined"
                on:click|preventDefault={closeAnd(loginModal.goToSignin)}
              >
                <strong>Connexion</strong>
              </a>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- <div class="navbar-end">
  <div class="navbar-item">
    <div class="buttons">
      <a class="button is-primary">
        <strong>Connexion</strong>
      </a>
      <a class="button is-light">Créer mon compte</a>
    </div>
  </div>
</div> -->
  </div>
</nav>

<style>
  nav {
    position: sticky;
    top: 0;
  }

  @media screen and (max-width: 400px) {
    .navbar-brand .navbar-item:not(:first-child) {
      padding: 0.5rem 0.1rem;
    }
  }
  @media screen and (max-width: 1023px) {
    .navbar-menu {
      position: absolute;
      z-index: 1;
      width: 100%;
    }
  }

  .lovmi-brand {
    color: var(--lovmi-fg);
    /* background-color: var(--lovmi-bg); */
    /* padding: 0 1em; */
    opacity: 0.9;
    /* border-top: 1px solid; */
    /* border-bottom: 1px solid; */
  }
  .lovmi-brand:hover {
    opacity: 1;
  }
</style>
