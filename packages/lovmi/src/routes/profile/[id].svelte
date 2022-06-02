<script>
  import { page } from "$app/stores"

  import { getUserContext } from "$lib/user"
  import * as api from "$lib/api"
  import PostsList from "$lib/posts/PostsList.svelte"

  $: user = $page.params.id

  const userCtx = getUserContext()

  const { posts, loading, error } = api.posts

  $: items = $posts.filter((post) => post.author === user)
</script>

<section class="hero is-link">
  <div class="hero-body">
    <div class="container">
      <p class="title">
        {user}
      </p>
      <p class="subtitle">
        The <strong>greatest</strong> user since sliced bread.
      </p>
    </div>
  </div>
</section>

<div class="section">
  <div class="container">
    <h2 class="title">
      Les idées de <strong class="has-text-primary">{user}</strong>
    </h2>
  </div>
</div>

<div class="container">
  <PostsList
    user={userCtx.user}
    loading={$loading}
    error={$error}
    posts={items}
  />
</div>
