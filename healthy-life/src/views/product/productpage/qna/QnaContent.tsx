import React, { useState } from "react";
import { QnaResponseDto } from "../../../../types/dto";

interface QnaContentProps {
  data: QnaResponseDto;
}

const QnaContent: React.FC<QnaContentProps> = ({ data }: QnaContentProps) => {
  return (
    <div>
      <div className="qnaAnswerDiv" key={data.qnaId}>
        <ul className="qnaAnswerDivUl">
          <li>내용</li>
          <li className="qnaContentLi">{data.qnaContent}</li>
        </ul>
        <div className="qnaAnswerLine"></div>
        <ul className="qnaAnswerDivUl">
          <li>답변</li>
          <li className="qnaAnswerLi">{data.qnaAnswer}</li>
        </ul>
      </div>
    </div>
  );
};

export default QnaContent;
