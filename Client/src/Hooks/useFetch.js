import { useEffect, useState } from "react";

const useFetch = (apiCall) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiCall();
        setData(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiCall]);

  return { data, loading };
};

export default useFetch;
