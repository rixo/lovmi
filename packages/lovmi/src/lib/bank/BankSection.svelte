<script>
  import { Fa, faBuildingColumns, faRightLeft } from "$lib/icons"
  import Brouzoufs from "$lib/Brouzoufs.svelte"

  import TransfertModal from "./TransfertModal.svelte"
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
              <Brouzoufs value="0.00" />
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
        <button type="button" class="button is-success">
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
            <th>Crédit</th>
            <th>Débit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01/01/2001</td>
            <td>Lovmi</td>
            <td class="has-text-right	is-family-monospace	">0.00</td>
            <td class="has-text-right	is-family-monospace	">0.00</td>
          </tr>
        </tbody>
        <tfoot>
          <th colspan="2" class="has-text-right">
            <strong>Solde</strong>
          </th>
          <th colspan="2" class="has-text-centered is-family-monospace	">
            <strong>0.00</strong>
          </th>
        </tfoot>
      </table>
    </div>
  </div>
</div>

<TransfertModal />
