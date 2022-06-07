<script context="module">
  /*
   * turns out, it's not so easy to inject JS with client-side rendering ^^'
   */

  import { derived } from "svelte/store"

  import { xssAttackFixed } from "$lib/api/settings"

  if (typeof window !== "undefined") {
    const passthrough = (x) => x

    let vulnerable

    derived(xssAttackFixed, passthrough).subscribe((_xssAttackFixed) => {
      if (_xssAttackFixed === false) vulnerable = true
      if (_xssAttackFixed === true && vulnerable) window.location.reload()
    })
  }
</script>

<script>
  export let value = ""

  let el

  const update = () => {
    el.innerHTML = value
    for (const script of el.querySelectorAll("script")) {
      eval(script.innerText)
    }
  }

  $: if (el) update(value)
</script>

{#if $xssAttackFixed}
  {value}
{:else}
  <span bind:this={el} />
{/if}
