import { useState } from 'react';

export function useLoading(defaultValue = false) {
  const [loading, setLoading] = useState(defaultValue);
  const stopLoading = () => setLoading(false);
  const startLoading = () => setLoading(true);

  return {
    isLoading: loading,
    stopLoading,
    startLoading,
  };
}
