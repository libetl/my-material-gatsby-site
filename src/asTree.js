const setValue = (object, path, value) => {
  let access = object;
  const parts = path.split("/").filter(e => e);
  parts.forEach(e => {
    access.children = access.children || [];
    const newChild = access.children.find(c => c.path === e) || {};
    if (access.children.indexOf(newChild) === -1)
      access.children.push(newChild);
    access = newChild;
  });
  access.path = parts.slice(-1)[0] || "/";
  access.root = value;
  return object;
};

const listFold = list =>
  list.reduce((acc, [path, data]) => setValue(acc, path, data), {});

const fold = tableOfContent =>
  listFold(
    Object.entries(
      tableOfContent
        .filter(({ node }) => node.frontmatter.path)
        .map(({ node }) => ({ [node.frontmatter.path]: node }))
        .reduce((acc, value) => Object.assign(acc, value), {})
    ).sort((a, b) => (a[0] || "").localeCompare(b[0]))
  );

const find = (foldedContent, path) =>
  !foldedContent
    ? null
    : path.replace(/^\//, "").indexOf("/") === -1
    ? foldedContent.children.find(c => c.path === path.replace(/^\//, ""))
    : find(
        foldedContent.children.find(
          c => c.path === path.replace(/^\//, "").split("/")[0]
        ),
        path
          .replace(/^\//, "")
          .split("/")
          .slice(1)
          .join("/")
      );

export { fold, find };
