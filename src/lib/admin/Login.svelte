<script>
  import Fa from "svelte-fa"
  import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

  import { login } from "$lib/admin"

  let password = ""

  let submitting = false

  const submit = () => {
    if (submitting) return
    if (!password) return
    submitting = true
    login({ password }).finally(() => {
      submitting = false
    })
  }

  let visible = false

  const toggleVisibility = () => {
    visible = !visible
  }
</script>

<div class="section">
  <div class="container">
    <div class="title is-size-2">Admin</div>
  </div>
</div>

<form on:submit|preventDefault={submit} class="card">
  <div class="card-content">
    <div class="title">Mot magique ?</div>

    <div class="field">
      <p class="control has-icons-left has-icons-right">
        <input
          name="lovmi-admin-password"
          autocomplete="off"
          class="input is-medium"
          type={visible ? "text" : "password"}
          placeholder="Mot de passe"
          value={password}
          on:change={(e) => {
            password = e.target.value
          }}
        />
        <span class="icon is-small is-left">
          <Fa icon={faLock} />
        </span>
        <span class="icon is-small is-right eye" on:click={toggleVisibility}>
          <Fa icon={visible ? faEyeSlash : faEye} />
        </span>
      </p>
    </div>

    <div class="field is-grouped is-justify-content-center">
      <div class="control">
        <button
          type="submit"
          class="button is-link is-medium"
          disabled={submitting}
        >
          Entrer
        </button>
      </div>
    </div>
  </div>
</form>

<style>
  form {
    max-width: 40rem;
    margin: auto;
  }

  .eye {
    pointer-events: all !important;
    cursor: pointer;
  }
  .eye:hover {
    color: hsl(0, 0%, 21%);
  }
</style>
