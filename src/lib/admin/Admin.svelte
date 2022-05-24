<script>
  import { logout } from "$lib/admin"
</script>

<div class="section">
  <div class="container">
    <div class="title is-size-2">Admin</div>
    <div class="subtitle">
      <button class="button is-warning" on:click={logout}>Déconnecter</button>
    </div>
  </div>
</div>

<div class="section">
  <div class="container">
    <div class="title is-size-3">Attaque XSS</div>
    <div class="subtitle">
      Tout remettre à zéro pour commencer une nouvelle session.
    </div>
    <button class="button is-primary">Post XSS</button>
  </div>
</div>

<div class="section">
  <div class="container">
    <div class="title is-size-3">Nouvelle partie</div>
    <div class="subtitle">
      Tout remettre à zéro pour commencer une nouvelle session.
    </div>
    <button class="button is-danger">Remettre à zéro</button>
  </div>
</div>
