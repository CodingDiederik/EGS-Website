type FileBirdFolder = {
  id: number;
  title: string;
  'data-count': number;
};

/**
 * Function to fetch folders from the FileBird API.
 * @returns the list of folders
 */
export async function fetchFolders(): Promise<FileBirdFolder[]> {
  const baseUrl = process.env.WP_FILEBIRD_API_URL?.replace(/\/$/, '');
  const endpoint = `${baseUrl}/folders`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WP_FILEBIRD_API_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch folders: ${response.status}`);
  }

  const json = await response.json();

  return json.data.folders;
}

/**
 * Function to remove empty folders. Does not do this for children.
 * @param folders the list of folders to clean.
 * @returns the cleaned list of folders.
 */
export function removeEmptyFolders(
  folders: FileBirdFolder[],
): FileBirdFolder[] {
  const newFolders: FileBirdFolder[] = [];

  for (const folder of folders) {
    if (folder['data-count'] > 0 && folder.id !== 4 && folder.id !== 0) {
      newFolders.push(folder);
    }
  }

  return newFolders;
}
