<script>
  import Fa from "svelte-fa"
  import { faHeartCrack, faHeart } from "$lib/icons"

  import { getUser } from "$lib/user"

  export let post

  export let user

  const vote = (value) => {
    $getUser()
      .then((user) => {
        if (!user) return
        if (value > 0) post.upvote(user.id)
        else post.downvote(user.id)
      })
      .catch((err) => {
        console.error("Failed to get user", err)
      })
  }

  const upvote = () => vote(1)
  const downvote = () => vote(-1)

  $: upvoted = post.isUpvotedBy($user?.id)
  $: downvoted = post.isDownvotedBy($user?.id)
</script>

<div class="card">
  {#if post.image}
    <div class="card-image p-5">
      <figure class="image is-4by3">
        <img src={post.image} alt="Post" />
      </figure>
    </div>
  {/if}
  <div class="card-content">
    {#if post.title}
      <h2 class="title is-size-4">{post.title}</h2>
    {/if}
    <h3 class="subtitle is-size-6">
      <a href="/profile/{post.author}">@{post.author}</a>
    </h3>
    {#if post.description_html}
      <div class="content">
        <div class="desc">{@html post.description_html}</div>
      </div>
    {/if}
  </div>
  <div class="card-footer">
    <a
      href
      class="card-footer-item positive"
      class:active={upvoted}
      on:click|preventDefault={upvote}
    >
      <Fa icon={faHeart} class="icon" />
    </a>
    <div class="card-footer-item">{post.score}</div>
    <a
      href
      class="card-footer-item negative"
      class:active={downvoted}
      on:click|preventDefault={downvote}
    >
      <Fa icon={faHeartCrack} class="icon" />
    </a>
  </div>
</div>

<style>
  a.card-footer-item:not(:hover) {
    color: hsl(0, 0%, 71%);
  }
  a.card-footer-item.positive.active:not(:hover) {
    color: hsl(300, 100%, 61%);
  }
  a.card-footer-item.negative.active:not(:hover) {
    color: hsl(204, 86%, 53%);
  }
</style>
