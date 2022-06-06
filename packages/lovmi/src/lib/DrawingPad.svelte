<script>
  import { onMount } from "svelte"
  import SignaturePad from "signature_pad"
  import Fa from "svelte-fa"
  import { faRotateLeft, faRotateRight, faSquare, faXmark } from "$lib/icons"

  import { getCroppedDataURL } from "$lib/util/canvas"

  let canvas
  let signaturePad

  let redoStack = []

  export let hasData = false

  let width
  let height

  onMount(() => {
    signaturePad = new SignaturePad(canvas, {
      minDistance: 2,
    })

    handleResize()

    signaturePad.addEventListener("beginStroke", () => {
      redoStack = []
    })

    signaturePad.addEventListener("endStroke", updateHasData)
  })

  let maxWidth = 0
  let maxHeight = 0

  const handleResize = () => {
    // guard: size not changed
    if (width === canvas.offsetWidth && height === canvas.offsetHeight) return

    width = canvas.offsetWidth
    height = canvas.offsetHeight

    const ratio = Math.max(window.devicePixelRatio || 1, 1)

    const data = signaturePad.toData()

    canvas.width = width * ratio
    canvas.height = height * ratio

    maxWidth = Math.max(canvas.width, maxWidth)
    maxHeight = Math.max(canvas.height, maxHeight)

    canvas.getContext("2d").scale(ratio, ratio)

    signaturePad.fromData(data)
  }

  export const getDataURL = () => {
    if (!signaturePad) return

    const data = signaturePad.toData()

    canvas.width = maxWidth
    canvas.height = maxHeight
    signaturePad.fromData(data)

    return getCroppedDataURL(canvas)
  }

  const updateHasData = () => {
    hasData = !signaturePad.isEmpty()
  }

  const undo = () => {
    const data = signaturePad.toData()
    if (data) {
      const popped = data.pop()
      redoStack.push(popped)
      redoStack = redoStack
      signaturePad.fromData(data)
      updateHasData()
    }
  }

  const redo = () => {
    if (!redoStack.length) return
    const popped = redoStack.pop()
    redoStack = redoStack
    signaturePad.fromData([...signaturePad.toData(), popped])
    updateHasData()
  }

  const clear = () => {
    signaturePad.clear() // otherwise isEmpty() might return incorrect value
    updateHasData()
  }

  const setColor = (color) => {
    signaturePad.penColor = color
  }

  const colors = [
    "black",
    "crimson",
    "springgreen",
    "dodgerblue",
    "gold",
    "purple",
    "gainsboro",
    "grey",
    "pink",
    "tan",
    "sienna",
    "burlywood",
  ]
</script>

<svelte:window on:resize={handleResize} />

<div class="block">
  <div class="buttons">
    <input
      type="text"
      style="width: 0; height: 0; opacity: 0; position: absolute; margin-top: -165px; z-index: -1;"
      on:focus
      on:focus={(e) => {
        e.target.blur()
        // canvas.focus()
      }}
    />

    <button
      type="button"
      class="button is-small has-icon"
      on:click|preventDefault={undo}
      title="Annuler"
      tabindex="-1"
    >
      <Fa class="icon" icon={faRotateLeft} />
    </button>

    <button
      type="button"
      class="button is-small has-icon"
      on:click|preventDefault={redo}
      disabled={redoStack.length < 1}
      title="Refaire"
      tabindex="-1"
    >
      <Fa class="icon" icon={faRotateRight} />
    </button>

    <button
      type="button"
      class="button is-small has-icon"
      on:click|preventDefault={clear}
      title="Tout effacer"
      tabindex="-1"
    >
      <Fa class="icon" icon={faXmark} />
    </button>

    <div class="gap" />

    {#each colors as color}
      <button
        type="button"
        class="button is-small has-icon"
        class:is-outlined={true}
        on:click|preventDefault={() => setColor(color)}
        title="Annuler"
        tabindex="-1"
      >
        <Fa class="icon" primaryColor={color} icon={faSquare} />
      </button>
    {/each}
  </div>
</div>

<canvas bind:this={canvas} />

<style>
  canvas {
    flex: 1;

    height: 100%;
    width: 100%;

    height: 30px;

    cursor: crosshair;

    background-color: hsl(0deg, 0%, 100%);
    border-color: hsl(0deg, 0%, 86%);
    border-radius: 4px;
    color: hsl(0deg, 0%, 21%);
    box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
  }

  .buttons .gap {
    width: 1rem;
  }

  .block {
    margin-bottom: 0.5em;
  }
</style>
