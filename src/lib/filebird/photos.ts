import { FETCH_TIMEOUT_MS } from '../http';

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

export type PhotoDetails = {
  id: number;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
};

/**
 * Function to fetch folders from the FileBird API. Never throws: an
 * unreachable or misconfigured FileBird API degrades to an empty gallery so
 * prerendering the page can't fail the build.
 * @returns the list of folders, or an empty list when unavailable
 */
export async function fetchFolders(): Promise<FileBirdFolder[]> {
  try {
    if (!process.env.WP_FILEBIRD_API_URL || !process.env.WP_FILEBIRD_API_KEY) {
      throw new Error(
        'FileBird API URL or API Key is not defined in environment variables.',
      );
    }

    const baseUrl = process.env.WP_FILEBIRD_API_URL.replace(/\/$/, '');
    const endpoint = `${baseUrl}/folders`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WP_FILEBIRD_API_KEY}`,
      },
      next: { revalidate: 3000 },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch folders: ${response.status}`);
    }

    const json = await response.json();

    return json.data?.folders ?? [];
  } catch (error) {
    console.error('Failed to fetch folders', error);
    return [];
  }
}

export async function fetchPhotoIds(
  folderId: number,
): Promise<null | number[]> {
  try {
    if (!process.env.WP_FILEBIRD_API_URL || !process.env.WP_FILEBIRD_API_KEY) {
      throw new Error(
        'FileBird API URL or API Key is not defined in environment variables.',
      );
    }

    const response = await fetch(
      `${process.env.WP_FILEBIRD_API_URL}/attachment-id/&folder_id=${folderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WP_FILEBIRD_API_KEY}`,
        },
        next: { revalidate: 3000 },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
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
    console.error(`Failed to fetch photo IDs for folder ${folderId}`, error);
    return null;
  }
}

export async function getFolderTitle(folderId: number): Promise<string | null> {
  try {
    if (!process.env.WP_FILEBIRD_API_URL || !process.env.WP_FILEBIRD_API_KEY) {
      throw new Error(
        'FileBird API URL or API Key is not defined in environment variables.',
      );
    }

    const response = await fetch(
      `${process.env.WP_FILEBIRD_API_URL}/folder/&folder_id=${folderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WP_FILEBIRD_API_KEY}`,
        },
        next: { revalidate: 3000 },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
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
