<script>
  import { slide } from "svelte/transition"

  import { Fa, faRightLeft, faAt } from "$lib/icons"

  let transfertType = "user"

  let accepted = false
</script>

<div class="modal is-active">
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        <span class="icon-text">
          <span class="icon">
            <Fa icon={faRightLeft} />
          </span>
          <span>Transfert</span>
        </span>
      </p>
      <!-- <button class="delete" aria-label="close" /> -->
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label">Bénéficiaire</label>

        <div class="control my-3">
          <label class="radio">
            <input
              type="radio"
              name="answer"
              bind:group={transfertType}
              value="user"
            />
            Un autre utilisateur Lovmi
          </label>
          <label class="radio">
            <input
              type="radio"
              name="answer"
              bind:group={transfertType}
              value="myself"
            />
            Mon compte personnel
          </label>
        </div>

        {#if transfertType === "user"}
          <div
            class="control has-icons-left"
            transition:slide|local={{ duration: 200 }}
          >
            <input
              type="text"
              class="input"
              placeholder="identifiant du bénéficiaire"
            />
            <div class="icon is-left">
              <Fa icon={faAt} />
            </div>
          </div>
        {/if}
      </div>

      <div class="field">
        <label class="label">Montant</label>
        <div class="control">
          <input type="number" class="input" min="0" placeholder="0,00" />
        </div>
      </div>

      <label class="checkbox">
        <input type="checkbox" bind:checked={accepted} />
        J'ai lu et accepte les règles de la finance internationale et autre contrariétés
        de la vie
      </label>
    </section>

    <footer class="modal-card-foot">
      <button type="button" class="button is-success"
        >Confirmer le transfert</button
      >
      <button type="button" class="button">Annuler</button>
    </footer>
  </div>
</div>
