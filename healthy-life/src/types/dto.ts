
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

export interface ReviewResponseDto {
  reviewId: number;
  pName: string;
  username: string;
  reviewRating: number;
  reviewContent: string;
  reviewImgUrl: string;
  reviewCreatAt: string; 
}

export interface ReviewRequestDto {
  reviewRating: number;
  reviewContent: string;
  reviewImgUrl: any;
}



export interface ReviewListDto {
  reviewId: number;
  pId: number;
  pName: string;
  pImgUrl: string;
  username: string;
  reviewRating: number;
  reviewContent: string;
  reviewImgUrl: string;
  reviewCreatAt: string; 
  orderDate: string;
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

