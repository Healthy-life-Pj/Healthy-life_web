import React, { useEffect, useState } from "react";
import "../../../../style/QnA.css";
import ModalExample from "./modal/ModalExample";
import axios from "axios";
import { AUTH_PATH, MAIN_APT_PATH, QNA_PATH } from "../../../../constants/api";
import { useParams } from "react-router-dom";
import { QnaResponseDto } from "../../../../types/dto";
import QnaContent from "./QnaContent";
import SmallPagination from "../../../../components/SmallPagination";

const QNA = () => {
  const { pId } = useParams();
  const [qnaData, setQnaData] = useState<QnaResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isopenCloseBtn, setIsOpenCloseBtn] = useState<boolean>(false);
  const [openQnaId, setOpenQnaId] = useState<number | null>(null);
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

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${QNA_PATH}/${pId}`,
      );
      setQnaData(response.data.data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="productQnaContainer">
      <div className="titleModalBtnDiv">
        <h5>QnA</h5>
        <ModalExample />
      </div>
      <div>
        <ul className="qnaTotalUl">
          {currentPosts.length > 0 ? (
            currentPosts.map((qna, index) => (
              <React.Fragment key={qna.qnaId}>
                <li className="qnaTotalLi" onClick={() => handleBtn(qna.qnaId)}>
                  <p>{!qna.qnaAnswer ? "답변미완료" : "답변완료"}</p>
                  <p>{qna.qnaTitle}</p>
                  <p>{qna.userNickName}</p>
                </li>
                {openQnaId === qna.qnaId && <QnaContent data={qna} />}
                {index < currentPosts.length - 1 && (
                  <div className="qnaLineDiv"></div>
                )}
              </React.Fragment>
            ))
          ) : (
            <p style={{ color: "#8f8f8f" }}>qna가 없습니다.</p>
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
};
export default QNA;
