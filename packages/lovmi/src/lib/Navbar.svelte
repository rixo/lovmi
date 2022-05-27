<script>
  import Fa from "svelte-fa"
  import { faUser, faDoorOpen, faCirclePlus } from "$lib/icons"

  export let user

  $: userLoading = user.loading
  $: disconnect = () => {
    user.disconnect()
    menuActive = false
  }

  export let loginModal

  let menuActive = false

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
        {#if $userLoading}
          <span />
        {:else if $user}
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link" href="/my-account">
              <Fa icon={faUser} class="icon" />
              <span>{$user.name}</span>
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/account">
                <!-- <Fa icon={faDoorOpen} class="icon" /> -->
                <span>Mon compte</span>
              </a>
              <a class="navbar-item" href on:click|preventDefault={disconnect}>
                <!-- <Fa icon={faDoorOpen} class="icon" /> -->
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
