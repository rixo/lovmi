<script>
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"

  import NewPostPage from "$lib/posts/NewPostPage.svelte"
  import { csrfAttack } from "$lib/admin/actions"
  import { loading, auth } from "$lib/admin"

  $: if (!$loading && !$auth) goto("/")

  $: ({ attacker } = $page.params)

  const createPost = async (post) => {
    await csrfAttack(attacker, post)()
  }

  const initialTitle = "🤑🤑🤑 Doublez vos Brouzoufs 🤑🤑🤑"

  const initialMessage = `
    <h2>Occasion unique !!!</h2>

    Pour fêter ses 2 jours, Lovmi lance l'opération
    [attack-link]double brouz'[/attack-link].

    Découvrez vite votre surprise!!
  `
    .trim()
    .replace(/ +/g, " ")
</script>

{#if $auth}
  <NewPostPage {createPost} redirect="/admin" {initialMessage} {initialTitle}>
    <svelte:fragment slot="title-section">
      <h1 class="title">Attaque CSRF 🏄‍♂️</h1>
      <div class="subtitle">
        Le placeholder <code>[attack-link]</code> sera remplacé par un lien vers
        une page vidant le compte de la victime.
      </div>
    </svelte:fragment>
  </NewPostPage>
{/if}
