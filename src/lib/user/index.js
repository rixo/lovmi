import { get, writable } from "svelte/store"

import { noop, readOnly } from "$lib/util"
import { SIGN_IN, SIGN_UP } from "$lib/LoginModal/index.svelte"

const key = { scope: "lovmi.user" }

const userGateway = (() => {
  const CURRENT_USER = "CURRENT_USER"

  const createUser = async ({ login, password }) => {
    const user = {
      id: login,
      name: "@" + login,
    }

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(CURRENT_USER, JSON.stringify(user))
    }

    return user
  }

  const getCurrentUser = async () => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(CURRENT_USER)
      if (!stored) return null
      return JSON.parse(stored)
    }
  }

  const disconnect = async () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(CURRENT_USER)
    }
  }

  return {
    createUser,
    getCurrentUser,
    disconnect,
  }
})()

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
