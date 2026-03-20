'use client';

import AgendaErrorContent from './AgendaErrorContent';

export default function ErrorAgenda({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AgendaErrorContent onRetry={reset} />;
}
