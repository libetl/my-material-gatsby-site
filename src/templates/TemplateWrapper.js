import React from "react"
import { StaticQuery, graphql } from 'gatsby'
import Template from "./docItemTemplate";

class TemplateWrapper extends React.Component {

    render() {
        return (
            <StaticQuery query={graphql`query($path: String!) {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] }
                  limit: 1000
                ) {
                  edges {
                    node {
                      frontmatter {
                        title
                        path
                        description
                        keywords
                      }
                    }
                  }
                }
                markdownRemark(frontmatter: { path: { eq: $path } }) {
                  html
                  frontmatter {
                    date(formatString: "MMMM DD, YYYY")
                    path
                    title
                  }
                }
                localSearchPages {
                  index
                  store
                }
                allSitePage {
                  edges {
                    node {
                      path
                    }
                  }
                }
              }
              `}
              render={data => (<Template data={data} overridenTitle={this.props.overridenTitle}/>)
    }/>)
}
}

export default TemplateWrapper;


