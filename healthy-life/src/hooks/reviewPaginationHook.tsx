import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReviewListDto } from '../types/dto';

interface PaginationScrollProps<T> {
  apiUrl: string; 
  limit: number; 
}

function useReviewPaginationHook<T> ({ 
  apiUrl,
  limit,
  }:PaginationScrollProps<T>) { 
  const [data, setData] = useState<ReviewListDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchData = async (page: number) => {
    if (loading) return;
    setLoading(true);
    try {
        const response = await axios.get(apiUrl, {
          params: {page, limit },
        });
        const newData = response.data.data.reviewListDto;
        if (Array.isArray(newData)) {
          setData((prevData) => {
            const allData = [...prevData, ...newData];
          const uniqueData = Array.from(
            new Map(allData.map(item => [item.reviewId, item])).values()
          );
  
          return uniqueData;
        });
        } else {
          console.error("newData가 배열이 아닙니다:", newData);
        }
        setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("데이터 요청 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

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


  return { data, loading }
    
};

export default useReviewPaginationHook;