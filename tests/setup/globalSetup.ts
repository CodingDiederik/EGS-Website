import http from 'http';

const mockNewsData = {
  data: {
    posts: {
      pageInfo: {
        endCursor: 'mock-cursor',
        hasNextPage: false,
      },
      nodes: [
        {
          id: 'test-news-1',
          databaseId: 1,
          title: 'Test News Article 1',
          content: '<p>This is test news content 1</p>',
          date: '2026-01-15T10:00:00',
          slug: 'test-news-1',
          author: {
            node: {
              firstName: 'Test Author',
            },
          },
        },
        {
          id: 'test-news-2',
          databaseId: 2,
          title: 'Test News Article 2',
          content: '<p>This is test news content 2</p>',
          date: '2026-01-20T10:00:00',
          slug: 'test-news-2',
          author: {
            node: {
              firstName: 'Test Author',
            },
          },
        },
      ],
    },
  },
};

const mockAgendaData = {
  data: {
    posts: {
      pageInfo: {
        endCursor: 'mock-cursor',
        hasNextPage: false,
      },
      nodes: [
        {
          id: 'test-agenda-1',
          databaseId: 3,
          title: 'Test Agenda Item 1',
          content: '<p>Test agenda content</p>',
          date: '2026-02-01T10:00:00',
          slug: 'test-agenda-1',
          author: {
            node: {
              firstName: 'Test Agenda Author',
            },
          },
        },
      ],
    },
  },
};

const mockFoldersData = {
  data: {
    folders: [
      {
        id: 1,
        title: 'Test Folder 1',
        'data-count': 10,
      },
      {
        id: 2,
        title: 'Test Folder 2',
        'data-count': 5,
      },
    ],
  },
};

const mockPhotosData = {
  images: [
    {
      id: 1,
      src: '/test-image-1.jpg',
      alt: 'Test alt text',
      title: 'Test Image 1',
      width: 800,
      height: 600,
    },
  ],
  totalPages: 1,
};

let server: http.Server | null = null;

async function globalSetup() {
  return new Promise<void>((resolve) => {
    server = http.createServer((req, res) => {
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      const url = req.url || '';

      // GraphQL endpoint
      if (url === '/graphql' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const postData = JSON.parse(body);
          let responseData = mockNewsData;

          if (postData?.query?.includes('agenda')) {
            responseData = mockAgendaData;
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(responseData));
        });
        return;
      }
      // FileBird photos endpoint (must check before folders since it contains /folders/)
      else if (url.includes('/folders/') && url.includes('/images')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockPhotosData));
        return;
      }
      // FileBird folders endpoint - matches /wp-json/filebird/public/v1/folders
      else if (
        url.includes('/wp-json/filebird/public/v1/folders') &&
        !url.includes('/images')
      ) {
        console.log('Mock server: Serving folders data');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockFoldersData));
        return;
      }
      // FileBird attachment-id endpoint
      else if (url.includes('/wp-json/filebird/public/v1/attachment-id')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: { attachment_ids: [1, 2, 3] } }));
        return;
      }

      console.log('Mock server: Unhandled request:', req.method, url);
      res.writeHead(404);
      res.end('Not Found');
    });

    server.listen(8080, () => {
      console.log('Mock server running on http://localhost:8080');
      resolve();
    });
  });
}

export default globalSetup;
