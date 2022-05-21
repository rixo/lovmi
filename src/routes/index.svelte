<script>
  import { getUserContext } from "$lib/user"
  import * as api from "$lib/api"
  import PostsPage from "$lib/posts/PostsPage.svelte"

  const { posts, loading, error } = api.posts

  const { user } = getUserContext()
</script>

<PostsPage posts={$posts} {user} loading={$loading} error={$error} />
