import { test as base, expect } from '@playwright/test';

// Mock data for GraphQL responses
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
    agenda: {
      nodes: [
        {
          id: 'test-agenda-1',
          title: 'Test Agenda Item 1',
          content: '<p>Test agenda content</p>',
          date: '2026-02-01T10:00:00',
        },
      ],
    },
  },
};

const mockFoldersData = [
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
];

const mockPhotosData = {
  data: {
    mediaItems: {
      nodes: [
        {
          id: 'test-photo-1',
          sourceUrl: '/test-image-1.jpg',
          title: 'Test Photo 1',
          altText: 'Test alt text 1',
          mediaDetails: {
            height: 600,
            width: 800,
          },
        },
      ],
    },
  },
};

type TestFixtures = {
  mockAPI: void;
};

export const test = base.extend<TestFixtures>({
  mockAPI: async ({ page }, use) => {
    // Mock GraphQL endpoint
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      // Determine which query is being made based on the query string
      let responseData: Record<string, unknown> = mockNewsData;

      if (postData?.query?.includes('agenda')) {
        responseData = mockAgendaData;
      } else if (postData?.query?.includes('mediaItems')) {
        responseData = mockPhotosData;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseData),
      });
    });

    // Mock FileBird API endpoint for folders
    await page.route('**/wp-json/filebird/public/v1/folders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFoldersData),
      });
    });

    // Mock FileBird API endpoint for photos
    await page.route(
      '**/wp-json/filebird/public/v1/folders/*/images*',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
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
          }),
        });
      },
    );

    await use();
  },
});

export { expect };
