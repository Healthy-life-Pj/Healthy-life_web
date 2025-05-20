import React, { useState } from 'react';
import '../../../style/home/productList.css'
import Pagination from './Pagination';
import SnackProductsLayout from './SnackProductsLayout';


export interface snackProduct{
  id: number;
  name: string;
  image: string;
}



export const snackProducts: snackProduct[] = [
  {id: 1, name: 'product1', image: 'https://cdn.pixabay.com/photo/2017/02/15/10/39/salad-2068217_1280.jpg'},
  {id: 2, name: 'product2', image: 'https://cdn.pixabay.com/photo/2015/05/20/18/35/salad-775949_1280.jpg'},
  {id: 3, name: 'product3', image: 'https://cdn.pixabay.com/photo/2022/06/07/20/58/salad-7249259_1280.jpg'},
  {id: 4, name: 'product4', image: 'https://cdn.pixabay.com/photo/2022/06/07/20/58/salad-7249259_1280.jpg'},
  {id: 5, name: 'product5', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 6, name: 'product6', image: 'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_640.jpg'},
  {id: 7, name: 'product7', image: 'https://cdn.pixabay.com/photo/2015/01/03/18/19/salad-587669_640.jpg'},
  {id: 8, name: 'product8', image: 'https://cdn.pixabay.com/photo/2017/02/15/10/39/salad-2068217_1280.jpg'},
  {id: 9, name: 'product9', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 10, name: 'product10', image: 'https://cdn.pixabay.com/photo/2015/01/03/18/19/salad-587669_640.jpg'},
  {id: 11, name: 'product11', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 12, name: 'product12', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 13, name: 'product13', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 14, name: 'product14', image: 'https://cdn.pixabay.com/photo/2023/09/25/07/55/salad-8274421_640.jpg'},
  {id: 15, name: 'product15', image: 'https://cdn.pixabay.com/photo/2019/12/11/16/20/parsley-4688651_640.jpg'},
  {id: 16, name: 'product16', image: 'https://cdn.pixabay.com/photo/2023/07/26/16/43/food-8151625_640.jpg'},
  {id: 17, name: 'product17', image: 'https://cdn.pixabay.com/photo/2021/10/13/16/08/vegan-salad-6707015_640.jpg'},
  {id: 18, name: 'product18', image: 'https://cdn.pixabay.com/photo/2016/08/28/10/49/takeaway-1625652_1280.jpg'},
  {id: 19, name: 'product19', image: 'https://cdn.pixabay.com/photo/2017/02/15/10/39/salad-2068217_1280.jpg'},
  {id: 20, name: 'product20', image: 'https://cdn.pixabay.com/photo/2015/05/20/18/35/salad-775949_1280.jpg'},
  {id: 21, name: 'product21', image: 'https://cdn.pixabay.com/photo/2022/06/07/20/58/salad-7249259_1280.jpg'},
  {id: 22, name: 'product22', image: 'https://cdn.pixabay.com/photo/2022/06/07/20/58/salad-7249259_1280.jpg'},
  {id: 23, name: 'product23', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 24, name: 'product24', image: 'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_640.jpg'},
  {id: 25, name: 'product25', image: 'https://cdn.pixabay.com/photo/2015/01/03/18/19/salad-587669_640.jpg'},
  {id: 26, name: 'product26', image: 'https://cdn.pixabay.com/photo/2017/02/15/10/39/salad-2068217_1280.jpg'},
  {id: 27, name: 'product27', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 28, name: 'product28', image: 'https://cdn.pixabay.com/photo/2015/01/03/18/19/salad-587669_640.jpg'},
  {id: 29, name: 'product29', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 30, name: 'product30', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 31, name: 'product31', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 32, name: 'product32', image: 'https://cdn.pixabay.com/photo/2023/09/25/07/55/salad-8274421_640.jpg'},
  {id: 33, name: 'product33', image: 'https://cdn.pixabay.com/photo/2019/12/11/16/20/parsley-4688651_640.jpg'},
  {id: 34, name: 'product34', image: 'https://cdn.pixabay.com/photo/2023/07/26/16/43/food-8151625_640.jpg'},
  {id: 35, name: 'product35', image: 'https://cdn.pixabay.com/photo/2021/10/13/16/08/vegan-salad-6707015_640.jpg'},
  {id: 36, name: 'product36', image: 'https://cdn.pixabay.com/photo/2016/08/28/10/49/takeaway-1625652_1280.jpg'},
  {id: 37, name: 'product37', image: 'https://cdn.pixabay.com/photo/2017/02/15/10/39/salad-2068217_1280.jpg'},
  {id: 38, name: 'product38', image: 'https://cdn.pixabay.com/photo/2015/05/20/18/35/salad-775949_1280.jpg'},
  {id: 39, name: 'product39', image: 'https://cdn.pixabay.com/photo/2022/06/07/20/58/salad-7249259_1280.jpg'},
  {id: 40, name: 'product40', image: 'https://cdn.pixabay.com/photo/2022/06/07/20/58/salad-7249259_1280.jpg'},
  {id: 41, name: 'product41', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 42, name: 'product42', image: 'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_640.jpg'},
  {id: 43, name: 'product43', image: 'https://cdn.pixabay.com/photo/2015/01/03/18/19/salad-587669_640.jpg'},
  {id: 44, name: 'product44', image: 'https://cdn.pixabay.com/photo/2017/02/15/10/39/salad-2068217_1280.jpg'},
  {id: 45, name: 'product45', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 46, name: 'product46', image: 'https://cdn.pixabay.com/photo/2015/01/03/18/19/salad-587669_640.jpg'},
  {id: 47, name: 'product47', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 48, name: 'product48', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 49, name: 'product49', image: 'https://cdn.pixabay.com/photo/2018/06/19/10/16/lollo-rosso-3484159_640.jpg'},
  {id: 50, name: 'product50', image: 'https://cdn.pixabay.com/photo/2023/09/25/07/55/salad-8274421_640.jpg'},
]


const Snack: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [snackPerPage] = useState<number>(16);

  const indexOfLastPost = currentPage * snackPerPage;
  const indexOfFirstPost = indexOfLastPost - snackPerPage;
  const currentProducts = snackProducts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="allProductbBox1">
      <h2>간식</h2>

      <ul className="allProductButtonList1 snackButtonList" >
        <li>
          <button>에너지바</button>
        </li>
        <li>
          <button>과자</button>
        </li>
        <li>
          <button>베이커리</button>
        </li>
      </ul>
      <div className="itemContianer1">
        <ul className="allProductSelectBtn1">
          <li value="">
            <button>조회순</button>
          </li>
          <li>|</li>
          <li value="">
            <button>가격 높은순</button>
          </li>
          <li>|</li>
          <li value="">
            <button>가격 낮은순</button>
          </li>
        </ul>

        <div className="allProductList1">
          <SnackProductsLayout products={currentProducts} />
        </div>
      </div>
      <Pagination
        snackProductsPerPage={snackPerPage}
        totalProducts={snackProducts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};
export default Snack;

export interface PaginationProps {
  sanckPerPage: number;
  totalProducts: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}