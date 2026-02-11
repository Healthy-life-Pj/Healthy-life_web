import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/navigation/Navigation";

import Footer from "./components/Footer";
import Sidenavigation from "./components/Sidenavigation";
import Home from "./views/home/Home";
import SurveyApp from "./views/survey/SurveyApp";
import FindId from "./views/auth/login/find-id/FindId";
import FindPassword from "./views/auth/login/FindPassword";
import All from "./views/product/all/All";
import SurveryListAllerge from "./views/survey/SurveryListAllerge";
import SurveryListDiabetes from "./views/survey/SurveryListDiabetes";
import SurveryListDietGoal from "./views/survey/SurveryListDietGoal";
import NonMember from "./views/nonMemberOrder/NonMember";
import Payment from "./views/order/direct-order/DirectOrder";
import BestItem from "./views/best/bestItem";
import RecommandApp from "./views/physique/PhysiqueProduct";
import Bmi from "./views/bmi/Bmi";
import CartAPP from "./views/cart/Cart";
import MyPageMain from "./views/mypage/MyPageMain";
import Product from "./views/product/Product";
import ProductDetail from "./views/product/productpage/product/ProductDetail";
import { useCookies } from "react-cookie";
import userAuthStore from "./stores/user.store";
import { jwtDecode } from "jwt-decode";
import SignUp from "./views/auth/signUp/SignUp";
import Login from "./views/auth/login/Login";
import HeaderSearchBar from "./components/HeaderSerch";
import FindUserIdResult from "./views/auth/login/find-id/FindIdResult";
import AllReviewList from "./views/allreview/AllReviewList";
import Order from "./views/order/direct-order/DirectOrder";
import DirectOrder from "./views/order/direct-order/DirectOrder";
import CartOrder from "./views/order/cart-order/CartOrder";
import AuthRedirectHandler from "./views/auth/signUp/AuthRedirectHandler";
import SnsSuccess from "./views/auth/login/SnsSuccess";

function App() {
  interface TokenUser {
    username: string;
  }

  const [cookies] = useCookies(["token"]);
  const { login, logout } = userAuthStore();

  useEffect(() => {
    if (cookies.token) {
      try {
        const decodedToken: TokenUser = jwtDecode<TokenUser>(cookies.token);
        login(decodedToken.username);
      } catch (e) {
        console.error("Invalid Token", e);
        logout();
      }
    } else {
      logout();
    }
  }, [cookies.token, login, logout]);

  return (
    <>
      <Sidenavigation />
      <Header />
      <HeaderSearchBar />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/login/find-id" element={<FindId />} />
        <Route
          path="/find-id/verify-find-username"
          element={<FindUserIdResult />}
        />
        <Route path="/signUp/*" element={<SignUp />} />
        <Route path="/all" element={<All />} />
        <Route path="/survey" element={<SurveyApp />} />
        <Route path="/survey/allerge" element={<SurveryListAllerge />} />
        <Route path="/survey/diabetes" element={<SurveryListDiabetes />} />
        <Route path="/survey/dietgoal" element={<SurveryListDietGoal />} />
        <Route path={"/sns-success"} element={<AuthRedirectHandler />} />


        {/*상품*/}
        <Route path="/products/:pCategoryName/*" element={<Product />} />
        <Route path="/product/productDetail/:pId" element={<ProductDetail />} />

        {/*주문*/}
        <Route path="/order/:pId/:quantity" element={<DirectOrder/>}/>
        <Route path="/cart/order" element={<CartOrder/>}/>

        {/* 전체 리뷰 */}
        <Route path="/reviews" element={<AllReviewList />} />

        {/* 마이페이지 */}
        <Route path="/mypage/*" element={<MyPageMain />} />
        <Route path="/login/FindPassword" element={<FindPassword />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/nonMember" element={<NonMember />} />
        <Route path="/bestitem" element={<BestItem />} />
        <Route path="/recommand" element={<RecommandApp />} />
        <Route path="/calculator" element={<Bmi />} />
        <Route path="/cart" element={<CartAPP />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
