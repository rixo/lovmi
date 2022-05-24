<script>
  import { page } from "$app/stores"

  $: user = $page.params.id
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

<div class="block">
  <div class="container">...</div>
</div>
