import { ProductProps } from "./RecommandApp";

import "../../style/recommandList.css";
import { useState } from "react";
import { idText } from "typescript";
import index from "../../hooks";
import { Link } from "react-router-dom";

const RecommandList: React.FC<{ products: ProductProps[] }> = ({
products,
}) => {
const [activeProduct, setActiveProduct] = useState<number | null>(null);

const handleMouseEnter = (index: number) => {
  setActiveProduct(index);
};
const handleMouseLeave = () => {
  setActiveProduct(null);
}

return (
<div className="allProductImageContainer">
  {products.map((product, index) => (
    <div key={product.id} className="allProductContain">
      <Link to={"/productdetail"}>
      <img
        src={product.image}
        alt={product.title}
        className="allProductImage"
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
      />
      <h4>{product.title}</h4>
      <p>price: 30000만원</p>
      </Link>
      <div 
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={handleMouseLeave}
      >
        {activeProduct === index && (
        <div className="allProductHoverBtn">
        <button>ADD</button>
        <button>WISH</button>
        </div>
        )}
      </div>
    </div>
  ))}
</div>
);
};
export default RecommandList;
