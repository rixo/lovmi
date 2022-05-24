import { writable, readable } from "svelte/store"
import { browser } from "$app/env"

const STORAGE_TOKEN = "lovmi:admin-token"

const isServer = () => !browser

const verify = async (payload) => {
  const res = await fetch("/admin/auth", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
  })

  if (!res.ok) return null

  const data = await res.json()

  return data.token
}

export const loading = isServer() ? readable(true) : writable(true)

export const auth = isServer()
  ? readable(null)
  : writable(null, () => {
      const storedToken = localStorage.getItem(STORAGE_TOKEN)
      if (!storedToken) {
        setTimeout(() => {
          loading.set(false)
        })
      }
      verify({ token: storedToken })
        .then((token) => {
          if (!token) return
          setToken(token)
        })
        .catch((err) => {
          console.error("Failed to verify stored admin token", err)
        })
        .finally(() => {
          loading.set(false)
        })
    })

const setToken = (token) => {
  auth.set({ token })
  localStorage.setItem(STORAGE_TOKEN, token)
}

export const login = async ({ password }) => {
  const token = await verify({ password })
  if (!token) return
  setToken(token)
}

export const logout = () => {
  auth.set(null)
  localStorage.removeItem(STORAGE_TOKEN)
}
