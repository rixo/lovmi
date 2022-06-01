<script>
  import { page } from "$app/stores"

  import NewPostPage from "$lib/posts/NewPostPage.svelte"
  import { xssAttack } from "$lib/admin/actions"

  $: ({ attacker } = $page.params)

  const createPost = async (post) => {
    await xssAttack(attacker, post)()
  }
</script>

<NewPostPage {createPost} redirect="/admin" forceTitle="<script> ... </script>" />
