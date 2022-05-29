<script>
  import Fa from "svelte-fa"
  import { faTrophy } from "$lib/icons"
  import TopUserTable from "$lib/leaderboard/TopUserTable.svelte"
  import * as api from "$lib/api"

  const { currentTopUsers, loading, error } = api.posts
</script>

<div class="section">
  <div class="container">
    <div class="title is-size-3">
      <div class="icon-text">
        <span class="icon has-text-warning-dark">
          <Fa class="icon" icon={faTrophy} />
        </span>
        <span>Classement</span>
      </div>
    </div>
    <div class="subtitle pt-3">
      <em>Qui</em> a les <strong>meilleures</strong> idées&nbsp;?
    </div>

    <hr />

    {#if !$loading && !$error}
      <div class="block">
        <div class="title is-size-4">Actuellement</div>
        <div class="subtitle is-size-5 pt-3">
          Rien n'est joué&nbsp;:
          <a href="/">votez</a>,
          <a href="/post">publiez</a>&nbsp;!
        </div>
        <TopUserTable topUsers={$currentTopUsers} />
      </div>
    {/if}
  </div>
</div>

<div class="section">
  <div class="container" />
</div>
