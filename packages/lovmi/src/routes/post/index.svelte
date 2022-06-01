<script>
  import NewPostPage from "$lib/posts/NewPostPage.svelte"
  import { requireUserOrRedirect } from "$lib/user"

  $: user = $requireUserOrRedirect("/")
</script>

<NewPostPage {user} />
