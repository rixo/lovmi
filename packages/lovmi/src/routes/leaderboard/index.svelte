<script>
  import Fa from "svelte-fa"

  import { browser } from "$app/env"
  import { goto } from "$app/navigation"

  import { faTrophy, faPiggyBank } from "$lib/icons"
  import Brouzoufs from "$lib/Brouzoufs.svelte"
  import TopUserTable from "$lib/leaderboard/TopUserTable.svelte"
  import * as api from "$lib/api"
  import { leaderboardEnabled } from "$lib/api/settings"

  const { currentTopUsers, currentPrizePool, pastTopUsers, loading, error } =
    api.posts

  $: if (!$loading && !$leaderboardEnabled) goto("/")
</script>

<div class="section">
  <div class="container">
    <h1 class="title is-size-1">
      <div class="icon-text">
        <span>Classement</span>
        <span class="icon trophy">
          <Fa icon={faTrophy} />
        </span>
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
        <div class="card prize-pool">
          <div class="card-content">
            <div class="title">
              <div class="icon-text">
                <span>Cagnotte</span>
                <span class="icon piggy-bank">
                  <Fa icon={faPiggyBank} />
                </span>
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
      <!-- <p>Les jours n'ayant reçu aucune participation ne sont pas affichés.</p> -->
    </div>
  </div>

  <div class="container">
    {#each $pastTopUsers as previousResult (previousResult.period)}
      <div class="block">
        <h3 class="title is-size-4">{previousResult.title}</h3>
        <TopUserTable topUsers={previousResult.results} showGain />
      </div>
    {/each}
  </div>
{/if}

<div class="section">
  <div class="container" />
</div>

<style>
  .card.prize-pool {
    max-width: 30rem;
    margin: auto;
  }

  .icon.trophy {
    font-size: 0.8em;
    margin: -0.05em 0.75em 0;
    color: hsl(51, 80%, 50%);
  }
  .icon.piggy-bank {
    font-size: 0.8em;
    margin: -0.05em 0.5em 0;
    color: hsl(347, 90%, 76%);
  }
</style>
