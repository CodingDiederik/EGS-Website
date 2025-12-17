import { fetchAPI } from '@/lib/wordpress/articles';

type MediaItem = {
  id: string;
  sourceUrl: string;
  altText: string;
  title: string;
  fileBirdFolderId: number | null;
  mediaDetails: {
    width: number;
    height: number;
  };
};

type FileBirdFolder = {
  id: number;
  title: string;
  children?: FileBirdFolder[];
  files: MediaItem[];
};

// 2. Fetch all folders (using your existing REST endpoint)
async function fetchFolders(): Promise<FileBirdFolder[]> {
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

export async function fetchAllImages(): Promise<MediaItem[]> {
  const query = `
    query GetAllMedia {
      mediaItems(first: 1000) {
        nodes {
          id
          sourceUrl
          altText
          title
          fileBirdFolderId
          mediaDetails {
            width
            height
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query);
  return data.mediaItems.nodes;
}

// 4. Main Function: Combine them
export async function getMediaOrganizedByFolder() {
  try {
    const [foldersData, imagesData] = await Promise.all([
      fetchFolders(),
      fetchAllImages(),
    ]);

    const imagesByFolder = new Map<number, MediaItem[]>();
    const EXCLUDED_FOLDER_IDS = new Set([0, 4]);

    imagesData.forEach((img) => {
      const folderId = img.fileBirdFolderId ?? 0;

      if (EXCLUDED_FOLDER_IDS.has(folderId)) return;

      if (!imagesByFolder.has(folderId)) {
        imagesByFolder.set(folderId, []);
      }
      imagesByFolder.get(folderId)?.push(img);
    });

    // Helper function to recursively attach files to folders
    const attachFilesToFolders = (
      folders: FileBirdFolder[],
    ): FileBirdFolder[] => {
      // Safety check: ensure folders is an array
      if (!Array.isArray(folders)) return [];

      return folders.map((folder) => {
        const files = imagesByFolder.get(folder.id) || [];

        // Safety check: ensure children is an array before recursing
        const childrenRaw = folder.children || [];
        const children = attachFilesToFolders(childrenRaw);

        return {
          ...folder,
          files,
          children,
        };
      });
    };

    const finalTree = attachFilesToFolders(foldersData);
    const uncategorized: MediaItem[] = [];

    return {
      tree: finalTree,
      uncategorized: uncategorized,
    };
  } catch (error) {
    console.error('Error organizing FileBird data:', error);
    throw new Error('Failed to organize media by folder');
  }
}
