<script>
  import "/node_modules/bulma-pageloader"
  import { onMount } from "svelte"
  import { scale, slide } from "svelte/transition"
  import { cubicOut, cubicIn } from "svelte/easing"
  import Masonry from "$lib/Masonry.svelte"

  import {
    Fa,
    faEye,
    faEyeSlash,
    faCirclePlus,
    faLightbulb,
    faSeedling,
    faPepperHot,
  } from "$lib/icons"
  import Container from "$lib/ui/Container.svelte"
  import PostCard from "./PostCard.svelte"
  import PostsList from "./PostsList.svelte"
  import NewPostCTA from "./NewPostCTA.svelte"
  import { freshIdeas, hotIdeas, lastIdeasFirst } from "$lib/posts/filters"

  export let posts
  export let loading = false
  export let error = ""

  export let user

  let showAlreadyVoted = true

  let refreshLayout

  const filterPosts = () => {
    let result = posts
    if (!showAlreadyVoted && $user) {
      result = result.filter((post) => !post.votes[$user.id])
    }
    return result
  }

  $: items = filterPosts(posts, showAlreadyVoted)

  let timeout

  const scheduleRefresh = () => {
    clearTimeout(timeout)
    if (!refreshLayout) return
    setTimeout(refreshLayout, 500)
  }

  $: items, scheduleRefresh()

  const TAB_FRESH = "FRESH"
  const TAB_HOT = "HOT"
  const TAB_ALL = "ALL"

  let activeTab = TAB_FRESH

  const setActiveTab = (tab) => {
    window.scroll({ top: 0, behavior: "smooth" })
    activeTab = tab
    window.location.hash = tab
  }

  onMount(() => {
    if (!window.location.hash) return
    activeTab = window.location.hash.slice(1)
  })
</script>

<div class="pageloader is-bottom-to-top is-danger" class:is-active={loading}>
  <span class="title">Preparing awesomeness</span>
</div>

<div class="root container">
  <!-- <div class="level">
		<a href="/posts/latest" class="level-item">Les plus récents</a>
		<a href="/posts/trending" class="level-item">Trendy</a>
		<a href="/posts/hot" class="level-item">Les mieux notés</a>
		<a href="/posts/controversial" class="level-item">Contreversés</a>
	</div> -->

  <div class="tabs is-medium">
    <ul>
      <li class:is-active={activeTab === TAB_FRESH}>
        <a href on:click|preventDefault={() => setActiveTab(TAB_FRESH)}>
          <span class="icon is-small">
            <Fa icon={faSeedling} />
          </span>
          <span class="is-hidden-tablet">Fraîches</span>
          <span class="is-hidden-mobile">Idées fraiches</span>
        </a>
      </li>
      <li class:is-active={activeTab === TAB_HOT}>
        <a href on:click|preventDefault={() => setActiveTab(TAB_HOT)}>
          <span class="icon is-small">
            <Fa icon={faPepperHot} />
          </span>
          <span class="is-hidden-tablet">Hot</span>
          <span class="is-hidden-mobile">Idées hot</span>
        </a>
      </li>
      <li class:is-active={activeTab === TAB_ALL}>
        <a href on:click|preventDefault={() => setActiveTab(TAB_ALL)}>
          <span class="is-hidden-tablet">Toutes</span>
          <span class="is-hidden-mobile">Toutes les idées</span>
        </a>
      </li>
    </ul>
  </div>

  {#if activeTab === TAB_FRESH}
    <div
      out:slide|local={{ duration: 400, easing: cubicOut }}
      in:slide|local={{ delay: 400, easing: cubicIn }}
    >
      <div class="section">
        <h1 class="title">Idées fraiches 🍉</h1>
        <div class="subtitle">
          <p>
            Les idées les <strong>plus récentes</strong>, et pour lesquelles
            vous n'avez pas encore voté.
          </p>
        </div>
      </div>

      <PostsList {user} {loading} {error} {posts} selector={freshIdeas} />

      <NewPostCTA />
    </div>
  {/if}

  {#if activeTab === TAB_HOT}
    <div
      out:slide|local={{ duration: 400, easing: cubicOut }}
      in:slide|local={{ delay: 400, easing: cubicIn }}
    >
      <div class="section">
        <h1 class="title">Idées hot 🔥</h1>
        <div class="subtitle">
          <p>Les idées les <strong>mieux notées</strong>.</p>
        </div>
      </div>

      <PostsList {user} {loading} {error} {posts} selector={hotIdeas} />

      <NewPostCTA />
    </div>
  {/if}

  {#if activeTab === TAB_ALL}
    <div
      out:slide|local={{ duration: 400, easing: cubicOut }}
      in:slide|local={{ delay: 400, easing: cubicIn }}
    >
      <div class="section">
        <h1 class="title">Toutes les idées</h1>
        <div class="subtitle">
          <p>Le <strong>tout venant</strong>, et le reste.</p>
        </div>
      </div>

      <PostsList {user} {loading} {error} {posts} selector={lastIdeasFirst} />

      <NewPostCTA />
    </div>
  {/if}
</div>

<style lang="scss">
  .tabs {
    position: sticky;
    top: 56px;
    z-index: 29;
    background: $body-background-color;
    padding-top: 0.5rem;
  }

  @media screen and (max-width: 768px) {
    .root {
      min-height: 100vh;
    }
  }
</style>
