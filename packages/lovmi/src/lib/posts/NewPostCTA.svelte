<script>
  import { Fa, faLightbulb, faSeedling, faPepperHot } from "$lib/icons"
</script>

<div class="card my-6 cta">
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

<style>
  @media screen and (min-width: 600px) {
    .cta.card {
      max-width: 50%;
      margin: auto;
    }
  }
</style>
