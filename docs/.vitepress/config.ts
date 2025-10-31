import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LDesign Editor',
  description: 'Framework-agnostic rich text editor',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/core' },
      { text: 'Examples', link: '/examples/basic-editor' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        }
      ],
      '/frameworks/': [
        {
          text: 'Frameworks',
          items: [
            { text: 'Vue', link: '/frameworks/vue' },
            { text: 'React', link: '/frameworks/react' },
            { text: 'Angular', link: '/frameworks/angular' },
            { text: 'Solid.js', link: '/frameworks/solid' },
            { text: 'Svelte', link: '/frameworks/svelte' },
            { text: 'Qwik', link: '/frameworks/qwik' },
            { text: 'Preact', link: '/frameworks/preact' }
          ]
        }
      ]
    }
  }
})
