export const noop = () => {}

export const passthrough = (x) => x

export const readOnly = ({ subscribe }) => ({ subscribe })
