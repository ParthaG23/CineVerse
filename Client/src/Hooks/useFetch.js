import { useEffect, useState, useCallback } from "react";

const useFetch = (apiCall) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    let mounted = true;

    try {
      setLoading(true);
      setError(null);

      const res = await apiCall();

      if (!mounted) return;

      const result = res?.data?.results ?? res?.data ?? res ?? [];
      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err);
    } finally {
      if (mounted) setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;