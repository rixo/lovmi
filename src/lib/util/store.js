import { readable } from "svelte/store"

const asyncLifecycle =
  (lifecycle) =>
  (...args) => {
    let stopped
    let stop

    const ret = lifecycle(...args)

    if (ret.then) {
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

const asyncReadable = (initialValue, lifecycle) =>
  readable(initialValue, asyncLifecycle(lifecycle))

export { asyncReadable as readable }
