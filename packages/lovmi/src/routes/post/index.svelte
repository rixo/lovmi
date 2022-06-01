<script>
  import NewPostPage from "$lib/posts/NewPostPage.svelte"
  import { requireUserOrRedirect } from "$lib/user"
  import { posts } from "$lib/api"

  $: user = $requireUserOrRedirect("/")

  const createPost = async (data) => await posts.create(user, data)
</script>

<NewPostPage {createPost} />
