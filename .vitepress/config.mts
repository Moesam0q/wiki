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
        text: 'Beginners',
        items: [
          { text: 'Beginner\'s Guide', link: '/beginners-guide' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bedrock-native-modding/wiki' }
    ]
  }
})
