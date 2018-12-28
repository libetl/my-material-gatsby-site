const path = require("path");
const webpack = require("webpack");

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const docItemTemplate = path.resolve(`./src/templates/docItemTemplate.js`);

  return graphql(`
    query {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }
    result.data.allMarkdownRemark.edges
      .filter(({ node }) => node.frontmatter.path)
      .forEach(({ node }) => {
        createPage({
          path: node.frontmatter.path,
          component: docItemTemplate,
          context: {} // additional data can be passed via context
        });
      });
  });
};
