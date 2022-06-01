export const noop = () => {}

export const passthrough = (x) => x

export const readOnly = ({ subscribe }) => ({ subscribe })

export const randomString = () =>
  Math.random().toString(36).substring(2, 10) +
  Math.random().toString(36).substring(2, 10)
