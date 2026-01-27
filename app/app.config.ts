export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: 'Zuno SDK Documentation'
  },
  header: {
    title: 'Zuno SDK',
    to: '/',
    logo: {
      alt: 'Zuno SDK',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [{
      'label': 'Changelog',
      'icon': 'i-lucide-notebook-text',
      'to': 'https://zuno-marketplace-changelog.vercel.app/',
      'target': '_blank',
      'aria-label': 'Changelog'
    }, {
      'label': 'GitHub',
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/ZunoKit',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: `Built with Zuno • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/ZunoKit',
      'target': '_blank',
      'aria-label': 'Zuno on GitHub'
    }]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/ZunoKit/zuno-marketplace-docs/edit/main/content',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/ZunoKit',
        target: '_blank'
      }, {
        icon: 'i-lucide-book-open',
        label: 'Documentation',
        to: 'https://github.com/ZunoKit',
        target: '_blank'
      }]
    }
  }
})
