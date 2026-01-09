import NewsArticle from '@/components/News/NewsComponent';

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsPage({ params }: Readonly<NewsPageProps>) {
  const { slug } = await params;

  return (
    <div>
      <NewsArticle slug={slug} />
    </div>
  );
}
