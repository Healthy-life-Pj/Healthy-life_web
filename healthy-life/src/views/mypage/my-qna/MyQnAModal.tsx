import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import "../../../style/ModalExample.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MAIN_APT_PATH, QNA_PATH, QNA_UPDATE } from "../../../constants/api";
import { useCookies } from "react-cookie";
import { QnaReqestDto, QnaResponseDto } from "../../../types/dto";

ReactModal.setAppElement("#root");

interface QnAModalProps {
  data : QnaResponseDto;
  isOpen: boolean;
  onClose: () => void;
  get: () => void; 
}

const MyQnAModal: React.FC<QnAModalProps> = ({data, isOpen, onClose, get}) => {
  const [qnaData, setQnaData] = useState<QnaReqestDto>({
    qnaTitle: "",
    qnaContent: "",
  });
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  const handleQnaChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQnaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const updateFetchData = async(qnaId: number) => {
    if (cookies.token) {
      const trimmedTitle = qnaData.qnaTitle.trim();
      const trimmedContent = qnaData.qnaContent.trim();
      if (
        trimmedTitle === "" ||
        trimmedContent === "" ||
        (trimmedTitle === data.qnaTitle && trimmedContent === data.qnaContent)
      ) {
        alert("변경된 내용이 없거나 빈 제목/내용은 수정할 수 없습니다.");
        return;
      }
      try {
        await axios.put(`${MAIN_APT_PATH}${QNA_PATH}${QNA_UPDATE}/${qnaId}`, {...qnaData}, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        });
        alert("QNA 수정 성공");
        onClose();
        get();
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    if (data) {
      setQnaData({
        qnaTitle: data.qnaTitle,
        qnaContent: data.qnaContent,
      });
    }
  }, [data]);
  

  return (
    <div className="modal-container">
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="modal-content"
        overlayClassName="modal-overlay"
        ariaHideApp={false}  
      >
        <div className="qnaModalTotal">
          <h2>문의 수정</h2>
          <h4>
            제목: 
            <input
              type="text"
              name="qnaTitle"
              value={qnaData?.qnaTitle}
              onChange={handleQnaChange}
            />
          </h4>
          <textarea
            placeholder="문의 내용을입력하세요."
            name="qnaContent"
            value={qnaData?.qnaContent}
            onChange={handleQnaChange}
          />
          <div className="modalBtn">
            <button className="commandModalBtn" onClick={() => updateFetchData(data.qnaId)}>
              수정
            </button>
            <button onClick={onClose} className="commandModalBtn">
              취소
            </button>
          </div>
          <div className="qnaFooter">
            <h5>상품 Q&A 작성 유의사항</h5>
            <p>
              상품 Q&A는 상품 및 상품 구매 과정(배송, 반품/취소, 교환/변경)에
              대해 판매자에게 문의하는 ​게시판입니다. 상품 및 상품 구매 과정과
              관련 없는 비방/욕설/명예훼손성 게시글 및 상품과 관련 없는 광고글
              등 부적절한 게시글 등록 시 글쓰기 제한 및 게시글이 삭제 조치 될 수
              있습니다. 전화번호, 이메일 등 개인 정보가 포함된 글 작성이 필요한
              경우 판매자만 볼 수 있도록 비밀글로 문의해 주시기 바랍니다. 상품에
              대한 이용 후기는 리뷰에 남겨 주세요.
            </p>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default MyQnAModal;
