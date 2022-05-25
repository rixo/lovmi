export const render = (text) => {
  return text
    .split("\n\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join("")
}
