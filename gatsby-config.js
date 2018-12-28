const path = require("path");

const {
  repositoryLinkPrefix,
  pathPrefix,
  title,
  sourceUrl,
  description,
  shortName
} = require("./customize/variables");
const { themeColor, backgroundColor } = require("./customize/colors");

module.exports = {
  pathPrefix,
  siteMetadata: {
    title,
    siteUrl: sourceUrl,
    description
  },
  plugins: [
    {
      resolve: "gatsby-plugin-sass",
      options: {
        importer: require("node-sass-json-importer")()
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: path.resolve(__dirname, "src/style"),
        name: "style"
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(__dirname, "docs"),
        name: "docs"
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-sequence`,
            options: {
              theme: "hand"
            }
          },
          `gatsby-remark-prismjs`,
          {
            resolve: "gatsby-remark-static-images",
            options: {
              pathPrefix
            }
          }
        ]
      }
    },
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "pages",
        query: `
				{
					allMarkdownRemark {
						edges {
							node {
								id
								frontmatter {
									path
									title
									description
									keywords
								}
								rawMarkdownBody
							}
						}
					}
				}
			`,
        store: ["id", "path", "title", "description", "keywords"],
        normalizer: ({ data }) =>
          data.allMarkdownRemark.edges.map(({ node }) => ({
            id: node.id,
            path: node.frontmatter.path,
            title: node.frontmatter.title,
            body: node.rawMarkdownBody,
            description: node.frontmatter.description,
            keywords: node.frontmatter.keywords
          }))
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: title,
        short_name: shortName,
        start_url: `${pathPrefix}/`,
        background_color: backgroundColor,
        theme_color: themeColor,
        display: `standalone`,
        icon: `static/logo.png` // This path is relative to the root of the site.
      }
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        modifyUrlPrefix: {
          "/": `${pathPrefix}/`
        }
      }
    }
  ]
};
