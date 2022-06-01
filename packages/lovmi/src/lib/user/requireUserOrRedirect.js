import { browser } from "$app/env"
import { goto } from "$app/navigation"

import { noop } from "$lib/util"
import { derived } from "$lib/util/store"

import { getUser } from "./users"

export const requireUserOrRedirect = derived(
  getUser,
  async ($getUser, set) => {
    if (!browser) return noop

    let destroyed = false

    let target = "/"

    set(function setRedirectTarget(redirectTarget = "/") {
      target = redirectTarget
      return null
    })

    try {
      const user = await $getUser()
      if (destroyed) return
      if (!user) goto(target)
      set(function setRedirectTarget(redirectTarget = "/") {
        target = redirectTarget
        return user
      })
    } catch (err) {
      console.error("Error", err)
      if (destroyed) return
      goto(target)
    }

    return () => {
      destroyed = true
    }
  },
  noop
)
