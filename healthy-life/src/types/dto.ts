
export interface ProductListResponseDto {
  pId: number;
  pName: string;
  pPrice: number;
  pImgUrl: string;
  pCategoryName: string;
  pCategoryDetailName: string;
  physiqueName: string[];
  averageRating: number;
}

export interface ReviewCreateResponseDto {
  reviewId: number;
  pName: string;
  username: string;
  reviewRating: number;
  reviewContent: string;
  reviewImgUrl: string;
  reviewCreatAt: string; 
}

export interface ReviewListDto {
  reviewId: number;
  pName: string;
  username: string;
  reviewRating: number;
  reviewContent: string;
  reviewImgUrl: string;
  reviewCreatAt: string; 
}

export interface ProductDetailResponseDto {
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
  averageRating: number;
  pStockStatus: number;
}

export interface QnaReqestDto {
  qnaTitle: string;
  qnaContent: string;
}

export interface QnaResponseDto {
  qnaId: number;
  username: string;
  qnaTitle: string;
  qnaContent: string;
  qnaAnswer: string;
}

export interface CartItemDto {
  cartItemId: number;
  pId: number;
  pName: string;
  productQuantity: number;
  productPrice: number;
  pImgUrl:string;
}

export interface OrderDetailResponseDto {
  orderId: number;
  username: string;
  totalAmount: number;
  shippingRequest: string;
  orderStatus: string;
  orderDetailId: number;
  pId: number;
  pName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  orderDate: string;
  pImgUrl: string;
}

export interface OrderGetRequestDto {
  startOrderDate: string; 
  endOrderDate: string;  
}

export interface OAuthLoginResponse {
  result: boolean;
  message: string;
  data?: {
    userId: number;
    username: string;
    userNickName: string;
    userEmail: string;
    token: string;
    exprTime: number;
  };
}

// OAuth 요청 타입
export interface OAuthLoginRequest {
  email: string;
  name: string;
  snsId: string;
}

// Google 사용자 정보 타입
export interface GoogleUserInfo {
  email: string;
  name: string;
  sub: string;
  picture?: string;
}

export interface SafeUser {
  userId?: number | null;
  username?: string | null;
  name?: string | null;
  userNickName?: string | null;
  userEmail?: string | null;
  userPhone?: string | null;
  userGender?: 'M' | 'F' | null;
  userBirth?: string | null;
  userMemberGrade?: string | null;
}
