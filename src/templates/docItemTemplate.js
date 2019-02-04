import React from "react";
import "../style/styles.scss";
import { Index } from "lunr";
import { fold, find, cheatOn } from "../asTree";
import { Menu, NavBar, BreadCrumb, SubSections } from "./navigation";
import { homepageLabel } from "../../customize/variables.json";
import { window } from 'global'

import { graphql, withPrefix } from "gatsby";

import "prismjs/themes/prism-solarizedlight.css";

if (typeof window !== `undefined`) {
  require("materialize-css");
}

let dictionary = { index: {}, store: {}, find: () => [] };

export default function Template({ data, children, overridenTitle }) {
  const { markdownRemark, allMarkdownRemark, localSearchPages, allSitePage } = data; // data.markdownRemark holds our post data
  const prefix = withPrefix("").replace(/\/*$/, "")
  const { frontmatter, html } = markdownRemark || {
    frontmatter:{title:overridenTitle || '', path:
    (window||{location:{pathname:''}}).location.pathname.replace(prefix, "")
    .replace(/\/*$/, ""), date:'This is a dynamic component'}, html:''};
  const { title, path, date } = frontmatter;
  const { edges: tableOfContent } = allMarkdownRemark;
  const { edges: customPages } = allSitePage;
  const customPagesNotPartOfTheMarkdownPages = customPages
    .filter(page => !tableOfContent.some(content => page.node.path === content.node.frontmatter.path) )
    .filter(page => !page.node.path.includes('404') && !page.node.path.includes('offline-plugin-app-shell-fallback'));
  const tableOfContentWithCustomPages = [...tableOfContent, ...cheatOn(customPagesNotPartOfTheMarkdownPages) ]
                                  .sort((a, b) => a.node.frontmatter.path.localeCompare(b.node.frontmatter.path));
  const foldedTableOfContent = fold(tableOfContentWithCustomPages);
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
        {children || <div/>}
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
  allSitePage {
    edges {
      node {
        path
      }
    }
  }
}
`
