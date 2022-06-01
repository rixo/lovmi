<script>
  import { xssAttack } from "$lib/admin/actions"
  import AdminPostAction from "./AdminPostAction.svelte"

  let attackerName = "atakor"
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
    <label for="message" class="label">Message</label>
    <div class="control">
      <textarea id="message" class="textarea" bind:value={description} />
    </div>
  </div>
  <div class="field is-grouped">
    <div class="control">
      <AdminPostAction action={xssAttack(attackerName)} class="button is-link">
        Créer le post XSS
      </AdminPostAction>
    </div>
  </div>
</div>

<style>
  .form {
    max-width: 20rem;
  }
</style>
