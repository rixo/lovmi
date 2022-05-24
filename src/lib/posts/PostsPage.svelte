<script>
  import { scale } from "svelte/transition"
  import Masonry from "svelte-bricks"

  import { Fa, faEye, faEyeSlash } from "$lib/icons"
  import Container from "$lib/ui/Container.svelte"
  import PostCard from "./PostCard.svelte"

  export let posts
  export let loading = false
  export let error = ""

  export let user

  let showAlreadyVoted = false

  const filterPosts = () => {
    let result = posts
    if (!showAlreadyVoted) {
      result = result.filter((post) => !post.votes[$user.id])
    }
    return result
  }

  $: items = filterPosts(posts, showAlreadyVoted)
</script>

<div class="container">
  <!-- <div class="level">
		<a href="/posts/latest" class="level-item">Les plus récents</a>
		<a href="/posts/trending" class="level-item">Trendy</a>
		<a href="/posts/hot" class="level-item">Les mieux notés</a>
		<a href="/posts/controversial" class="level-item">Contreversés</a>
	</div> -->
  <div class="section"><h1 class="title">Idées nouvelles</h1></div>

  <div class="level">
    <div class="level-left">
      <div class="level-item">
        <button
          class="button is-info"
          class:is-light={!showAlreadyVoted}
          on:click={(e) => {
            showAlreadyVoted = !showAlreadyVoted
            e.target.blur()
          }}
        >
          <span class="icon"
            ><Fa icon={showAlreadyVoted ? faEye : faEyeSlash} /></span
          >
          <span>Déjà votées</span>
        </button>
      </div>
    </div>
  </div>

  <div class="posts">
    {#if loading}
      Loading...
    {:else if error}
      <div class="error">
        <h2>Oops...</h2>
        <p>{error.message}</p>
      </div>
    {:else}
      <Masonry {items} let:item={post} animate={true}>
        <PostCard
          {post}
          {user}
          --margin=".5rem"
          --width="calc(50% - .5rem * 2)"
        />
      </Masonry>
      <!-- {#each items as post (post.id)}
        <div class="item" transition:scale>
          <PostCard
            {post}
            {user}
            --margin=".5rem"
            --width="calc(50% - .5rem * 2)"
          />
        </div>
      {/each} -->
    {/if}
  </div>
</div>

<style>
  .posts {
    display: content;
  }
  /* .posts {
    display: flex;
    flex-wrap: wrap;
    margin: -0.5rem;
  }
  .posts .item {
    min-width: 20rem;
    margin: 0.5rem;
  } */
</style>
