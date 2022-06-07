<script>
  import AdminPostAction from "./AdminPostAction.svelte"

  let attackerName = "admin"
  let description = "vou zette tous moche"
</script>

<div class="form">
  <div class="field">
    <label for="attackerName" class="label">Identifiant de l'attaquant</label>
    <div class="control">
      <input
        id="attackerName"
        class="input"
        type="text"
        bind:value={attackerName}
      />
    </div>
    <p class="help">S'il n'existe pas, il sera créé.</p>
  </div>
  <div class="field">
    <div class="control">
      <a href="/admin/post/csrf/{attackerName}" class="button is-link">
        Créer un post CSRF
      </a>
    </div>
  </div>
</div>

<style>
  .form {
    max-width: 20rem;
  }
</style>
