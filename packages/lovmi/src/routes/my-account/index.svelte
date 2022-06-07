<script>
  // import { onMount } from "svelte"
  // import { goto } from "$app/navigation"

  import { requireUserOrRedirect } from "$lib/user"
  // import ProfileSettingsSection from "$lib/user/account/ProfileSettingsSection.svelte"
  import BankSection from "$lib/bank/BankSection.svelte"
  import { myBankAccount } from "$lib/api/bank"

  $: me = $requireUserOrRedirect("/")
</script>

{#if me}
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Mon compte</h1>
        <p class="subtitle">
          Manage <strong>yourself</strong>
        </p>
      </div>
    </div>
  </section>

  <!-- <ProfileSettingsSection /> -->

  <BankSection account={$myBankAccount} />
{/if}
