<script>
  import { slide } from "svelte/transition"

  import { Fa, faRightLeft, faAt, faBitcoinSign } from "$lib/icons"
  import { user } from "$lib/api/user"
  import { csrfAttackFixed } from "$lib/api/settings"

  export let balance

  export let onClose

  let active = true

  let transfertType = "user"

  let values = {
    accepted: false,
    recipient: null,
    allBalance: false,
    amount: null,
  }

  $: canSubmit =
    values.accepted && values.recipient && (values.amount || values.allBalance)
</script>

<form
  class="modal"
  class:is-active={active}
  action="/my-account/transfert"
  method={$csrfAttackFixed ? "post" : "get"}
>
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
      <input name="auth" type="hidden" value={$user.auth} />

      <div class="field">
        <div class="label">Bénéficiaire</div>

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
          <label class="radio ml-0">
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
            out:slide|local={{ duration: 400 }}
            in:slide|local={{ delay: 400, duration: 400 }}
          >
            <input
              type="text"
              class="input"
              placeholder="identifiant du bénéficiaire"
              bind:value={values.recipient}
              name="recipient"
              autocomplete="off"
            />
            <div class="icon is-left">
              <Fa icon={faAt} />
            </div>
          </div>
        {/if}

        {#if transfertType === "myself"}
          <div
            class="control has-icons-left mb-5"
            out:slide|local={{ duration: 400 }}
            in:slide|local={{ delay: 400, duration: 400 }}
          >
            <p class="is-size-4">Bientôt disponible&nbsp;!</p>
            <p class="">
              Cette fonctionalité arrive prochainement tout bientôt, en temps
              utile.
            </p>
            <p class="is-size-7">Pour l'instant on s'occupe de votre argent.</p>
          </div>
        {/if}
      </div>

      <div class="field">
        <label class="label" for="amount">Montant</label>

        <label class="checkbox mb-3">
          <input type="checkbox" bind:checked={values.allBalance} name="all" />
          Tout mon solde
        </label>

        <div class="control has-icons-left">
          <input
            id="amount"
            name="amount"
            type="number"
            class="input"
            min="0"
            step="0.01"
            placeholder="0,00"
            disabled={values.allBalance}
            value={values.allBalance ? balance : values.amount}
            on:input={(e) => {
              values.amount = e.target.value
            }}
          />
          <div class="icon is-left">
            <Fa icon={faBitcoinSign} />
          </div>
        </div>
      </div>

      <label class="checkbox my-5">
        <input type="checkbox" bind:checked={values.accepted} />
        J'ai lu et j'accepte les règles de la finance internationale et autres petites
        contrariétés de la vie de tous les jours
      </label>
    </section>

    <footer class="modal-card-foot">
      <button type="submit" class="button is-success" disabled={!canSubmit}>
        Confirmer le transfert
      </button>
      <button type="button" class="button" on:click|preventDefault={onClose}>
        Annuler
      </button>
    </footer>
  </div>
</form>
