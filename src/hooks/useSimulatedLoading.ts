'use client';

import { useEffect, useState } from 'react';

/**
 * Shows skeletons for a moment whenever `key` changes, like waiting for a real API/SQL query.
 * In a real app TanStack Query's `isFetching` would drive this.
 */
export function useSimulatedLoading(key: string, ms = 550) {
  const [loadingKey, setLoadingKey] = useState<string | null>(key);
  useEffect(() => {
    setLoadingKey(key);
    const t = setTimeout(() => setLoadingKey(null), ms);
    return () => clearTimeout(t);
  }, [key, ms]);
  return loadingKey === key;
}
