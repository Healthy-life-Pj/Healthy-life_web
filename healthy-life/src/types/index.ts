// Users Interface
export interface User {
  userId: number;
  username: string;
  userNickName: string;
  password: string;
  confirmPassword: string;
  name: string;
  userEmail: string;
  userPhone: string;
  userBirth: Date;
  userGender: UserGender;
  userMemberGrade: UserMemberGrade
  snsId: string | null;
  joinPath: string;
}

export type UserGender = 'M' | 'F';
export type UserMemberGrade = '병아리' | '오골계' | '닭' | '독수리';

// Products Interface
export interface Product {
  pId: number;
  pName: string;
  pPrice: number;
  pDescription: string;
  pIngredients: string;
  pNutritionInfo: string;
  pOrigin: string;
  pUsage: string;
  pExpirationDate: Date;
  pManufacturer: string;
  pImgUrl: string;
  pStockStatus: number;
}

// Product Category Interface
export interface ProductCategory {
  categoryId: number;
  categoryName: string;
}

// Product Category Details Interface
export interface ProductCategoryDetail {
  categoryDetailId: number;
  categoryId: number;
  pId: number;
  categoryDetailName: string;
}

// 체질 태그 타입
export type PhysiqueTags =
  | '저당'
  | '저탄수'
  | '고단백'
  | '저지방'
  | '저염'
  | '비건'
  | '채식'
  | '무카페인'
  | '다이어트'
  | '벌크업'
  | '체중유지'
  | '식단관리'
  | '견과류 제외'
  | '해산물 제외'
  | '유제품 제외'
  | '글루텐 제외'
  | '계란 제외'
  | '간편식'
  | '식사대용'
  | '운동후식사'
  | '저칼로리'
  | '포만감';

  export type TagType = 
  |"INCLUDE"
  |"EXCLUDE";

export type CategoryType = 
  | "닭가슴살_육류"
  | "도시락"
  | "간식"
  | "음료"
  | "샐러드"
  | "비건"
  | "저당"
  | "해산물"
  | "견과류";

export type categoryDetails =
  | "닭가슴살"
  | "달걀"
  | "소고기"
  | "볶음밥"
  | "주먹밥"
  | "즉석밥"
  | "에너지바"
  | "과자"
  | "베이커리"
  | "물"
  | "탄산수"
  | "프로틴음료"
  | "커피"
  | "차"
  | "제로음료"
  | "닭가슴살샐러드"
  | "연어샐러드"
  | "큐브스테이크샐러드"
  | "간식"
  | "간편식"
  | "식재료"
  | "저당간식"
  | "저당음료"
  | "저당드레싱"
  | "생선선"
  | "해조류"
  | "어패류"
  | "견과류";

// Cart Interface
export interface Cart {
  cartId: number;
  userId: number;
}

// Cart Item Interface
export interface CartItem {
  cartItemId: number;
  cartId: number;
  productId: number;
  productQuantity: number;
  productPrice: number;
}

// Wish List Interface
export interface WishList {
  wishListId: number;
  userId: number;
}

// Wish List Item Interface
export interface WishListItem {
  wishListItemId: number;
  wishListId: number;
  productId: number;
  wishListAddedAt: Date;
}

// Order Interface
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUEST'
  | 'RETURN_IN_PROGRESS'
  | 'RETURNED'
  | 'EXCHANGE_REQUEST'
  | 'EXCHANGE_IN_PROGRESS'
  | 'EXCHANGED';

export interface Order {
  orderId: number;
  userId: number;
  cartId?: number;
  orderDate: Date;
  orderRecipientName: string;
  orderRecipientPhone: string;
  orderTotalAmount: number;
  orderShippingCost: number;
  orderShippingRequest: string;
  shippingCost: 3000;
}

// Order Detail Interface
export interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  orderStatus: OrderStatus;
  totalPrice: number;
}

// Shipping Interface
export type ShippingStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Shipping {
  shippingId: number;
  orderId: number;
  shippingTrackingNum: string;
  shippingCarrierCode: string;
  shippingCarrierName: string;
  shippingShippedAt: Date;
  shippingDeliveredAt: Date;
  shippingStatus: ShippingStatus;
}

export interface TrackingDetail {
  timeString: string;
  where: string;
  kind: string;
  level: number;
  manName: string;
  telno: string;
  telno2: string;
  remark: string;
  code: string;
}

export interface TrackingInfo {
  invoiceNo: string;
  itemName: string;
  receiverName: string;
  receiverAddr: string;
  senderName: string;
  adUrl: string;
  complete: boolean;
  level: number;
  estimate: string;
  result: string;
  trackingDetails: TrackingDetail[];
}

// Payment Interface
export type PaymentMethod = 'CREDIT_CARD' | 'POINT';
export type PaymentStatus = 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  paymentId: number;
  orderId: number;
  userId: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate: Date;
}

// Review Interface
export interface Review {
  reviewId: number;
  userId: number;
  orderDetailId: number;
  reviewRating: number;
  reviewContent: string;
  reviewCreatedAt: Date;
  reviewImageUrl?: string;
}

// QnA Interface
export interface QnA {
  qnaId: number;
  userId: number;
  qnaTitle: string;
  qnaContent: string;
}

// Physique Tag Interface
export interface PhysiqueTag {
  physiqueTagId: number;
  productId?: number;
  physiqueTagName: string;
}

// User Physique Tag Interface
export interface UserPhysiqueTag {
  physiqueTagId: number;
  userId: number;
}

// Delivery Address Interface
export interface DeliveryAddress {
  deliverAddressId: number;
  userId: number;
  address: string;
  addressDetail: string;
  postNum: number;
  default: boolean;
}

export interface LoginInResponseDto {
  token: string;
  user: User;
  exprTime: number;
}


//----------잠시만 지우지 말기--------------------------------
export type InFormData = {
  userId: number; // 고유넘버
  username: string; // 사용자 아이디
  userNickName: string;
  userPassword: string;
  userRePassword: string; //비번번 확인인
  name: string; // 이름름
  userEmail: string;
  userPhone: string;
  userBirth: string;
  userAddress: string;
  userGender: string;
  totalPayment: number; // 멤버십등급기준 금액 (이거도 복합키 사용을 해야하나??)
  memberGrade: string;
  //(누적 구매액수에 따라 결정)
  point: number //포인트
}

export type memberGrade =  "병아리" | "닭" | "오골계" | "독수리"

export type userGender = "Male" | "Female";

// 상품 유형 타입 정의
export type ProductType =
  | "닭가슴살"
  | "달걀"
  | "소고기"
  | "볶음밥"
  | "주먹밥"
  | "즉석밥"
  | "에너지바"
  | "과자"
  | "베이커리"
  | "물"
  | "탄산수"
  | "프로틴음료"
  | "커피"
  | "차"
  | "제로음료"
  | "닭가슴살샐러드"
  | "연어샐러드"
  | "큐브스테이크샐러드"
  | "간식"
  | "간편식"
  | "식재료"
  | "저당간식"
  | "저당음료"
  | "저당드레싱"
  | "생성"
  | "해조류"
  | "어패류"
  | "견과류";

  export type surveyType = 
  | "비건"
  | "육류"
  | "해산물"
  | "견과류"
  | "어패류"
  | "저당"
  | "근육"
  | "체중감소"
  | "유제품품"
  | "체중증가";

  // ProductDetail
export interface ProductDetail {
  productId: number; // 상품 ID
  productName: string; // 상품명
  category: CategoryType; // 카테고리
  productType: ProductType; // 상품 유형
  price: number; // 가격
  stockStatus: number; // 재고 상태
  imageUrl: string; // 상품 이미지
  description: string; // 상품 설명
  ingredients: string; // 성분 정보
  nutritionInfo: string; // 영양 성분표
  manufacturer: string; // 제조사 정보
  origin: string; // 원산지
  usage: string; // 사용 방법
  expirationDate: String; // 유통기한
  surveyType: surveyType; //설문지 카테고리 타입
  recommendCount: number; //찜 수량
}

//찜 기능 (복합키 사용을 해야하나?)
export interface Recommendation {
  recommendationId: number;
  productId: number;
  userId: number
}

export interface Review {
  reviewId: number; // 리뷰 ID
  productId: number; // 상품 ID
  userId: number // 사용자 고유넘버
  username: string; // 사용자 ID
  rating: number; // 평점
  reviewContent: string; // 리뷰 내용
  reviewDate: Date; // 리뷰 작성일
}

export interface ShippingInfo {
  shippingId: number; // 배송 ID
  productId: string; // 상품 ID
  orderId: string; // 주문 ID
  cost: number; // 배송 비용
  shippedDate: Date; // 배송 날짜
  duration: string; // 배송 소요 시간
  deliveryDate: Date; // 예상 배송 날짜
}

export interface Order {
  orderId : number;
  productId: number;
  userId: number // 사용자 고유넘버
  username: string;
  orderDate: Date; //주문날짜
  totalAmount: number; // 총 주문 금액
  orderStatus: OrderStatus; // 주문상태 주문완료, 주문취소
} 

export interface OrderPayMent {
  paymentId:number;// 주문결제Id
  orderId: number; // 주문Id
  userId: number; // 사용자Id
  username: string; 
  paymentMethod: paymentMethodType; //결제방법 
  paymentStatus: paymentStatusType; //결제상태
  paymentData: Date; // 결제날짜
  pointUser: number; // 포인트
  totalPayment: number; // 총 금액
}

export type paymentMethodType = 
| "CreditCard" //카드 결제
| "Points"; // 포인트트

export type paymentStatusType = 
| "Completed" 
| "Failed" 
| "Refunded";


export interface serveyResultList {
  serveyId: number;
  userId: number;
  serveyTypeId: number;
} 

export interface serveyType {
  serveyTypeId: number;
  serveyTypeName: string;
}

export interface Cart {
  cartId: number; // 카트 Id
  userId: number; // 사용자 Id
  productId: number; // 상품 Id
  productQuantity: number; // 상품수량
  productPrice: number; // 상품금액
}

export interface Wishlist {
  wishlistId: number; // 위시리스트 ID
  userId: string; // 사용자 ID
  productId: string; // 상품 ID
  addedAt: string; // 위시리스트에 추가된 시간
}

export interface QNA {
  qnaId: number;
  userId: number;
  username: string;
  qnaTitle: string;
  qnaContent: string;
  qnaDate: Date;
}


// --------------- dto
export interface UserLogin {
  userId: string; // 이메일 주소 또는 사용자 ID
  password: string; // 비밀번호
}
export interface FindUserId {
  username: string; // 사용자명
  phone: string; // 전화번호
}

export interface ResetPassword {
  userId: string; // 사용자 ID
  phone: string; // 전화번호
}

export interface PasswordResetToken {
  tokenId: string; // 토큰 ID
  email: string; // 이메일 주소
  token: string; // 재설정 토큰
  expiresAt: string; // 토큰 유효 기간
}