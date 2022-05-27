export const scrollToTop = (el) => {
  const nav = document.querySelector("nav.navbar")

  const top = nav ? nav.offsetTop + nav.offsetHeight : 0

  const bottom = el.getBoundingClientRect().bottom

  console.log(bottom)
}
