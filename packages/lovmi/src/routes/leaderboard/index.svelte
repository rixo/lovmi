<script>
  import Fa from "svelte-fa"
  import { faTrophy, faPiggyBank } from "$lib/icons"
  import Brouzoufs from "$lib/Brouzoufs.svelte"
  import TopUserTable from "$lib/leaderboard/TopUserTable.svelte"
  import * as api from "$lib/api"

  const { currentTopUsers, currentPrizePool, pastTopUsers, loading, error } =
    api.posts
</script>

<div class="section">
  <div class="container">
    <h1 class="title is-size-1">
      <div class="icon-text">
        <span
          class="icon has-text-warning-dark"
          style="font-size: .8em; margin: -.05em .5em 0"
        >
          <Fa icon={faTrophy} />
        </span>
        <span>Classement</span>
      </div>
    </h1>
    <div class="subtitle is-size-4 pt-5">
      <em>Qui</em> a les <strong>meilleures</strong> idées&nbsp;?
    </div>
  </div>
</div>

{#if !$loading && !$error}
  <div class="container">
    <div class="columns">
      <div class="column">
        <TopUserTable topUsers={$currentTopUsers} />
      </div>
      <div class="column">
        <div class="card" style="max-width: 30rem; margin: auto;">
          <div class="card-content">
            <div class="title">
              <div class="icon-text">
                <span
                  class="icon"
                  style="font-size: .8em; margin: -.05em .5em 0; color: hsl(347, 90%, 76%)	"
                >
                  <Fa icon={faPiggyBank} />
                </span>
                <span>Cagnotte</span>
              </div>
            </div>

            <p class="is-size-1 has-text-centered has-text-weight-bold">
              <Brouzoufs value={$currentPrizePool} />
            </p>

            <p class="pt-3">
              <strong>Interagissez plus</strong> pour partager plus de
              <em>₿rouzoufs</em> publicitaires à la fin de la journée&nbsp;!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="container">
      <hr />
      <h2 class="title">Historique</h2>
      <p>Les jours n'ayant reçu aucune participation ne sont pas affichés.</p>
    </div>
  </div>

  <div class="container">
    {#each $pastTopUsers as previousResult (previousResult.period)}
      <div class="block">
        <h3 class="title is-size-4">{previousResult.title}</h3>
        <TopUserTable topUsers={previousResult.results} />
      </div>
    {/each}
  </div>
{/if}

<div class="section">
  <div class="container" />
</div>
