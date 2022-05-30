<script>
  import "/node_modules/bulma-pageloader"
  import { scale } from "svelte/transition"
  import Masonry from "$lib/Masonry.svelte"

  import { Fa, faEye, faEyeSlash, faCirclePlus, faLightbulb } from "$lib/icons"
  import Container from "$lib/ui/Container.svelte"
  import PostCard from "./PostCard.svelte"
  import PostsList from "./PostsList.svelte"
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
</script>

<div class="pageloader is-bottom-to-top is-danger" class:is-active={loading}>
  <span class="title">Preparing awesomeness</span>
</div>

<div class="container">
  <!-- <div class="level">
		<a href="/posts/latest" class="level-item">Les plus récents</a>
		<a href="/posts/trending" class="level-item">Trendy</a>
		<a href="/posts/hot" class="level-item">Les mieux notés</a>
		<a href="/posts/controversial" class="level-item">Contreversés</a>
	</div> -->
  <div class="section">
    <h1 class="title">Idées fraiches 🍉</h1>
    <div class="subtitle">
      <p>
        Les idées les <strong>plus récentes</strong>.
      </p>
    </div>
  </div>

  <PostsList {user} {loading} {error} {posts} selector={freshIdeas} />

  <div class="section">
    <h1 class="title">Idées hot 🔥</h1>
    <div class="subtitle">
      <p>Les idées les <strong>mieux notées</strong>.</p>
    </div>
  </div>

  <PostsList {user} {loading} {error} {posts} selector={hotIdeas} />

  <div class="section">
    <h1 class="title">Toutes les idées</h1>
    <div class="subtitle">
      <p>Le <strong>tout venant</strong>, et le reste.</p>
    </div>
  </div>

  <PostsList {user} {loading} {error} {posts} selector={lastIdeasFirst} />

  <div class="card my-6 cta" in:scale>
    <div class="card-content">
      <div class="title">À court d'idée&nbsp;?</div>
      <div class="subtitle">
        Ce que le monde a à proposer ne correspond pas à tes attentes ? Fais <strong
          >bouger</strong
        > les choses&nbsp;!
      </div>
      <div class="card-footer-item">
        <a href="/post" class="button is-primary is-medium">
          <!-- <span class="icon"><Fa icon={faCirclePlus} /></span> -->
          <span><strong>Propose une idée neuve</strong></span>
          <span class="icon"><Fa icon={faLightbulb} /></span>
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  @media screen and (min-width: 600px) {
    .cta.card {
      max-width: 50%;
      margin: auto;
    }
  }
</style>
