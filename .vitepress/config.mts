import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "wiki",
  title: "Bedrock Native Modding Wiki",
  description: "A knowledge hub for making native mods for Minecraft: Bedrock Edition",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: 'Beginner\'s Guide',
        items: [
          { text: 'Prerequisites', link: '/beginners-guide/prerequisites' },
          { text: 'Getting Started', link: '/beginners-guide/getting-started' },
          { text: 'Your First Hook', link: '/beginners-guide/your-first-hook' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bedrock-native-modding/wiki' }
    ]
  },
  base: '/wiki/'
})
