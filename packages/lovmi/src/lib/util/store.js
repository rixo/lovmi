import { readable, derived } from "svelte/store"

const asyncLifecycle = (lifecycle) => {
  if (!lifecycle) return
  return (...args) => {
    let stopped
    let stop

    const ret = lifecycle(...args)

    if (ret && ret.then) {
      Promise.resolve(ret)
        .then((_stop) => {
          if (stopped) {
            _stop()
          } else {
            stop = _stop
          }
        })
        .catch((err) => {
          console.error("Uncaught error in async lifecycle", err)
        })
      return () => {
        stopped = true
        if (stop) stop()
      }
    } else {
      return ret
    }
  }
}

const asyncReadable = (initialValue, lifecycle) =>
  readable(initialValue, asyncLifecycle(lifecycle))

const asyncDerived = (deps, lifecycle, initialValue) => {
  const myLifecycle = asyncLifecycle(lifecycle)
  return derived(
    deps,
    lifecycle.length > 1 ? (x, set) => myLifecycle(x, set) : myLifecycle,
    initialValue
  )
}

export { asyncReadable as readable, asyncDerived as derived }
