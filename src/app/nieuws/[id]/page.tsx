import NewsArticle from '@/components/News/NewsComponent';

type NewsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewsPage({ params }: Readonly<NewsPageProps>) {
  let { id: slug } = await params;
  
  return (
    <div>
      <NewsArticle slug={slug} />
    </div>
  );
}
