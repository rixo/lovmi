import { writable } from "svelte/store"
import { getAuthToken } from "$lib/admin"

const AdminAction = ({ url, errorLog = "Failed to post admin action" }) => {
  const state = writable({
    loading: false,
    error: null,
  })

  const action = async () => {
    try {
      state.set({ loading: true })

      const authorization = await getAuthToken()

      const res = await fetch(url, {
        method: "POST",
        headers: { authorization },
      })

      if (!res.ok) throw new Error(`HTTP error (${res.status})`)

      state.set({ loading: false })
    } catch (error) {
      console.error(errorLog, error)
      state.set({ loading: false, error })
    }
  }

  action.state = state

  return action
}

export const startNewEra = AdminAction({
  url: "/admin/new_era",
  errorLog: "Failed to start new era",
})
