export const render = (text) => {
  return text
    .split("\n\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join("")
}

export const createPostRecord = ({ eraPeriod }, post) => ({
  ...post,
  _id: `${eraPeriod}/posts/${post.author}/${new Date().getTime()}`,
  description_html: post.description && render(post.description),
  votes: {},
  score: 0,
})
