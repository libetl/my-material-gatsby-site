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

const asPathHierarchy = path => Array.apply(null, {length: path.split('/').length}).map(Function.call, Number).map(separatorIndex => path.split('/').slice(0, separatorIndex + 1).join('/'))
const pathToFakeEntry = path => ({node:{frontmatter:{path: path.replace(/\/*$/, ''), title: path.replace(/\/*$/, '').split('/').slice(-1)[0], description: path.replace(/\/*$/, '').split('/').slice(-1)[0]}}})

const cheatOn = list => list.map(({node:{path}}) => pathToFakeEntry(path))
  .concat(...list.map(({node:{path}}) => asPathHierarchy(path).filter(path=>path).map(onePath => pathToFakeEntry(onePath))))

export { fold, find, cheatOn };
