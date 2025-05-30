import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../../style/cart.css";
import { Link, useNavigate } from "react-router-dom";
import { CartItemDto } from "../../types/dto";
import axios from "axios";
import {
  AUTH_PATH,
  CART_DELETE,
  CART_DELETE_ALL,
  CART_PATH,
  CART_PRODUCT_QUANTITY,
  MAIN_APT_PATH,
  MY_CART,
  PRODUCT_PATH,
} from "../../constants";
import { useCookies } from "react-cookie";

const Cart = () => {
  const [datas, setDatas] = useState<CartItemDto[]>([]);
  const [stockMap, setStockMap] = useState<Record<number, number>>({});
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [cookies] = useCookies(["token"]);
  const navigator = useNavigate();

  const fetchCartData = async () => {
    if (!cookies.token) {
      navigator("/login");
      alert("로그인 후 사용해주세요.");
      return;
    }
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${CART_PATH}${MY_CART}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            withCredentials: true,
          },
        }
      );
      setDatas(response.data.data.cartItem || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStockMap = async (cartItems: CartItemDto[]) => {
    const newStockMap: Record<number, number> = {};
    await Promise.all(
      cartItems.map(async (item) => {
        try {
          const res = await axios.get(
            `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}/${item.pId}`
          );
          newStockMap[item.pId] = res.data.data.pStockStatus;
        } catch (error) {
          console.error(`${item.pName} 재고 조회 오류`, error);
        }
      })
    );
    setStockMap(newStockMap);
  };

  const handleQuantityChange = (cartItemId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [cartItemId]: value }));
  };

  const fetchCartDataUpdate = async (cartItemId: number) => {
    const newQuantity = quantities[cartItemId];

    try {
      await axios.put(
        `${MAIN_APT_PATH}${CART_PATH}${PRODUCT_PATH}/${cartItemId}${CART_PRODUCT_QUANTITY}`,
        { productQuantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );
      alert("수량이 수정되었습니다.");
      fetchCartData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    cartItemId: number
  ) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cartItemId)) {
        newSet.delete(cartItemId);
      } else {
        newSet.add(cartItemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (checkedItems.size === datas.length) {
      setCheckedItems(new Set());
    } else {
      const allIds = datas.map((item) => item.cartItemId);
      setCheckedItems(new Set(allIds));
    }
  };

  const handleCartDeleteAll = async () => {
    try {
      await axios.delete(
        `${MAIN_APT_PATH}${CART_PATH}${PRODUCT_PATH}${CART_DELETE_ALL}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );
      alert("장바구니 전체가 삭제되었습니다!");
      setCheckedItems(new Set());
      fetchCartData();
    } catch (error) {
      console.error(error);
    }
  };

  const handlecartDeleteSelected = async () => {
    if (checkedItems.size === 0) {
      alert("삭제할 상품을 선택해주세요!");
      return;
    }

    const cartItemIdList = Array.from(checkedItems);

    try {
      await axios.delete(`${MAIN_APT_PATH}${CART_PATH}${CART_DELETE}`, {
        data: { cartItemIds: cartItemIdList },
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
        withCredentials: true,
      });
      alert("선택한 상품이 삭제되었습니다!");
      setCheckedItems(new Set());
      fetchCartData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchCartData();
    };
    init();
  }, []);

  useEffect(() => {
    if (datas.length > 0) {
      fetchStockMap(datas);
    }
  }, [datas]);

  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    datas.forEach((item) => {
      initialQuantities[item.cartItemId] = item.productQuantity;
    });
    setQuantities(initialQuantities);
  }, [datas]);

  const totalPrice = datas
    .map((item) => item.productPrice * item.productQuantity)
    .reduce((sum, itemTotla) => sum + itemTotla, 0);

  return (
    <div className="totalCart">
      <h2>장바구니</h2>
      <div className="cartContainer">
        <div className="cartButton">
          <button onClick={handleSelectAll}>{checkedItems.size === datas.length ? "모두해제" : "모두선택"}</button>
          <button onClick={handlecartDeleteSelected}>선택삭제</button>
          <button onClick={handleCartDeleteAll}>
            전체삭제제
          </button>
        </div>
        <ul className="cartList">
          {datas.map((data) => (
            <li key={data.pId} className="cartLi">
              <input
                onChange={(e) => handleCheck(e, data.cartItemId)}
                key={data.cartItemId}
                type="checkbox"
                className="cartCheckbox"
              />
              <div className="cartImgDiv">
                <img
                  src={data.pImgUrl}
                  alt={data.pName}
                  className="cartImage"
                />
              </div>
              <p className="cartProductName">{data.pName}</p>
              <label className="cartAmountName">
                수량:
                {stockMap[data.pId] > 0 ? (
                  <>
                    <input
                      type="number"
                      name="productQuantity"
                      key={data.cartItemId}
                      value={
                        quantities[data.cartItemId] ?? data.productQuantity
                      }
                      onChange={(e) =>
                        handleQuantityChange(
                          data.cartItemId,
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                      max={stockMap[data.pId]}
                      className="productAmount"
                    />
                    <button
                      className="productAmountUpDateBtn"
                      onClick={() => fetchCartDataUpdate(data.cartItemId)}
                    >
                      수량수정
                    </button>
                  </>
                ) : (
                  <span className="soldOut">품절</span>
                )}
              </label>
              <div className="priceDivGroupBox">
                <div className="priceDivGroup">
                  <span className="priceDivGroupSpan1">금액 :</span>
                  <span className="priceDivGroupSpan2">
                    {data.productPrice.toLocaleString()} 원
                  </span>
                </div>
                <div className="priceDivGroup">
                  <span className="priceDivGroupSpan1">합계 :</span>
                  <span className="priceDivGroupSpan2">
                    {(
                      data.productPrice * data.productQuantity
                    ).toLocaleString()}{" "}
                    원
                  </span>
                </div>
              </div>
              <span className="deleteBtn">
                <CloseIcon style={{ fontSize: "12px" }} />
              </span>
            </li>
          ))}
        </ul>

        <div className="totalContainer">
          <ul className="totalContainerUl">
            <li className="totalPrice">
              <p>전체 상품 금액</p>
              <p className="wonPrice">
                <span>{totalPrice.toLocaleString()}</span> 원
              </p>
            </li>
            <li className="deliveryFee">
              <p>배송비</p>
              <p className="wonPrice">
                <span>2,000</span> 원
              </p>
            </li>
            <li className="totalPrice">
              <p>총 결제금액</p>
              <p className="wonPrice">
                <span>{(totalPrice + 2000).toLocaleString()}</span> 원
              </p>
            </li>
          </ul>
        </div>
        <div className="processBtn">
          <Link to={"/payment"}>
            <button className="processButton">결제하기</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
