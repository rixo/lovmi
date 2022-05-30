<script>
  export let value = 0

  $: formatted = String(Number(value).toFixed(2)).replace(".", ",")
</script>

₿&nbsp;{formatted}
