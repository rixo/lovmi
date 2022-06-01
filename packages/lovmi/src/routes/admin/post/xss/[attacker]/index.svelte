<script>
  import { page } from "$app/stores"

  import NewPostPage from "$lib/posts/NewPostPage.svelte"
  import { xssAttack } from "$lib/admin/actions"

  $: ({ attacker } = $page.params)

  const createPost = async (post) => {
    await xssAttack(attacker, post)()
  }
</script>

<NewPostPage {createPost} redirect="/admin" forceTitle="<script> ... </script>" >
  <svelte:fragment slot="title-section">
    <h1 class="title">Attaque XSS 👿</h1>
    <div class="subtitle">
      Le titre de ce post contiendra un <strong>script malveillant</strong>, qui votera automatiquement pour
      tous les posts de l'attaquant vus par les victimes.
    </div>
  </svelte:fragment>
</NewPostPage>
