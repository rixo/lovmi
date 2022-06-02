<script context="module">
  export const LOST_PASSWORD = "lost_password"
  export const SIGN_IN = "sign_in"
  export const SIGN_UP = "sign_up"
</script>

<script>
  import Signin from "$lib/LoginModal/Signin.svelte"
  import Signup from "$lib/LoginModal/Signup.svelte"
  import LostPassword from "$lib/LoginModal/LostPassword.svelte"

  export let loginModal

  export let createUser

  $: screen = $loginModal || SIGN_IN

  // export let goToSignin
  $: close = loginModal.close
  $: goToSignup = loginModal.goToSignup

  const goToLostPassword = () => {
    screen = LOST_PASSWORD
  }
</script>

<div class="modal" class:is-active={$loginModal}>
  <div class="modal-background" on:click={close} />
  {#if screen === SIGN_IN}
    <Signin {close} {goToSignup} {goToLostPassword} />
  {:else if screen === SIGN_UP}
    <Signup {close} {createUser} />
  {:else if screen === LOST_PASSWORD}
    <LostPassword {close} />
  {/if}
</div>
