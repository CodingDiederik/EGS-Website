import { getMediaOrganizedByFolder } from '@/lib/wordpress/photos';
import Image from 'next/image';

export default async function GalleryPage() {
  const { tree } = await getMediaOrganizedByFolder();

  return (
    <div>
      {tree.map((folder) => (
        <div key={folder.id} className="mb-8">
          <h2 className="text-xl font-bold">{folder.title}</h2>

          <div className="grid grid-cols-3 gap-4">
            {folder.files.map((file) => (
              <Image
                key={file.id}
                src={file.sourceUrl}
                alt={file.altText}
                className="w-full h-auto"
                width={file.mediaDetails.width}
                height={file.mediaDetails.height}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
