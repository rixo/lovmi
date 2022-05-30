<script>
  import Brouzoufs from "$lib/Brouzoufs.svelte"

  export let topUsers

  export let showGain = true
</script>

<table class="table">
  <thead>
    <tr>
      <th><abbr title="Position">Pos</abbr></th>
      <th>Utilisateur</th>
      <th class="is-hidden-mobile has-text-centered"
        ><abbr title="2 point par message posté">Posts</abbr></th
      >
      <th class="is-hidden-mobile has-text-centered">
        <abbr title="1 point par vote émis">Votes émis</abbr>
      </th>
      <th colspan="2" class="is-hidden-mobile has-text-centered">
        <abbr title="+10 par vote positif reçu, -10 par vote négatif">
          Votes reçus
        </abbr>
      </th>
      <th class="has-text-centered">Score</th>
      {#if showGain}
        <th class="has-text-centered">Gain 🤑</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    <!-- <tr>
      <th class="has-text-centered">1</th>
      <td
        ><a
          href="https://en.wikipedia.org/wiki/Leicester_City_F.C."
          title="Leicester City F.C.">Leicester City</a
        > <strong>(C)</strong>
      </td>
      <td class="has-text-centered">38</td>
      <td class="has-text-centered">23</td>
      <td class="has-text-centered">12</td>
    </tr> -->
    {#each topUsers as line (line.userId)}
      <tr>
        <th class="has-text-centered">{line.pos}</th>
        <td><a href={line.href}>@{line.userId}</a></td>
        <td class="has-text-centered is-hidden-mobile">{line.posts}</td>
        <td class="has-text-centered is-hidden-mobile">{line.votes}</td>
        <td class="has-text-centered is-hidden-mobile">+{line.upvotes}</td>
        <td class="has-text-centered is-hidden-mobile">-{line.downvotes}</td>
        <td class="has-text-centered">{line.total}</td>
        {#if showGain}
          <td class="has-text-centered">
            {#if line.prize}
              <Brouzoufs value={line.prize} />
            {:else}
              <span class="has-text-grey-light">&ndash;</span>
            {/if}
          </td>
        {/if}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  @media screen and (max-width: 768px) {
    table {
      min-width: 100%;
    }
  }
</style>
