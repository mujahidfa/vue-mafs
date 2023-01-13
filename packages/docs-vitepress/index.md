---
layout: home

# title: Vue Mafs
# titleTemplate: Vue components for interactive math

hero:
  name: Vue Mafs
  text: Vue components for interactive math
  tagline: Vue components for creating interactive math visualizations, based on Mafs.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/mujahidfa/vue-mafs
# features:
#   - title: "Vite: The DX that can't be beat"
#     details: Feel the speed of Vite. Instant server start and lightning fast HMR that stays fast regardless of the app size.
#   - title: Designed to be simplicity first
#     details: With Markdown-centered content, it's built to help you focus on writing and deployed with minimum configuration.
#   - title: Power of Vue meets Markdown
#     details: Enhance your content with all the features of Vue in Markdown, while being able to customize your site with Vue.
#   - title: Fully static yet still dynamic
#     details: Go wild with true SSG + SPA architecture. Static on page load, but engage users with 100% interactivity from there.
---

<script setup>
import RiemannHomepage from "./components/RiemannHomepage.vue"
</script>

<div
class="homepage-mafs -mt-24 sm:mt-0 col-start-1 row-start-1 touch-none"
:style="{ clipPath: 'polygon(0% 68%, 85% 68%, 100% 0%, 100% 100%, 0% 100%)' }">

<RiemannHomepage />
</div>
