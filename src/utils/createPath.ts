export const createPath = ({
  parentPath,
  name,
}: {
  parentPath: string;
  name: string;
}) => {
  let path;

  if (parentPath.endsWith('/')) {
    path = `${parentPath}${name}`;
  } else {
    path = `${parentPath}/${name}`;
  }

  return path;
};
