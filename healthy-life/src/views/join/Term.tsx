import React, { useState } from 'react'
import '../../style/join/term.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TermContent from './TermContent';
import TermContent02 from './TermContent02';

function Term() {
  const [activeMore1, setActiveMore1] = useState<string | null>(null);
  const [activeMore2, setActiveMore2] = useState<string | null>(null);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [isDown1, setIsDown1] = useState<boolean>(true);
  const [isDown2, setIsDown2] = useState<boolean>(true);


  const handleAllAgree = (e:React.ChangeEvent<HTMLInputElement>) => {
  e.target.checked ?
    setCheckList(["userAgree", "userInfoAgree", "allAgree"])
    : setCheckList([]);
  }
  const check = (e:React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked
    ? setCheckList([...checkList, e.target.name])
    : setCheckList(checkList.filter((choice) => choice !== e.target.name));
  }

  const handleClick1 = (menu: string) => {
    setActiveMore1(menu);
    // 버튼 바꾸는 함수
    setIsDown1(false);
  };

  const handelCloseClick1 = () => {
    setActiveMore1(null);
    setIsDown1(true);
  }
  const handleClick2 = (menu: string) => {
    setActiveMore2(menu);
    setIsDown2(false);
  };
  const handelCloseClick2 = () => {
    setActiveMore2(null);
    setIsDown2(true);
  }

  return (
    <div>
      <ul className='termUl'>
            <h5>약관동의</h5>
          <li className='totalAgree'>
            <div className='labelInputDiv Agree'>
            <label >전체 동의</label>
            <input 
            type="checkbox" 
            name="allAgree"
            onChange={handleAllAgree}
            checked={checkList.length === 3 ? true : false}
            />
            </div>
          </li>

          <li>
            <div className='termsDiv'>
              <div className='labelInputContainer'>
                <div className='labelInputDiv'>
                <label htmlFor="">이용약관 동의</label>
                <input 
                type="checkbox"
                name='userAgree'
                onChange={check}
                checked={checkList.includes("userAgree")}
                />
                </div>
                {isDown1 ? (
                  <button 
                  className='moreBtn'
                  onClick={() => handleClick1('<ExpandMoreIcon />')}
                  ><ExpandMoreIcon /></button>

                ): (
                  <button 
                  className='moreBtn'
                  onClick={handelCloseClick1}
                  ><KeyboardArrowUpIcon  /></button>
                )}
              </div>
              {activeMore1 === '<ExpandMoreIcon />' && 
              <div 
              className='contractContent'>
                <TermContent />
                </div>
              }
            </div>
          </li>
          
          <li>
            <div className='termsDiv'>
              <div className='labelInputContainer'>
              <div className='labelInputDiv'>
              <label htmlFor="">개인정보 수집 및 이용 동의</label>
              <input 
              type="checkbox" 
              name='userInfoAgree' 
              onChange={check}
              checked={checkList.includes("userInfoAgree") ? true : false}
              />
              </div>
                {isDown2 ? (
                  <button 
                  className='moreBtn'
                  onClick={() => handleClick2('<ExpandMoreIcon />')}
                  ><ExpandMoreIcon /></button>

                ): (
                  <button 
                  className='moreBtn'
                  onClick={handelCloseClick2}
                  ><KeyboardArrowUpIcon  /></button>
                )}
              </div>
              {activeMore2 === '<ExpandMoreIcon />' &&
              <div className='contractContent'>
                <TermContent02 />
              </div>
              }
            </div>
          </li>
        </ul>
    </div>
  )
}

export default Term