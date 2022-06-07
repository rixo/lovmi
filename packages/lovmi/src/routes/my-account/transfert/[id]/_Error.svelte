<script>
  export let message = ""
  export let hackAlert = false
</script>

<div class="section">
  <div class="container">
    <h1 class="title">Erreur</h1>
    <h2 class="subtitle">Votre transfert a <strong>échoué</strong></h2>
    <div class="box" class:has-text-centered={hackAlert}>
      {#if hackAlert}
        <div class="block">
          <img src="/gyro1.gif" alt="do panic!" />
        </div>
        <p>{message}</p>
      {:else}
        <div>{message}</div>
      {/if}
    </div>
  </div>
</div>
