import React from 'react'
import '../../../style/benefit/benefit.css'
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import Looks6Icon from '@mui/icons-material/Looks6';




function Benefit() {

  return (
    <div className='head'>
    <h2>등급별 혜택</h2>
    <br />
    <div className='benefitContainer'>
      

      <div className='gradeContainer'>

        <div className='Icon'>
        <LooksOneIcon/>
        </div>

        <div className='grade'>
          
        <p>자격조건: 200만원 이상 구매</p>
        <br />
        <p>혜택: 15만 포인트 제공</p>
        </div>

        </div>
      

      <div className='gradeContainer'>
        
        <div className='Icon'>
        <LooksTwoIcon/>
        </div>
        

        <div className='grade'>
          
        <p>자격조건: 100만원 이상 구매</p>
        <br />
        <p>혜택: 12만 포인트 제공</p>
        </div>
      
      </div>
    

      <div className='gradeContainer'>

        <div className='Icon'>
        <Looks3Icon/>
        </div>

        <div className='grade'>
          
        <p>자격조건: 60만원 이상 구매</p>
        <br />
        <p>혜택: 10만 포인트 제공</p>
        </div>

      </div>
      


      <div className='gradeContainer'>
  

        <div className='Icon'>
        <Looks4Icon/>
        </div>
        
        <div className='grade'>
          
        <p>자격조건: 40만원이상 구매</p>
        <br />
        <p>혜택: 7만 포인트 제공</p>
        </div>
        
        </div>
      


      <div className='gradeContainer'>

        <div className='Icon'>
        <Looks5Icon/>
        </div>
        
        <div className='grade'>
        
        <p className='cutLine'>자격조건: 20만원 이상 구매</p>
        <br />
        <p>혜택: 5만 포인트 제공</p>
        </div>
        
        </div>
      
      

        <div className='gradeContainer'>

          <div className='Icon2'>
        
          <Looks6Icon/>
          </div>
          
          <div className='grade'>
            <br />
          <p>20만원 미만 구매시</p>
  
          </div>

        </div>
        

      
    </div>
    </div>
  )
  
} 
  


export default Benefit;