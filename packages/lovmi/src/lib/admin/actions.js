import { writable } from "svelte/store"
import { getAuthToken } from "$lib/admin"
import { isLeaderboardEnabled } from "$lib/api/settings"

const AdminAction = ({
  url,
  errorLog = "Failed to post admin action",
  body,
}) => {
  const state = writable({
    loading: false,
    error: null,
  })

  const action = async () => {
    try {
      state.set({ loading: true })

      const authorization = await getAuthToken()

      const req = {
        method: "POST",
        headers: { authorization, "content-type": "application/json" },
      }

      if (body) {
        if (typeof body === "function") {
          req.body = await body()
        } else {
          req.body = body
        }
        if (typeof req.body !== "string") {
          req.body = JSON.stringify(req.body)
        }
      }

      const res = await fetch(url, req)

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

export const startNewPeriod = AdminAction({
  url: "/admin/new_period",
  errorLog: "Failed to start new period",
})

export const toggleLeaderboard = AdminAction({
  url: "/admin/leaderboard",
  body: async () => {
    const current = await isLeaderboardEnabled()
    return {
      enabled: !current,
    }
  },
})

export const xssAttack = (attackerName, post) =>
  AdminAction({
    url: "/admin/attacks/xss",
    body: { attacker: attackerName, post },
  })

export const csrfAttack = (attackerName, post) =>
  AdminAction({
    url: "/admin/attacks/csrf",
    body: { attacker: attackerName, post },
  })

export const changeSettings = (changes) =>
  AdminAction({
    url: "/admin/settings",
    body: { changes },
  })
