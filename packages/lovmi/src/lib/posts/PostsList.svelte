<script>
  import { scale } from "svelte/transition"

  import { Fa, faEye, faEyeSlash, faCirclePlus, faLightbulb } from "$lib/icons"
  import Masonry from "$lib/Masonry.svelte"

  import PostCard from "./PostCard.svelte"

  export let posts
  export let loading = false
  export let error = ""

  export let selector

  export let user

  const process = () => {
    let result = posts
    if (selector) {
      result = selector(posts)
    }
    return result
  }

  $: items = process(posts, selector)

  let refreshLayout
</script>

<div class="posts">
  {#if loading}
    Loading...
  {:else if error}
    <div class="error">
      <h2>Oops...</h2>
      <p>{error.message}</p>
    </div>
  {:else}
    <Masonry {items} bind:refreshLayout gridGap="1.5rem">
      {#each items as post (post.id)}
        <div>
          <PostCard {post} {user} />
        </div>
      {/each}
    </Masonry>
  {/if}
</div>
