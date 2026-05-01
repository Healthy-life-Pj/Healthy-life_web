import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductDetailResponseDto, ProductListResponseDto } from "../types/dto";
import { useCookies } from "react-cookie";

interface PaginationScrollProps<T> {
  apiUrl: string;
  limit: number;
  chooseSort: string;
}

function useRecommandPaginationHook<T>({
  apiUrl,
  limit,
  chooseSort,
}: PaginationScrollProps<T>) {
  const [data, setData] = useState<ProductDetailResponseDto[]>([]);
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>(chooseSort || "default");

  const fetchData = async (page: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(apiUrl, {
        params: { page, limit },

        headers: {
          Authorization: `Bearer ${cookies.token}`,
          withCredentials: true,
        },
      });

      const sortedData = (data: ProductDetailResponseDto[]) => {
        return [...data].sort((a, b) => {
          if (sortBy === "rating") return b.averageRating - a.averageRating;
          // if (sortBy === "like") return b.like - a.like;
          if (sortBy === "lower") return a.pPrice - b.pPrice;
          if (sortBy === "higher") return b.pPrice - a.pPrice;
          return b.pId - a.pId;
        });
      };

      setData(
        page === 1
          ? sortedData(response.data.data)
          : (prev) => [...prev, ...sortedData(response.data.data)]
      );
      setTotalPages(response.data.totalPages || 1);

      setTotalPages(response.data.totalPages || response.data.totalPages || 1);
    } catch (error) {
      console.error("데이터 요청 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setData([]);
    fetchData(1);
  }, [sortBy]);

  useEffect(() => {
    setData([]);
    fetchData(currentPage);
  }, [currentPage]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
      currentPage < totalPages &&
      !loading
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, currentPage, totalPages]);

  return { data, resetAndFetchData: setSortBy, loading, fetchData };
}

export default useRecommandPaginationHook;
