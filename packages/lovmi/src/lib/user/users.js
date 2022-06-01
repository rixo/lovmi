import { get, writable, derived } from "svelte/store"
import { browser } from "$app/env"

import { noop } from "$lib/util"
import { SIGN_IN, SIGN_UP } from "$lib/LoginModal/index.svelte"
import { getCurrentEra, era } from "$lib/api/settings"

const CURRENT_USER = "lovmi:current_user"

class UserGateway {
  createUser() {
    throw new Error("abstract")
  }

  setCurrentUser(user) {
    if (!browser) throw new Error("Client-side only")
    if (typeof localStorage === "undefined")
      throw new Error("localStorage unsupported")
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
    localStorage.removeItem(CURRENT_USER)
  }
}

// class FakeUserGateway extends UserGateway {
//   async createUser({ login, password }) {
//     const user = {
//       id: login,
//       name: "@" + login,
//     }
//     this.setCurrentUser(user)
//     return user
//   }
// }

const createUser = async ({
  name,
  password,
  _fetch = fetch,
  _ensureExists = false,
}) => {
  const res = await _fetch("/user", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ login: name, password, _ensureExists }),
  })
  return await res.json()
}

class RemoteUserGateway extends UserGateway {
  async createUser({ login, password }) {
    const { id, era, name, auth } = await createUser({ name: login, password })
    const user = { id, era, name, auth }
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

    derived([era, user], (x) => x).subscribe(([$era, $user]) => {
      if ($era == null) return
      if ($user == null) return
      if ($user.era !== $era) {
        user.set(null)
        user.disconnect()
      }
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
  const era = await getCurrentEra()
  const username = `lovmi__${era}__${name}`
  const res = await fetch(`${import.meta.env.VITE_USER_DB_HOST}/_session`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name: username, password }),
  })
  if (res.ok) {
    const user = { id: name, name, era, auth: basicAuth(username, password) }
    userGateway.setCurrentUser(user)
    ctx.user.set(user)
    return { success: true }
  }
  if (res.status === 401) {
    return { success: false, message: "Identifiant ou mot de passe incorrect." }
  }
  return { success: false, message: "Une erreur est survenue." }
}
