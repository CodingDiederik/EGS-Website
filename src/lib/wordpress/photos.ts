import { fetchAPI } from './articles';

export type FileBirdFolder = {
  id: number;
  title: string;
  'data-count': number;
};

export type Photo = {
  id: string;
  sourceURL: string;
  title: string;
  mediaDetails: {
    height: number;
    width: number;
  };
  altText: string;
};

type PhotoData = {
  id: string;
  sourceUrl: string;
  altText: string;
  title: string;
  mediaDetails: {
    width: number;
    height: number;
  };
};

export type PhotoDetails = {
  id: number;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
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

export async function fetchPreviewPhotoId(
  folderId: number,
): Promise<null | number> {
  try {
    const response = await fetch(
      `${process.env.WP_FILEBIRD_API_URL}/attachment-id/?folder_id=${folderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WP_FILEBIRD_API_KEY}`,
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch photo IDs for folder ${folderId}: ${response.status}`,
      );
    }

    const json = await response.json();

    if (json.data == null) {
      return null;
    }

    const ids = json.data.attachment_ids;

    if (!ids.length) {
      return null;
    }

    return ids[ids.length % 4];
  } catch (error) {
    console.error(`Failed to fetch preview for folder ${folderId}`, error);
    return null;
  }
}

export async function fetchPhoto(photoId: number | null) {
  if (!photoId) {
    return null;
  }

  const query = `
    query GetPhoto {
      mediaItem(id: ${photoId}, idType: DATABASE_ID) {
        id
        sourceUrl
        altText
        title
        mediaDetails {
          width
          height
        }
      }
    }
  `;

  const data = await fetchAPI(query);
  if (data.mediaItem) {
    return {
      id: data.mediaItem.id,
      src: data.mediaItem.sourceUrl,
      alt: data.mediaItem.altText,
      title: data.mediaItem.title,
      width: data.mediaItem.mediaDetails.width,
      height: data.mediaItem.mediaDetails.height,
    };
  }

  return null;
}

export async function fetchPhotos(
  photoIds: number[] | null,
): Promise<null | PhotoDetails[]> {
  if (!photoIds || photoIds.length === 0) {
    return null;
  }

  const query = `
    query GetPhotos {
      mediaItems(where: { in: ${JSON.stringify(photoIds)} }) {
        nodes {
          id
          sourceUrl
          altText
          title
          mediaDetails {
            width
            height
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query);

  if (data.mediaItems) {
    return data.mediaItems.nodes.map((item: PhotoData) => ({
      id: item.id,
      src: item.sourceUrl,
      alt: item.altText,
      title: item.title,
      width: item.mediaDetails.width,
      height: item.mediaDetails.height,
    }));
  }

  return null;
}

export async function fetchPhotoIds(
  folderId: number,
): Promise<null | number[]> {
  try {
    const response = await fetch(
      `${process.env.WP_FILEBIRD_API_URL}/attachment-id/?folder_id=${folderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WP_FILEBIRD_API_KEY}`,
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch photo IDs for folder ${folderId}: ${response.status}`,
      );
    }

    const json = await response.json();

    if (json.data == null) {
      return null;
    }

    const ids = json.data.attachment_ids;

    if (!ids.length) {
      return null;
    }

    return ids;
  } catch (error) {
    console.error(`Failed to fetch preview for folder ${folderId}`, error);
    return null;
  }
}

export async function getFolderTitle(folderId: number): Promise<string | null> {
  try {
    const response = await fetch(
      `${process.env.WP_FILEBIRD_API_URL}/folder/?folder_id=${folderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WP_FILEBIRD_API_KEY}`,
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch folder title for folder ${folderId}: ${response.status}`,
      );
    }

    const json = await response.json();

    if (json.data == null) {
      return null;
    }

    return json.data.folder.name;
  } catch (error) {
    console.error(`Failed to fetch folder title for folder ${folderId}`, error);
    return null;
  }
}
