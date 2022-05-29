<script>
  export let topUsers
</script>

<table class="table">
  <thead>
    <tr>
      <th><abbr title="Position">Pos</abbr></th>
      <th>Utilisateur</th>
      <th><abbr title="2 point par message posté">Posts</abbr></th>
      <th><abbr title="1 point par vote émis">Votes émis</abbr></th>
      <th colspan="2">
        <abbr title="+10 par vote positif reçu, -10 par vote négatif">
          Votes reçus
        </abbr>
      </th>
      <th>Score</th>
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
        <td><a href={line.href}>{line.userId}</a></td>
        <td class="has-text-centered">{line.posts}</td>
        <td class="has-text-centered">{line.votes}</td>
        <td class="has-text-centered">+{line.upvotes}</td>
        <td class="has-text-centered">-{line.downvotes}</td>
        <td class="has-text-centered">{line.total}</td>
      </tr>
    {/each}
  </tbody>
</table>
