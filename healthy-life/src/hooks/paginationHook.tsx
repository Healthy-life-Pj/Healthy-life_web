/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
;
import axios from 'axios';
import { ProductDetail } from '../types';

interface PaginationScrollProps<T> {
  apiUrl: string; // 기본 API URL
  limit: number; // 한 페이지의 데이터 수
  extraParams?: Record<string, string>;
}

function usePaginationScroll<T> ({ 
  apiUrl,
  limit,
  extraParams = {},
  }:PaginationScrollProps<T>) { 
  const [data, setData] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("default");

  const fetchData = async (page: number) => {
    if (loading) return;
    setLoading(true);
    try {
        const response = await axios.get(apiUrl, {
          params: {page, limit, sortBy, ...extraParams },
        });
        const newData = response.data.data;

        const sortedData = [...newData].sort((a, b) => {
          if (sortBy === "recent") {
            // 최신순
            const dateA = new Date(a.groupDate).getTime();
            const dateB = new Date(b.groupDate).getTime();
            return dateB - dateA;
          } else if (sortBy === "recommendation") {
            // 추천순
            return b.recommendationCount - a.recommendationCount;
          }else if (sortBy === "past"){
            const dateA = new Date(a.groupDate).getTime();
            const dateB = new Date(b.groupDate).getTime();
            return dateA - dateB;
          } else {
            // 기본순(groupId순)
            return a.groupId - b.groupId
          }
        });

        // 중복출력 방지
        setData((prev) => {
          const combinedData = [...prev, ...sortedData];
          const uniqueData = combinedData.filter(
            (item, index, self) => self.findIndex((i) => i.groupId === item.groupId) === index);
          return uniqueData;
        });

        setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("데이터 요청 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 스크롤을 통해 새로운 데이터 로드/정격 기준 변경
  useEffect(() => {
    setData([]);
    fetchData(currentPage);
  }, [currentPage, sortBy]);
  
  // 정렬기준 변경시 페이지 번호를 1로 초기화
  useEffect(() => {
      setData([]);
      setCurrentPage(1);
      fetchData(1);
  }, [sortBy]);

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

  // 스크롤 이벤트를 감지
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, currentPage, totalPages]);


  return { data, loading, resetAndFetchData: setSortBy }
    
};

export default usePaginationScroll;