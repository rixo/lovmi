<script>
  export let close
</script>

<div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">Mot de passe oublié</p>
    <!-- <button class="delete" aria-label="close" /> -->
  </header>

  <section class="modal-card-body">
    <div class="block has-text-centered">
      <p class="is-size-1">💩</p>
      <p class="is-size-3">Ben zut.</p>
    </div>
    <p class="block has-text-centered">
      <a
        href="https://www.lamutuellegenerale.fr/le-mag-sante/senior/pourquoi-et-comment-exercer-sa-memoire-au-quotidien.html"
        target="_blank"
      >
        Trouver une solution
      </a>
    </p>
  </section>

  <footer class="modal-card-foot">
    <button class="button is-warning" on:click={close}
      >J'ai honte du coup</button
    >
  </footer>
</div>

<style>
  .modal-card-foot {
    justify-content: center;
  }
</style>
