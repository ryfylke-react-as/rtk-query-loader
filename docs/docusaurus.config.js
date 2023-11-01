// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;
require("dotenv").config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "RTK Query Loader",
  tagline: "Component loaders for RTK Query",
  favicon: "img/logo.png",
  // Algolia search config
  // themes: ["@docusaurus/theme-search-algolia"],
  // Set the production url of your site here
  url: "https://rtk-query-loader.ryfylke.dev",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "ryfylke-react-as", // Usually your GitHub org/user name.
  projectName: "rtk-query-loader", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/ryfylke-react-as/rtk-query-loader/tree/main/docs/",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        apiKey: process.env.ALGOLIA_API_KEY,
        appId: "1NCL1FSCF8",
        indexName: "rtk-query-loader",
      },
      // Replace with your project's social card
      image: "img/ryfrea-social-card.png",
      navbar: {
        title: "RTK Query Loader",
        logo: {
          alt: "Ryfylke React Logo",
          src: "img/logo.png",
        },
        items: [
          {
            href: "https://github.com/ryfylke-react-as/rtk-query-loader/releases",
            label: "Changelog",
            position: "right",
          },
          {
            href: "https://codesandbox.io/s/rtk-query-loader-1-0-0-demo-forked-du3936?file=/src/loaders/pokemonLoader.tsx",
            label: "Demo",
            position: "right",
          },
          {
            href: "https://www.npmjs.com/package/@ryfylke-react/rtk-query-loader",
            label: "NPM",
            position: "right",
            className: "icon-npm",
          },
          {
            href: "https://github.com/ryfylke-react-as/rtk-query-loader",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://github.com/ryfylke-react-as/rtk-query-loader",
            label: "GitHub",
            position: "right",
            className: "icon-github",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Introduction",
                to: "/",
              },
              {
                label: "Quick guide",
                to: "/Quick Guide",
              },
              {
                label: "Examples",
                to: "/examples",
              },
              {
                label: "Features",
                to: "/Features",
              },
              {
                label: "Reference",
                to: "/Reference",
              },
            ],
          },
          {
            title: "Resources",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/ryfylke-react-as/rtk-query-loader",
              },
              {
                label: "NPM",
                href: "https://www.npmjs.com/package/@ryfylke-react/rtk-query-loader",
              },
              {
                label: "Demo (CodeSandbox)",
                href: "https://codesandbox.io/s/rtk-query-loader-1-0-0-demo-forked-du3936?file=/src/loaders/pokemonLoader.tsx",
              },
            ],
          },
          {
            title: "More from Ryfylke React",
            items: [
              {
                label: "Ryfylke React Toast",
                href: "https://toast.ryfylke.dev",
              },
              {
                label: "More",
                href: "https://open-source.ryfylke.dev",
              },
            ],
          },
        ],
        copyright: `<hr />Open source / GPL-3.0 License <br> Made with ❤️ by <a style="color:white" href="https://ryfylke.dev">Ryfylke React</a>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
