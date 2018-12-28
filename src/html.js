import React from "react";
import PropTypes from "prop-types";
import { withPrefix } from "gatsby";
import { title } from "../customize/variables";

const HTML = ({ headComponents, body, postBodyComponents }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no"
        />
        <title>{title}</title>
        {headComponents}
      </head>
      <body>
        <noscript>
          Please enable javascript to browse this documentation
        </noscript>
        <div id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
      </body>
      {postBodyComponents}
    </html>
  );
};

HTML.displayName = "HTML";
HTML.propTypes = {
  headComponents: PropTypes.node.isRequired,
  postBodyComponents: PropTypes.node.isRequired,
  body: PropTypes.string
};
HTML.defaultProps = {
  body: ""
};

export default HTML;
