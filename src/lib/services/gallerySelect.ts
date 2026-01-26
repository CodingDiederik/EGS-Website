import { FileBirdFolder } from '../filebird/photos';

/**
 * Function to remove empty folders. Does not do this for children.
 * @param folders the list of folders to clean.
 * @returns the cleaned list of folders.
 */
export function removeEmptyFolders(
  folders: FileBirdFolder[],
): FileBirdFolder[] {
  const newFolders: FileBirdFolder[] = [];

  const EXCLUDED_FOLDER_IDS = [4, 0]; // Unassigned and only news folder

  for (const folder of folders) {
    if (folder['data-count'] > 0 && !EXCLUDED_FOLDER_IDS.includes(folder.id)) {
      newFolders.push(folder);
    }
  }

  return newFolders;
}
