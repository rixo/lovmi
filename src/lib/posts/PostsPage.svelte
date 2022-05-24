<script>
  import Container from "$lib/ui/Container.svelte"
  import PostCard from "./PostCard.svelte"
  import Masonry from "svelte-bricks"

  export let posts
  export let loading = false
  export let error = ""

  export let user
</script>

<div class="container">
  <!-- <div class="level">
		<a href="/posts/latest" class="level-item">Les plus récents</a>
		<a href="/posts/trending" class="level-item">Trendy</a>
		<a href="/posts/hot" class="level-item">Les mieux notés</a>
		<a href="/posts/controversial" class="level-item">Contreversés</a>
	</div> -->
  <div class="section"><h1 class="title">Posts récents</h1></div>

  <div class="posts">
    {#if loading}
      Loading...
    {:else if error}
      <div class="error">
        <h2>Oops...</h2>
        <p>{error.message}</p>
      </div>
    {:else}
      <Masonry items={posts} let:item={post} animate={false}>
        <PostCard
          {post}
          {user}
          --margin=".5rem"
          --width="calc(50% - .5rem * 2)"
        />
      </Masonry>
    {/if}
  </div>
</div>

<style>
  .posts {
    display: content;
  }
</style>
