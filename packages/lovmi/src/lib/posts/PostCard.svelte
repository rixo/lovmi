<script>
  import Fa from "svelte-fa"
  import { faHeartCrack, faHeart, faThumbsDown } from "$lib/icons"

  import { getUser } from "$lib/user"

  export let post

  export let user

  const vote = (value) => {
    $getUser()
      .then((user) => {
        if (!user) return
        post.vote(user.id, value)
      })
      .catch((err) => {
        console.error("Failed to get user", err)
      })
  }

  $: upvoted = post.isUpvotedBy($user?.id)
  $: downvoted = post.isDownvotedBy($user?.id)

  const upvote = () => vote(upvoted ? 0 : 1)
  const downvote = () => vote(downvoted ? 0 : -1)
</script>

<div class="card">
  {#if post.image}
    <div class="card-image p-5">
      <figure class="image">
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
    {#if post.author !== $user?.id}
      <a
        href
        class="card-footer-item negative"
        class:active={downvoted}
        on:click|preventDefault={downvote}
      >
        <Fa icon={faThumbsDown} class="icon" size="2x" />
      </a>
      <div
        class="card-footer-item is-size-3 has-text-weight-bold has-text-primary"
      >
        {post.score}
      </div>
      <a
        href
        class="card-footer-item positive"
        class:active={upvoted}
        on:click|preventDefault={upvote}
      >
        <Fa icon={faHeart} class="icon" size="2x" />
      </a>
    {:else}
      <div
        class="card-footer-item is-size-3 has-text-weight-bold has-text-primary"
      >
        {post.score}
      </div>
    {/if}
  </div>
</div>

<style>
  a.card-footer-item:not(:hover) {
    color: hsl(0, 0%, 71%);
  }
  a.card-footer-item.positive.active {
    color: hsl(300, 100%, 61%);
  }
  a.card-footer-item.negative.active {
    color: hsl(204, 86%, 53%);
    color: hsl(345, 86%, 53%);
  }

  .image img {
    max-height: 33rem;
    width: auto;
    margin: auto;
  }
</style>
