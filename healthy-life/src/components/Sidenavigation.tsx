import React, { useState } from 'react'
import '../style/componentStyle/Sidenaviation.css'
import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingCart';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone'; 
import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import { useNavigate } from 'react-router-dom';
import KitchenOutlinedIcon from '@mui/icons-material/KitchenOutlined';
import CloseIcon from '@mui/icons-material/Close';

const Sidenavigator:React.FC = () => {
  const [activeSide, setActiveSide] = useState<string | null>(null);
  const [isOpen, setOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleMouseSpreadClick = (side: string) => {
    setActiveSide(side);
    setOpen(false);
  };

  const handleCloseClick = () => {
    setActiveSide(null);
    setOpen(true)
  };

  const MoveToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  const MoveToUnder = () => {
      window.scrollTo({ top: +2000, behavior: 'smooth' });
    };
  
  return (
    <div className='SideContainer'>
      {activeSide === 'side' && 
      <ul className='sideNav'>
        <li onClick={()=>navigate("cart")}><ShoppingBagTwoToneIcon/></li>
        <li onClick={() => navigate("/mypage/wishlist")}><FavoriteTwoToneIcon/></li>
        <li onClick={MoveToTop}><KeyboardArrowUpTwoToneIcon/></li>
        <li onClick={MoveToUnder}><KeyboardArrowDownTwoToneIcon/></li>
        <li onClick={() => navigate("/recommand")}>체질<br />/기호</li>
      <button
      className='closeIcon'
      onClick={handleCloseClick}
      ><CloseIcon style={{fontSize:'30px'}}/>
      </button>
      </ul>
      }
      {isOpen ? 
      <button 
      className='KitchenOutlinedIcon' 
      onClick={() => handleMouseSpreadClick('side')}
      ><KitchenOutlinedIcon style={{fontSize: '40px'}} />
      </button>
      : null}
    </div>
  )
}
export default Sidenavigator;