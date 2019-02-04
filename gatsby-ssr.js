import React from "react";
import { withPrefix } from "gatsby";

function inlinedScript(document, M, Waves) {
  (() => {
    const _wr = function(type) {
      const orig = history[type];
      return function() {
        const rv = orig.apply(this, arguments);
        const e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
      };
    };
    history.pushState = _wr("pushState");
    history.replaceState = _wr("replaceState");
  })();

  const gatsbyIsLoaded = function gatsbyIsLoaded() {
    if (!document.getElementById("___gatsby").childNodes.length) return;

    if (!document.querySelector("#searchIcon"))
      return new MutationObserver(gatsbyIsLoaded).observe(
        document.getElementById("___gatsby").firstChild,
        { childList: true }
      );

    const elems = document.querySelectorAll(".sidenav");
    const instances = M.Sidenav.init(elems);

    const elems1 = document.querySelectorAll(".collapsible");
    const instances1 = M.Collapsible.init(elems1);

    document.querySelector("#searchIcon").addEventListener("click", function() {
      document.querySelector("#search").focus();
    });
    const sitePath = window.location.pathname
      .replace("${prefix}", "")
      .replace(/\/*$/, "/");
    Array.apply(null, { length: sitePath.match(/\//g).length })
      .map(
        (_, i) =>
          "navitem-" +
          (sitePath
            .split("/")
            .slice(0, i + 1)
            .join("_") || "_")
      )
      .forEach(item => {
        const divToUpdate = document.querySelector("#" + item + " + .collapsible-body") || {
          style: {},
          parentNode: {className: ''}
        };
        divToUpdate.style.display = "block";
        divToUpdate.parentNode.className += ' active';
      });

    Waves.displayEffect();
  };

  document.addEventListener("DOMContentLoaded", gatsbyIsLoaded);
  window.addEventListener(
    "pushState",
    () =>
      Array.from(document.querySelectorAll(".sidenav-overlay")).map(e =>
        e.remove()
      ) |
      Array.from(document.querySelectorAll(".drag-target")).map(e =>
        e.remove()
      ) |
      setTimeout(gatsbyIsLoaded, 200)
  );
  window.addEventListener(
    "replaceState",
    () =>
      Array.from(document.querySelectorAll(".sidenav-overlay")).map(e =>
        e.remove()
      ) |
      Array.from(document.querySelectorAll(".drag-target")).map(e =>
        e.remove()
      ) |
      setTimeout(gatsbyIsLoaded, 200)
  );
  window.addEventListener(
    "popState",
    () =>
      Array.from(document.querySelectorAll(".sidenav-overlay")).map(e =>
        e.remove()
      ) |
      Array.from(document.querySelectorAll(".drag-target")).map(e =>
        e.remove()
      ) |
      setTimeout(gatsbyIsLoaded, 200)
  );

  new MutationObserver(gatsbyIsLoaded).observe(
    document.getElementById("___gatsby"),
    { childList: true }
  );
}

export const onPreRenderHTML = ({
  getPostBodyComponents,
  replacePostBodyComponents
}) => {
  const prefix = withPrefix("")
    .split("")
    .slice(0, -1)
    .join("");
  replacePostBodyComponents(
    getPostBodyComponents().concat(
      <script
        key="inlinedScript"
        defer={true}
        dangerouslySetInnerHTML={{
          __html: inlinedScript
            .toString()
            .match(/function[^{]+\{([\s\S]*)\}$/)[1]
            .replace(/"\${prefix}"/, `'${prefix}'`)
        }}
      />
    )
  );
};
