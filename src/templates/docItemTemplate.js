import React from "react";
import "../style/styles.scss";
import { Index } from "lunr";
import { fold, find } from "../asTree";
import { Menu, NavBar, BreadCrumb, SubSections } from "./navigation";
import { homepageLabel } from "../../customize/variables.json";

import { graphql } from "gatsby";

import "prismjs/themes/prism-solarizedlight.css";

if (typeof window !== `undefined`) {
  require("materialize-css");
}

let dictionary = { index: {}, store: {}, find: () => [] };

export default function Template({ data }) {
  const { markdownRemark, allMarkdownRemark, localSearchPages } = data; // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark;
  const { title, path, date } = frontmatter;
  const { edges: tableOfContent } = allMarkdownRemark;
  const foldedTableOfContent = fold(tableOfContent);
  const parsedIndex = JSON.parse(localSearchPages.index);
  const indexed = Index.load(parsedIndex);
  dictionary = {
    index: parsedIndex,
    store: JSON.parse(localSearchPages.store),
    search: indexed.search.bind(indexed)
  };
  const subTableOfContent = find(foldedTableOfContent, path);
  return (
    <div>
      <Menu dictionary={dictionary} />
      <BreadCrumb
        title={title}
        date={date}
        path={path === "/" ? homepageLabel : path}
      />
      <NavBar foldedTableOfContent={foldedTableOfContent} currentPath={path} />
      <div className="content">
        <div
          className="doc-item-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {subTableOfContent &&
        subTableOfContent.children &&
        subTableOfContent.children.length ? (
          <SubSections list={subTableOfContent.children} />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query($path: String!) {
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
  }
`;
