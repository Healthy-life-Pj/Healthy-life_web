import React, { useEffect, useState } from 'react'
import '../../../style/mypage/WishApp.css'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import {
  MAIN_APT_PATH,
  WISH_LIST_PATH,
  CART_PATH,
  CART_PRODUCT,
  MY_CART,
  IMG_PATH,
  PRODUCT_IMG,
} from '../../../constants'
import { WishlistItemDto, CartItemDto } from '../../../types/dto'
import CartModal from '../../../components/CartModal'

function WishApp() {
  const [wishItems, setWishItems] = useState<WishlistItemDto[]>([])
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [cartItemData, setCartItemData] = useState<CartItemDto[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cookies] = useCookies(['token'])
  const navigate = useNavigate()

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${WISH_LIST_PATH}/me`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      )
      setWishItems(response.data.data?.wishListItems || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${CART_PATH}${MY_CART}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      )
      setCartItemData(response.data.data.cartItem || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!cookies.token) {
      navigate('/login')
      return
    }
    fetchWishlist()
  }, [])

  const handleCheck = (pid: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(pid)) {
        next.delete(pid)
      } else {
        next.add(pid)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (checkedItems.size === wishItems.length) {
      setCheckedItems(new Set())
    } else {
      setCheckedItems(new Set(wishItems.map((item) => item.pid)))
    }
  }

  const addToCartAndRemoveWish = async (pid: number) => {
    await axios.post(
      `${MAIN_APT_PATH}${CART_PATH}${CART_PRODUCT}/${pid}`,
      { productQuantity: 1 },
      {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
        withCredentials: true,
      }
    )
    await axios.delete(
      `${MAIN_APT_PATH}${WISH_LIST_PATH}/products/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
        withCredentials: true,
      }
    )
  }

  const goToCartBtnHandler = async (pid: number) => {
    try {
      await addToCartAndRemoveWish(pid)
      setWishItems((prev) => prev.filter((item) => item.pid !== pid))
      setCheckedItems((prev) => {
        const next = new Set(prev)
        next.delete(pid)
        return next
      })
      await fetchCartData()
      setIsModalOpen(true)
    } catch (error: any) {
      const msg = error.response?.data?.message || '장바구니 추가에 실패했습니다.'
      alert(msg)
      console.error(error)
    }
  }

  const goToCartSelectedHandler = async () => {
    if (checkedItems.size === 0) {
      alert('선택된 상품이 없습니다.')
      return
    }

    const pids = Array.from(checkedItems)
    const failed: number[] = []

    for (const pid of pids) {
      try {
        await addToCartAndRemoveWish(pid)
      } catch (error) {
        failed.push(pid)
        console.error(error)
      }
    }

    const successPids = pids.filter((pid) => !failed.includes(pid))
    setWishItems((prev) => prev.filter((item) => !successPids.includes(item.pid)))
    setCheckedItems(new Set(failed))

    if (failed.length > 0) {
      alert(`${successPids.length}개 상품이 장바구니에 추가되었습니다. ${failed.length}개 상품은 실패했습니다.`)
    }

    await fetchCartData()
    setIsModalOpen(true)
  }

  const deleteWishListBtnHandler = async (pid: number) => {
    try {
      await axios.delete(
        `${MAIN_APT_PATH}${WISH_LIST_PATH}/products/${pid}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      )
      setWishItems((prev) => prev.filter((item) => item.pid !== pid))
      setCheckedItems((prev) => {
        const next = new Set(prev)
        next.delete(pid)
        return next
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='whishListContainer'>
      <h2>위시리스트</h2>
      {wishItems.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>위시리스트가 비어있습니다.</p>
      ) : (
        <>
          <div className='wishListActions'>
            <label className='wishSelectAll'>
              <input
                type='checkbox'
                checked={checkedItems.size === wishItems.length}
                onChange={handleSelectAll}
              />
              전체선택 ({checkedItems.size}/{wishItems.length})
            </label>
            <button
              className='wishBulkCartBtn'
              onClick={goToCartSelectedHandler}
              disabled={checkedItems.size === 0}
            >
              선택 상품 장바구니 이동
            </button>
          </div>
          <ul className='wishList'>
            {wishItems.map((item) => (
              <li key={item.pid}>
                <input
                  type='checkbox'
                  className='wishCheckbox'
                  checked={checkedItems.has(item.pid)}
                  onChange={() => handleCheck(item.pid)}
                />
                <div className='wishImgDiv'>
                  <img
                    src={`${IMG_PATH}${PRODUCT_IMG}/${item.pimgUrl}`}
                    alt={item.pname}
                    width={100}
                    className='wishImg'
                  />
                </div>
                <div><p>금액: {item.pprice.toLocaleString()}원</p></div>
                <div className='wishListBtn'>
                  <button
                    className='wishBtn'
                    onClick={() => goToCartBtnHandler(item.pid)}
                  >
                    장바구니
                  </button>
                  <button
                    className='wishBtn'
                    onClick={() => deleteWishListBtnHandler(item.pid)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <CartModal
        cartItem={cartItemData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default WishApp