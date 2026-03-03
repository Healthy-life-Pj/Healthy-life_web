import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MAIN_APT_PATH,
  USER_PATH,
  SHIPPING_PATH,
  TRACKING_DETAIL,
} from '../../../constants';
import { Shipping, TrackingInfo, TrackingDetail } from '../../../types';
import '../../../style/mypage/shipping.css';

function ShippingList() {
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const [shippingList, setShippingList] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState(true);

  // 추적 모달
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(null);

  useEffect(() => {
    if (!cookies.token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    fetchShippingList();
  }, []);

  const fetchShippingList = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${USER_PATH}/me/shipping`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      if (response.data.result) {
        setShippingList(response.data.data);
      }
    } catch (error) {
      console.error('배송 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackingClick = async (shipping: Shipping) => {
    if (!shipping.shippingCarrierCode || !shipping.shippingTrackingNum) {
      alert('택배사 코드 또는 운송장번호가 없습니다.');
      return;
    }

    setSelectedShipping(shipping);
    setTrackingModalOpen(true);
    setTrackingLoading(true);

    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${SHIPPING_PATH}${TRACKING_DETAIL}`,
        {
          params: {
            carrierCode: shipping.shippingCarrierCode,
            trackingNum: shipping.shippingTrackingNum,
          },
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      if (response.data.result) {
        setTrackingInfo(response.data.data);
      } else {
        alert(response.data.message || '배송 추적 정보를 가져올 수 없습니다.');
        setTrackingModalOpen(false);
      }
    } catch (error) {
      console.error('배송 추적 실패:', error);
      alert('배송 추적 중 오류가 발생했습니다.');
      setTrackingModalOpen(false);
    } finally {
      setTrackingLoading(false);
    }
  };

  const closeTrackingModal = () => {
    setTrackingModalOpen(false);
    setTrackingInfo(null);
    setSelectedShipping(null);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '준비중';
      case 'SHIPPED': return '배송중';
      case 'DELIVERED': return '배송완료';
      case 'CANCELLED': return '취소됨';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  const getLevelText = (level: number) => {
    switch (level) {
      case 1: return '준비중';
      case 2: return '집하';
      case 3: return '배송중';
      case 4: return '지점도착';
      case 5: return '배송출발';
      case 6: return '배송완료';
      default: return '알 수 없음';
    }
  };

  const getLevelClass = (level: number) => {
    if (level >= 6) return 'level-complete';
    if (level >= 3) return 'level-transit';
    return 'level-pending';
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="shippingContainer"><p>로딩 중...</p></div>;
  }

  return (
    <div className="shippingContainer">
      <h2>배송조회</h2>

      {shippingList.length === 0 ? (
        <div className="shippingEmpty">
          <p>배송 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="shippingListBox">
          {shippingList.map((shipping) => (
            <div key={shipping.shippingId} className="shippingItem">
              <div className="shippingItemHeader">
                <span className={`shippingStatus ${getStatusClass(shipping.shippingStatus)}`}>
                  {getStatusText(shipping.shippingStatus)}
                </span>
                <span className="shippingOrderId">주문번호: {shipping.orderId}</span>
              </div>
              <div className="shippingItemBody">
                <div className="shippingInfoRow">
                  <span className="shippingLabel">택배사</span>
                  <span className="shippingValue">{shipping.shippingCarrierName || '-'}</span>
                </div>
                <div className="shippingInfoRow">
                  <span className="shippingLabel">운송장번호</span>
                  <span
                    className="shippingTrackingNum"
                    onClick={() => handleTrackingClick(shipping)}
                  >
                    {shipping.shippingTrackingNum || '-'}
                  </span>
                </div>
                <div className="shippingInfoRow">
                  <span className="shippingLabel">발송일</span>
                  <span className="shippingValue">{formatDate(shipping.shippingShippedAt)}</span>
                </div>
                <div className="shippingInfoRow">
                  <span className="shippingLabel">배송완료일</span>
                  <span className="shippingValue">{formatDate(shipping.shippingDeliveredAt)}</span>
                </div>
              </div>
              <div className="shippingItemFooter">
                <button
                  className="trackingBtn"
                  onClick={() => handleTrackingClick(shipping)}
                >
                  배송추적
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 배송 추적 모달 */}
      {trackingModalOpen && (
        <div className="trackingModalOverlay" onClick={closeTrackingModal}>
          <div className="trackingModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="trackingModalHeader">
              <h3>배송 추적</h3>
              <button className="trackingModalClose" onClick={closeTrackingModal}>X</button>
            </div>

            {trackingLoading ? (
              <div className="trackingModalLoading">
                <p>배송 정보 조회 중...</p>
              </div>
            ) : trackingInfo ? (
              <div className="trackingModalBody">
                {/* 배송 요약 */}
                <div className="trackingSummary">
                  <div className="trackingSummaryRow">
                    <span className="trackingSummaryLabel">운송장번호</span>
                    <span>{trackingInfo.invoiceNo}</span>
                  </div>
                  {trackingInfo.itemName && (
                    <div className="trackingSummaryRow">
                      <span className="trackingSummaryLabel">상품명</span>
                      <span>{trackingInfo.itemName}</span>
                    </div>
                  )}
                  {trackingInfo.senderName && (
                    <div className="trackingSummaryRow">
                      <span className="trackingSummaryLabel">보내는 분</span>
                      <span>{trackingInfo.senderName}</span>
                    </div>
                  )}
                  {trackingInfo.receiverName && (
                    <div className="trackingSummaryRow">
                      <span className="trackingSummaryLabel">받는 분</span>
                      <span>{trackingInfo.receiverName}</span>
                    </div>
                  )}
                  {trackingInfo.estimate && (
                    <div className="trackingSummaryRow">
                      <span className="trackingSummaryLabel">예상 배송일</span>
                      <span>{trackingInfo.estimate}</span>
                    </div>
                  )}
                </div>

                {/* 배송 진행 단계 */}
                <div className="trackingProgress">
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div
                      key={step}
                      className={`trackingStep ${trackingInfo.level >= step ? 'active' : ''}`}
                    >
                      <div className="trackingStepCircle">{step}</div>
                      <span className="trackingStepLabel">{getLevelText(step)}</span>
                    </div>
                  ))}
                </div>

                {/* 상세 추적 내역 */}
                <div className="trackingDetailList">
                  <h4>배송 상세 내역</h4>
                  {trackingInfo.trackingDetails && trackingInfo.trackingDetails.length > 0 ? (
                    <table className="trackingDetailTable">
                      <thead>
                        <tr>
                          <th>시간</th>
                          <th>장소</th>
                          <th>현황</th>
                          <th>담당자</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trackingInfo.trackingDetails.map((detail: TrackingDetail, index: number) => (
                          <tr key={index} className={getLevelClass(detail.level)}>
                            <td>{detail.timeString}</td>
                            <td>{detail.where}</td>
                            <td>{detail.kind}</td>
                            <td>
                              {detail.manName}
                              {detail.telno && <span className="trackingTelno"> ({detail.telno})</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="noTrackingDetail">상세 배송 내역이 없습니다.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="trackingModalLoading">
                <p>배송 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShippingList;
