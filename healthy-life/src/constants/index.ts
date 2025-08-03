export const MAIN_APT_PATH = "http://localhost:4040/api/v1";

// Resource
export const USER_PATH = "/users";
export const AUTH_PATH = "/auth";
export const MAIL_PATH = "/mail";
export const PRODUCT_PATH = "/products";
export const SHIPPING_PATH = "/shipping";
export const ORDER_PATH = "/orders";
export const WISH_LIST_PATH = "/wish-list";
export const CART_PATH = "/carts";
export const PAYMENT_PATH = "/payment";
export const REVIEW_PATH = "/reviews";
export const QNA_PATH = "/qnas";

//Image
export const IMG_PATH = "http://localhost:4040/image";

// User
export const GET_USER = "/me";
export const UPDATE_USER = "/users/me";
export const UPDATE_PASSWORD = "/users/me/password";
export const UPDATE_PASSWORD_BY_EMAIL = "/users/me/password/email";

// Physique
export const USER_PHYSIQUE = "/me/physiques";
export const USER_MY_PHYSIQUE = "/me/physiques";

// Auth
export const LOGIN = "/login";
export const SIGN_UP = "/sign-up";
export const SNS_LOGIN = "/sns-login";
export const SNS_SIGN_UP = "/sns-sign-up";
export const FIND_ID = "/find-id";
export const FIND_ID_BY_TOKEN = "/find-id/verify-find-username";
export const RECOVERY_EMAIL = "/recovery-email";
export const DUPLICATE_NICKNAME = "/duplicate/userNickName/";
export const DUPLICATE_USERNAME = "/duplicate/username/";

// Product
export const ALL_PRODUCTS = "/all";
export const PRODUCT_DETAIL = "/products";
export const CATEGORY_PRODUCTS = "/category";
export const CATEGORY_DETAIL_PRODUCTS = "/category/category-detail";
export const PHYSIQUE_PRODUCTS = "/physiques";
export const PRODUCT_SEARCH = "/search";

// Order
export const ORDER_SHIPPING = "/shipping";
export const ORDER_GET_REVIEW = "/review-writable";
export const ORDER_PUT_ORDER_STATUS = "/order-status";
export const ORDER_POST_CART = "/carts";


// Shipping
export const TRACKING_INFO = "/tracking/";

// Wishlist
export const WISHLIST_PRODUCT = "/products/{pId}";
export const MY_WISHLIST = "/me";
export const COUNT_OF_WISHlIST = "/count/products/{pId}";

// Cart
export const CART_PRODUCT = "/products";
export const MY_CART = "/me";
export const CART_PRODUCT_QUANTITY = "/quantity";
export const CART_DELETE = "/cartItemIds";
export const CART_DELETE_ALL = "/all";
export const CART_CARTITEMS_LIST = "/search/cartItems";

// Review
export const ALL_REVIEWS = "/all";
export const MY_REVIEWS = "/me";
export const REVIEW_PRODUCT = "/products"
export const REVIEW_AVAILABLE = "/available";
export const REVIEW_EXISTS = "/duplication";
export const MY_REVIEW_ONE = "/get-one"
export const REVIEW_PUT = "/update"
export const REVIEW_DELETE = "/delete"

// Payment
export const KAKAO_PAYMENT = "/kakao";

//Qna 
export const QNA_POST = "/create"
export const QNA_GET_MINE = "/me"
export const QNA_UPDATE = "/update-qna"
export const QNA_DELETE = "/delete-qna"

//BMI
export const BMIAPI = "https://fitness-calculator.p.rapidapi.com/bmi"