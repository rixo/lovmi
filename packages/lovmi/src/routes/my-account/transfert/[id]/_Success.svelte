<script>
  import Brouzoufs from "$lib/Brouzoufs.svelte"

  export let recipient
  export let amount
</script>

<div class="section">
  <div class="container">
    <h1 class="title">Transfert réussi 🎉</h1>
    <h2 class="subtitle">
      La Lovmi Brouzoufs Bank vous remercie pour
      <strong>votre confiance</strong>.
    </h2>
    <div class="box">
      <h3 class="title is-size-4">Détails du transfert</h3>
      <p class="is-size-5">
        <strong>Bénéficiaire&nbsp;:</strong>
        {recipient}
      </p>
      <p class="is-size-5">
        <strong>Montant&nbsp;:</strong>
        <Brouzoufs value={amount} />
      </p>
    </div>

    <p class="block">
      <a href="/my-account">Retour à mon compte</a>
    </p>
  </div>
</div>
