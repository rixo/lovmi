<script>
  import { Fa, faBuildingColumns, faRightLeft } from "$lib/icons"
  import Brouzoufs from "$lib/Brouzoufs.svelte"
  import { user } from "$lib/api/user"

  import TransfertModal from "./TransfertModal.svelte"

  export let account

  let modalActive

  const showTransfertModal = () => {
    modalActive = true
  }

  const handleCloseModal = () => {
    modalActive = false
  }

  const formatPeriod = (period) => {
    if (period == null) return ""
    return "Jour " + (parseInt(period) + 1)
  }
</script>

<div class="section">
  <div class="container">
    <h2 class="title is-size-3 ">
      <div class="icon-text">
        <span class="icon"><Fa icon={faBuildingColumns} /></span>
        <span class="ml-2 mb-2">Banque</span>
      </div>
    </h2>
    <div class="subtitle">Money, money, <strong>money!</strong> 💸</div>

    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content has-text-centered">
            <!-- <div class="title is-size-4 has-text-centered">Solde</div> -->
            <p class="is-size-3 has-text-primary has-text-weight-bold">
              <Brouzoufs value={account.balance} />
            </p>
            <p>Votre solde</p>
          </div>
        </div>
      </div>
      <div class="column" />
    </div>

    <div class="block">
      <h3 class="is-size-4 mb-2">Opérations</h3>

      <div class="block">
        <button
          type="button"
          class="button is-success"
          on:click={showTransfertModal}
        >
          <span class="icon">
            <Fa icon={faRightLeft} />
          </span>
          <span>Effectuer un transfert</span>
        </button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Origine</th>
            <th>Bénéficiaire</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {#each account.operations as op}
            <tr>
              <td>{formatPeriod(op.period)}</td>
              <td class:is-me={op.from === $user.id}>{op.from}</td>
              <td class:is-me={op.to === $user.id}>{op.to}</td>
              <td
                class="has-text-right	is-family-monospace"
                class:has-text-success={op.amount > 0}
                class:has-text-danger={op.amount < 0}
              >
                <Brouzoufs raw value={op.amount} />
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="4" class="has-text-centered has-text-grey">
                Aucun mouvements
              </td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <th colspan="2" class="has-text-right">
            <strong>Solde</strong>
          </th>
          <th colspan="2" class="has-text-centered is-family-monospace	">
            <strong><Brouzoufs raw value={account.balance} /></strong>
          </th>
        </tfoot>
      </table>
    </div>
  </div>
</div>

{#if modalActive}
  <TransfertModal balance={account.balance} onClose={handleCloseModal} />
{/if}

<style>
  td.is-me {
    font-weight: bold;
    color: #8a4d76;
  }
</style>
