import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ProductDetailResponseDto } from "../types/dto";
interface PaginationScrollProps<T> {
  apiUrl01: string;
  apiUrl02: string;
  limit: number;
  extraParams?: Record<string, string>;
}

function usePaginationScroll<T>({
  apiUrl01,
  apiUrl02,
  limit,
  extraParams = {},
}: PaginationScrollProps<T>) {
  const [data, setData] = useState<ProductDetailResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("default");
  const [params, setParams] = useState(extraParams);
  const useDetailApi = params.pCategoryDetailName;
  const isFetching = useRef(false);

  const fetchData = async (page: number) => {
    if (loading || isFetching.current) return;
    setLoading(true);
    isFetching.current = true;

      try {
        let response: any;
        if (useDetailApi) {
          response = await axios.get(apiUrl02, { params: { page, limit, sortBy, ...params } });
        } else {
          response = await axios.get(apiUrl01, { params: { page, limit, sortBy, ...params } });
        }

      const sortData = (data: ProductDetailResponseDto[]) => {
        return [...data].sort((a, b) => {
          if (sortBy === "rating") return b.averageRating - a.averageRating;
          // if (sortBy === "like") return b.like - a.like;
          if (sortBy === "lower") return a.pPrice - b.pPrice;
          if (sortBy === "higher") return b.pPrice - a.pPrice;
          return b.pId - a.pId;
        });
      };

        setData(page === 1 ? sortData(response.data.data) : (prev) => [...prev, ...sortData(response.data.data)]);
      setTotalPages(response.data.totalPages || 1);

      setTotalPages(response.data.totalPages || response.data.totalPages || 1);
    } catch (error) {
      console.error("데이터 요청 중 오류:", error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setData([]);
    fetchData(1);
  }, [params, sortBy]);

  useEffect(() => {
    if (currentPage === 1) return;
    fetchData(currentPage);
  }, [currentPage]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
      currentPage < totalPages &&
      !loading &&
      !isFetching.current
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, currentPage, totalPages]);

  return {
    data,
    loading,
    resetAndFetchData: setSortBy,
    updatedParams: setParams,
  };
}

export default usePaginationScroll;
