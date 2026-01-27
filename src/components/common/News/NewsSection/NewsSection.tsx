import styles from './NewsSection.module.css';
import { fetchNewsData } from '@/lib/graphql/services/news';
import NewsList from '../NewsList/NewsList';

interface NewsSectionProps {
  count?: number;
  displayLoadMore?: boolean;
}

export default async function NewsSection({
  count,
  displayLoadMore,
}: Readonly<NewsSectionProps>) {
  const data = await fetchNewsData(count);

  return (
    <section id="news" className={styles['content-section']}>
      <NewsList
        initialPosts={data.nodes}
        initialCursor={data.pageInfo.endCursor}
        initialHasNext={data.pageInfo.hasNextPage}
        displayLoadMore={displayLoadMore}
      />
    </section>
  );
}
