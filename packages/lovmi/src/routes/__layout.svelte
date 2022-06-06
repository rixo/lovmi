<script>
  import "../bulma.scss"
  import "$lib/global.css"

  import { getUserContext } from "$lib/user"
  import Navbar from "$lib/Navbar.svelte"
  import LoginModal from "$lib/LoginModal/index.svelte"

  const {
    user,
    loginModal,
    goToSignup,
    goToSignin,
    closeLoginModal,
    createUser,
  } = getUserContext()
</script>

<div class="wrapper">
  <Navbar {user} {loginModal} />

  <slot />

  <LoginModal
    {loginModal}
    {goToSignup}
    {goToSignin}
    close={closeLoginModal}
    {createUser}
  />
</div>

<footer class="footer">
  <div class="container content has-text-centered">
    <p>
      <strong>Lovmi</strong> by
      <a href="https://github.com/rixo" target="_blank">
        rixo
        <img
          class="image is-16x16"
          src="https://avatars.githubusercontent.com/u/1670419?v=4"
          alt="rixo clover"
        />
      </a> for 2itech.
    </p>
    <p class="is-size-7">
      Ce site est une satire. Ne lui confiez pas vos brouzoufs. Ni vos données
      personnelles.
    </p>
  </div>
</footer>

<style>
  :global(body) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .wrapper {
    flex: 1;
  }

  footer {
    margin-top: 1rem;
  }

  footer .image {
    display: inline;
    position: relative;
    top: 0.2em;
  }
</style>
