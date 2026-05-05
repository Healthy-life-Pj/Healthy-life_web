import React, { useEffect, useRef, useState } from "react";
import SmallPagination from "../../../components/SmallPagination";
import { QnaResponseDto } from "../../../types/dto";
import { useNavigate } from "react-router-dom";
import MyQnAContent from "./MyQnAContent";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  IMG_PATH,
  MAIN_APT_PATH,
  PRODUCT_IMG,
  QNA_GET_MINE,
  QNA_PATH,
} from "../../../constants";

function MyQnA() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [qnaData, setQnaData] = useState<QnaResponseDto[]>([]);
  const [openQnaId, setOpenQnaId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isopenCloseBtn, setIsOpenCloseBtn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentPosts = Array.isArray(qnaData)
    ? qnaData.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleBtn = (id: number) => {
    setIsOpenCloseBtn((prev) => !prev);
    setOpenQnaId((prevId) => (prevId === id ? null : id));
  };

  const getFetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${QNA_PATH}${QNA_GET_MINE}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        },
      );
      setQnaData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!cookies.token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    getFetchData();
  }, []);

  return (
    <div className="productQnaContainer">
      <div className="titleModalBtnDiv">
        <h2>QnA</h2>
      </div>
      <div>
        <ul className="qnaTotalUl">
          {loading ? (
              currentPosts.length ?
              <>
              {currentPosts.map((qna, index) => (
                <React.Fragment key={qna.qnaId}>
                  <li className="qnaTotalLi">
                    <div
                      className="qnaImgPDiv"
                      onClick={() =>
                        navigate(`/product/productDetail/${qna.pId}`)
                      }
                    >
                      <div className="qnaImgDiv">
                        <img
                          src={`${IMG_PATH}${PRODUCT_IMG}/${qna.pImgUrl}`}
                          alt={qna.pName}
                          className="qnaImgPDivImg"
                        />
                      </div>
                      <div className="qnaPNameDiv">
                        <p>{qna.pName}</p>
                      </div>
                    </div>
                    <div className="qnaLine"></div>
                    <div
                      className="qnaTitleDiv"
                      onClick={() => handleBtn(qna.qnaId)}
                    >
                      <p>{qna.qnaTitle}</p>
                    </div>
                    <div className="qnaLine"></div>
                    <div className="qnaIsAnswerDiv">
                      <p>{!qna.qnaAnswer ? "답변미완료" : "답변완료"}</p>
                    </div>
                  </li>
                  {index < currentPosts.length - 1 && (
                    <div className="qnaListLine"></div>
                  )}
                  {openQnaId === qna.qnaId && (
                    <MyQnAContent data={qna} fetchData={getFetchData} />
                  )}
                </React.Fragment>
              ))}
              </>
              : <p className="noneQna">QnA가 없습니다.</p>
            ) : (
            <p>로딩중....</p>
          )}
        </ul>
      </div>
      <div className="pagination">
        <SmallPagination
          productPerPage={postsPerPage}
          totalProducts={qnaData.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

export default MyQnA;
