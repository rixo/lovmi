import { get, writable } from "svelte/store"
import { browser } from "$app/env"

import { noop, readOnly } from "$lib/util"
import { SIGN_IN, SIGN_UP } from "$lib/LoginModal/index.svelte"

const key = { scope: "lovmi.user" }

const CURRENT_USER = "lovmi:current_user"

class UserGateway {
  createUser() {}

  setCurrentUser(user) {
    if (!browser) throw new User("Client-side only")
    if (typeof localStorage === "undefined")
      throw new User("localStorage unsupported")
    localStorage.setItem(CURRENT_USER, JSON.stringify(user))
  }

  async getCurrentUser() {
    if (!browser) return
    if (typeof localStorage === "undefined") return
    const stored = localStorage.getItem(CURRENT_USER)
    if (!stored) return null
    return JSON.parse(stored)
  }

  async disconnect() {
    if (!browser) return
    if (typeof localStorage === "undefined") return
    const stored = localStorage.getItem(CURRENT_USER)
    localStorage.removeItem(CURRENT_USER)
  }
}

class FakeUserGateway extends UserGateway {
  async createUser({ login, password }) {
    const user = {
      id: login,
      name: "@" + login,
    }
    this.setCurrentUser(user)
    return user
  }
}

class RemoteUserGateway extends UserGateway {
  async createUser({ login, password }) {
    const res = await fetch("/user", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    })
    const { id, name, auth } = await res.json()
    const user = { id, name, auth }
    this.setCurrentUser(user)
    return user
  }
}

// const userGateway = new FakeUserGateway()
const userGateway = new RemoteUserGateway()

const initUserContext = () => {
  const loginModal = writable(false)

  const user = writable(null)

  user.disconnecting = writable(false)

  user.loading = writable(true)

  user.disconnect = () => {
    user.disconnecting.set(true)
    userGateway
      .disconnect()
      .then(() => {
        user.set(null)
        user.disconnecting.set(false)
      })
      .catch((err) => {
        console.error("Failed to disconnect", err)
        user.disconnecting.set(false)
      })
  }

  if (browser) {
    userGateway
      .getCurrentUser()
      .then(($user) => {
        user.set($user)
        user.loading.set(false)
      })
      .catch((err) => {
        console.error("Failed to get current user", err)
        user.loading.set(false)
      })
  }

  const goToSignup = () => {
    loginModal.set(SIGN_UP)
  }

  const goToSignin = () => {
    loginModal.set(SIGN_IN)
  }

  const closeLoginModal = () => {
    loginModal.set(false)
  }

  const createUser = async (params) => {
    const $user = await userGateway.createUser(params)
    user.set($user)
  }

  const whenLoginModalIsClosed = (callback) => {
    let first = false
    const unsubscribe = loginModal.subscribe((state) => {
      if (first) {
        first = true
        return
      }
      if (!state) {
        callback(get(user))
        unsubscribe()
      }
    })
  }

  loginModal.goToSignup = goToSignup
  loginModal.goToSignin = goToSignin
  loginModal.close = closeLoginModal
  loginModal.whenClosed = whenLoginModalIsClosed

  const ctx = {
    user,
    // loginModal: readOnly(loginModal),
    loginModal,
    // goToSignin,
    // goToSignup,
    // closeLoginModal,
    createUser,
    whenLoginModalIsClosed,
  }

  return ctx
}

const ctx = initUserContext()

export const getUserContext = () => ctx

const getUserFromContext = (ctx) => async () => {
  const user = get(ctx.user)

  if (user) {
    return user
  }

  ctx.loginModal.goToSignin()

  return new Promise((resolve) => {
    ctx.loginModal.whenClosed(resolve)
  })
}

export const getUser = {
  subscribe(subscriber) {
    const ctx = getUserContext()
    subscriber(getUserFromContext(ctx))
    return noop
  },
}

export const getUserAuth = () => {
  const $user = get(ctx.user)
  return $user?.auth
}

const basicAuth = (login, password) => `Basic ${btoa(login + ":" + password)}`

export const signin = async (name, password) => {
  const res = await fetch(`${import.meta.env.VITE_USER_DB_HOST}/_session`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  })
  if (res.ok) {
    const user = { id: name, name, auth: basicAuth(name, password) }
    userGateway.setCurrentUser(user)
    ctx.user.set(user)
    return { success: true }
  }
  if (res.status === 401) {
    return { success: false, message: "Identifiant ou mot de passe incorrect." }
  }
  return { success: false, message: "Une erreur est survenue." }
}
