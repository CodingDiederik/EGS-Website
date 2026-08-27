import { fetchGraphQL } from '../client';
import { PhotoDetails } from '@/lib/filebird/photos';

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

type PhotosData = {
  mediaItems: {
    nodes: PhotoData[];
  };
};

/**
 * Fetches a single photo. Never throws: an unreachable backend yields null,
 * which callers render as a missing preview instead of failing the page.
 */
export async function fetchPhoto(photoId: number | null) {
  if (!photoId) {
    return null;
  }

  const query = `
    query GetPhoto($id: ID!) {
      mediaItem(id: $id, idType: DATABASE_ID) {
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

  try {
    const data: { mediaItem: PhotoData | null } = await fetchGraphQL(
      query,
      { next: { revalidate: 600, tags: ['photo'] } },
      { id: photoId },
    );
    if (data.mediaItem) {
      return {
        id: Number(data.mediaItem.id),
        src: data.mediaItem.sourceUrl,
        alt: data.mediaItem.altText,
        title: data.mediaItem.title,
        width: data.mediaItem.mediaDetails.width,
        height: data.mediaItem.mediaDetails.height,
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch photo ${photoId}`, error);
    return null;
  }
}

export async function fetchPhotos(
  photoIds: number[] | null,
): Promise<null | PhotoDetails[]> {
  if (!photoIds || photoIds.length === 0) {
    return null;
  }

  const query = `
    query GetPhotos($ids: [ID!]!) {
      mediaItems(where: { in: $ids }) {
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

  try {
    const data: PhotosData = await fetchGraphQL(
      query,
      { next: { revalidate: 600, tags: ['photos'] } },
      { ids: photoIds },
    );

    if (data.mediaItems) {
      return data.mediaItems.nodes.map((item: PhotoData) => ({
        id: Number(item.id),
        src: item.sourceUrl,
        alt: item.altText,
        title: item.title,
        width: item.mediaDetails.width,
        height: item.mediaDetails.height,
      }));
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch photos', error);
    return null;
  }
}
