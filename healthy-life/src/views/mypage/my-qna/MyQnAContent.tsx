import React, { useState } from "react";
import { QnaResponseDto } from "../../../types/dto";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { MAIN_APT_PATH, QNA_DELETE, QNA_PATH } from "../../../constants";
import MyQnAModal from "./MyQnAModal";

interface QnaContentProps {
  data: QnaResponseDto;
  fetchData: () => void;
}

const QnaContent: React.FC<QnaContentProps> = ({ data, fetchData }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedQna, setSelectedQna] = useState<QnaResponseDto | null>(null);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const deleteFetchData = async (qnaId: number) => {
    if (cookies.token) {
      try {
        await axios.delete(
          `${MAIN_APT_PATH}${QNA_PATH}${QNA_DELETE}/${qnaId}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
            withCredentials: true,
          }
        );
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className="qnaAnswerDiv" key={data.qnaId}>
        <ul className="qnaAnswerDivUl">
          <li className="qnaContentLiTitle">내용</li>
          <li>
            <div className="qnaHeightLine"></div>
          </li>
          <li className="qnaContentLi">{data.qnaContent}</li>
        </ul>
        <div className="qnaAnswerLine"></div>
        <ul className="qnaAnswerDivUl">
          {!data.qnaAnswer ? (
            <div className="qnaBtnDiv">
              <button
                className="qnaBtn"
                onClick={() => {
                  setModalIsOpen(true);
                  setSelectedQna(data);
                }}
              >
                수정
              </button>
              <button
                className="qnaBtn"
                onClick={() => deleteFetchData(data.qnaId)}
              >
                삭제
              </button>
            </div>
          ) : (
            <>
              <li className="qnaContentLiTitle">답변</li>
              <li>
                <div className="qnaHeightLine"></div>
              </li>
              <li className="qnaAnswerLi qnaContentLi">{data.qnaAnswer}</li>
            </>
          )}
        </ul>
        {modalIsOpen && selectedQna && (
          <MyQnAModal
            data={selectedQna}
            isOpen={modalIsOpen}
            onClose={() => {
              setModalIsOpen(false);
              setSelectedQna(null);
            }}
            get={fetchData}
          />
        )}
      </div>
    </div>
  );
};

export default QnaContent;
