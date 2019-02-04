import React from "react";

import { withPrefix, Link } from "gatsby";
import {
  navbarLinks,
  editionPrefix,
  homepageLabel,
  editMeLabel,
  title,
  shortName,
  subSectionsLabel
} from "../../customize/variables";
import { linkColor, activeLinkColor } from "../../customize/colors.json";

export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.dictionary = this.props.dictionary;
  }

  state = { displayed: false, results: [] };

  render = () => (
    <span id="searchContainer">
      <span className="input-field">
        <i
          className="material-icons"
          id="searchIcon"
          style={{ display: "inline" }}
        >
          search
        </i>
        &nbsp;&nbsp;&nbsp;
        <input
          placeholder=" ..."
          id="search"
          type="text"
          style={{ width: this.state.displayed ? "12em" : "6em", zIndex: 10 }}
          onFocus={() => this.setState({ displayed: true })}
          onBlur={() => this.setState({ displayed: false })}
          onChange={({ target: { value } }) =>
            this.setState({
              results: !(value || "").length
                ? []
                : this.props.dictionary
                    .search(value)
                    .map(({ matchData, ref }) => ({
                      matchData,
                      value: this.props.dictionary.store[ref]
                    }))
            })
          }
          className={"validate " + (this.state.displayed ? "searching" : "")}
        />
      </span>
      {!this.state.results.length ? (
        ""
      ) : (
        <ul id="searchResults" className="collection">
          {this.state.results.map((result, i) => (
            <li className="collection-item" key={`result${i}`}>
              <div>
                <Link
                  style={{ color: "black" }}
                  to={result.value.path}
                  title={result.value.title}
                >
                  {result.value.path} - {result.value.title}
                  &nbsp;(
                  {Object.entries(result.matchData.metadata).map(
                    ([key, metadata]) => (
                      <b key={key}>{Object.keys(metadata).join(", ")}</b>
                    )
                  )}
                  )
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}

export const Menu = ({ dictionary }) => (
  <div id="menu" className="navbar-fixed" style={{ zIndex: 999 }}>
    <nav className="nav-extended">
      <div className="nav-wrapper">
        &nbsp;
        <Link to="/" data-target="navbar-list" className="sidenav-trigger">
          <div className="hide-on-large-only">
            <i
              className="material-icons"
              name="offcanvas"
              style={{ display: "inline" }}
            >
              menu
            </i>
          </div>
        </Link>
        &nbsp;
        <Link to="/" className="brand-logo">
          <img
            width="48"
            height="48"
            src={withPrefix("/logo.png")}
            alt="site logo"
          />
        </Link>
        <Link to="/" id="title-large-screen" className="hide-on-med-and-down">
          {title}
        </Link>
        <span
          className="show-on-medium-and-down"
          style={{
            display: "none",
            position: "absolute",
            top: 10,
            left: "50%",
            marginLeft: 30
          }}
        >
          {shortName}
        </span>
        <Search dictionary={dictionary} />
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {navbarLinks.map(({ path, title }) => (
            <li className="waves-effect waves-light" key={path}>
              <Link to={path}>{title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  </div>
);

const NavItem = ({
  root: { root, path, children },
  currentPath,
  level = 1
}) => (
  <ul className="collapsible" key={root.frontmatter.title}>
    <li>
      {children && children.length ? (
        <div
          className="collapsible-header waves-effect waves-bird"
          id={`navitem-${root.frontmatter.path.replace(/\//g, "_")}`}
        >
          {level === 1 ? (
            <Link to={root.frontmatter.path}>
              {"📖" + root.frontmatter.title}
            </Link>
          ) : (
            <span>{new Array(level).join(" ") + root.frontmatter.title}</span>
          )}
        </div>
      ) : (
        <Link
          className="collapsible-header waves-effect waves-bird"
          to={root.frontmatter.path}
          activeStyle={
            currentPath === root.frontmatter.path
              ? { color: activeLinkColor }
              : {}
          }
        >
          {new Array(level).join(" ") + root.frontmatter.title}
        </Link>
      )}
      {!children || !children.length ? (
        ""
      ) : children.every(child => !child.children || !child.children.length) ? (
        <div className="collapsible-body">
          <ul>
            {children.map(child => (
              <li className="bold" key={child.root.frontmatter.title}>
                <Link
                  className="collapsible-header waves-effect waves-bird"
                  to={child.root.frontmatter.path}
                  style={
                    currentPath === child.root.frontmatter.path
                      ? { color: activeLinkColor }
                      : {}
                  }
                >
                  {new Array(level + 1).join(" ") +
                    child.root.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="collapsible-body">
          {children.map((child, i) => (
            <ul key={child.path + i}>
              <NavItem
                level={level + 1}
                root={child}
                currentPath={currentPath}
              />
            </ul>
          ))}
        </div>
      )}
    </li>
  </ul>
);

export const NavBar = ({ foldedTableOfContent, currentPath }) => (
  <ul className="sidenav" id="navbar-list">
    <NavItem root={foldedTableOfContent} currentPath={currentPath} />
  </ul>
);

export const BreadCrumb = ({ title, date, path }) => (
  <div className="navbar-fixed">
    <nav>
      <div className="nav-wrapper z-depth-3">
        <p
          className="hide-on-med-and-down right-align"
          style={{ float: "right" }}
        >
          {title} - {date} - &nbsp;
          <a
            title="edit me"
            href={`${editionPrefix}${
              path === homepageLabel ? "" : path
            }/README.md`}
            style={{ color: linkColor }}
          >
            {editMeLabel}&nbsp;
          </a>
        </p>
        <div className="col s3" style={{ marginLeft: "1em" }}>
          {path.split("/").map((element, i) => (
            <Link
              key={`breadcrumb-${element}-${i}`}
              to={
                path === homepageLabel
                  ? ""
                  : path
                      .split("/")
                      .slice(0, i + 1)
                      .join("/")
              }
              className="breadcrumb"
            >
              <span className="waves-effect waves-light">{element}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  </div>
);

export const SubSections = ({ list }) => (
  <div>
    <h3>
      <span role="img" aria-label="sub sections">
        🗂️
      </span>{" "}
      {subSectionsLabel}
    </h3>
    <div id="subSections">
      <ul>
        {list.map(link => (
          <li key={link.root.frontmatter.path}>
            <Link to={link.root.frontmatter.path}>
              {link.root.frontmatter.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
