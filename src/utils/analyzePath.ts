import { FILE_CATEGORIES } from './fileType';

export function analyzePath(path: string) {
  const normalizePath = path.trim();

  const fileExtRegex = /\.([a-z0-9]+)(?:[\?#].*)?$/i;
  const isTrailingSlash = /[/\\]$/.test(normalizePath);

  const match = normalizePath.match(fileExtRegex);

  if (!match || isTrailingSlash) {
    return {
      path: normalizePath,
      type: 'directory',
      isDirectory: true,
      isFile: false,
      extension: null,
      category: 'folder',
      label: 'Папка / Директория',
      tag: null,
      tool: 'File Explorer / Tree View',
    };
  }

  const ext = match[1].toLowerCase();

  let matchedCategory = 'unknown';
  let categoryData = {
    label: 'Неизвестный файл',
    tag: '<a download href="...">',
    tool: 'Download Link',
  };

  for (const [catName, catDetails] of Object.entries(FILE_CATEGORIES)) {
    if (catDetails.extensions.includes(ext)) {
      matchedCategory = catName;
      categoryData = catDetails;
      break;
    }
  }

  return {
    path: normalizePath,
    type: 'file',
    isDirectory: false,
    isFile: true,
    extension: ext,
    category: matchedCategory,
    label: categoryData.label,
    tag: categoryData.tag,
    tool: categoryData.tool,
  };
}
