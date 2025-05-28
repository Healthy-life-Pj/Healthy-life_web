import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/navigation/Navigation";

import Footer from "./components/Footer";
import Sidenavigation from "./components/Sidenavigation";
import Home from "./views/home/Home";
import SurveyApp from "./views/survey/SurveyApp";
import ReviewWrite from "./views/mypage/review/ReviewWrite";
import FindId from "./views/auth/login/find-id/FindId";
import FindPassword from "./views/auth/login/FindPassword";
import Review from "./views/product/productpage/review/Review";
import QNA from "./views/product/productpage/qna/QNA";
import All from "./views/product/all/All";
import AllReview from "./views/allreview/AllReview";
import SurveryListAllerge from "./views/survey/SurveryListAllerge";
import SurveryListDiabetes from "./views/survey/SurveryListDiabetes";
import SurveryListDietGoal from "./views/survey/SurveryListDietGoal";
import NonMember from "./views/nonMemberOrder/NonMember";
import Payment from "./views/payment/Payment";
import BestItem from "./views/best/bestItem";
import RecommandApp from "./views/recommand/RecommandApp";
import Bmi from "./views/bmi/Bmi";
import JoinApp from "./views/join/JoinApp";
import CartAPP from "./views/cart/CartAPP";
import MyPageMain from "./views/mypage/MyPageMain";
import Product from "./views/product/Product";
import ProductDetail from "./views/product/productpage/product/ProductDetail";
import { useCookies } from "react-cookie";
import userAuthStore from "./stores/user.store";
import { jwtDecode } from "jwt-decode";
import SignUp from "./views/auth/signUp/SignUp";
import Login from "./views/auth/login/Login";
import HeaderSearchBar from "./components/HeaderSerch";

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
      }catch (e) {
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
      <Route path='/' element={<Home />} /> 
      <Route path='/login/*' element={<Login/>}/>
      <Route path='/signUp/*' element={<SignUp/>}/>
      <Route path='/all' element={<All />}/>
        <Route path="/survey" element={<SurveyApp />} />
        <Route path="/survey/allerge" element={<SurveryListAllerge />} />
        <Route path="/survey/diabetes" element={<SurveryListDiabetes />} />
        <Route path="/survey/dietgoal" element={<SurveryListDietGoal />} />

        {/*상품*/}
        <Route path="/products/:pCategoryName/*" element={<Product />} />
        <Route path="/product/productDetail/:pId" element={<ProductDetail />} />

        {/* 마이페이지 */}
        <Route path="/mypage/*" element={<MyPageMain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/FindId" element={<FindId />} />
        <Route path="/login/FindPassword" element={<FindPassword />} />
        <Route path="/productdetail" element={<Review />} />
        <Route path="/productdetail" element={<ReviewWrite />} />
        <Route path="/productdetail" element={<QNA />} />
        <Route path="/reviews" element={<AllReview />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/nonMember" element={<NonMember />} />
        <Route path="/bestitem" element={<BestItem />} />
        <Route path="/recommand" element={<RecommandApp />} />
        <Route path="/calculator" element={<Bmi />} />
        <Route path="/join" element={<JoinApp />} />
        <Route path="/cart" element={<CartAPP />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
