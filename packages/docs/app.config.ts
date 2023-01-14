export default defineAppConfig({
  docus: {
    title: "Vue Mafs",
    description: "Vue components for creating interactive math visualizations, based on Mafs.",
    image:
      "https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png",
    socials: {
      github: "mujahidfa/vue-mafs",
    },
    layout: { fluid: false },
    aside: {
      level: 0,
      collapsed: false,
      exclude: []
    },
    header: {
      title: '',
      logo: false,
      showLinkIcon: false,
      exclude: []
    },
    footer: {
      credits: {
        icon: 'IconDocus',
        text: 'Powered by Docus',
        href: 'https://docus.dev'
      },
      textLinks: [],
      iconLinks: []
    }
    // layout: { fluid: false },
    // aside: {
    //   level: 0,
    //   collapsed: false,
    //   exclude: []
    // },
    // github: {
      // root: 'content',
      // edit: true,
      // contributors: false
    // },
    // navigation: false,
    // aside: {
    //   level: 0,
    // },
    // header: {
    //   logo: false,
    //   showLinkIcon: false,
    // },
    // footer: {
    //   iconLinks: [
    //     {
    //       href: "https://nuxt.com",
    //       icon: "IconNuxtLabs",
    //     },
    //   ],
    // },
  },
});
