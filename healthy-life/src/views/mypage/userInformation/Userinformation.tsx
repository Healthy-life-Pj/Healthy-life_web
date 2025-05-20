import React from 'react'
import '../../../style/userInformation/userInformation.css'

function Userinformation() {
  return (
    <div className='userInformationallContainer'>

    <div className='userInformationContainer'>
      <h3>회원정보 수정</h3>
      <br />
      <div className='idContainer'>
      <label id='id'>아이디 *</label>

      <div className='idInputContainer'>
      <input type="text" name='id' placeholder='아이디(수정불가)' />
      <button>중복확인</button>
      </div>

      </div>


      <div className='nickNameContainer'>
      <label id='nickname'>닉네임 *</label>

      <div className='nickNameInputContainer'>
      <input type="text" name='nickname' placeholder='닉네임' />
      <button>중복확인</button>
      </div>

      </div>

    
      <div className='passwordContainer'>
      <label id='password'>비밀번호 *</label>
      <input type="text" name='password' placeholder='비밀번호 변경'/>
      </div>



      <div className='addressContainer' >
      <label id='address'>주소 *</label>
      <input type="text" name='address'
      placeholder='주소입력'
      />
      </div>



      <div className='telePhoneContainer1'>
      <label id='telephone'>휴대전화 *</label>
      
      <div className='telePhoneInputContainer1'>
      <input type="text" name='telephone'
      placeholder='휴대전화' />
      <button>인증번호</button>
      </div>

      </div>
    

      <div className='emailContainer'>
      <label id='email'>이메일 *</label>
      <input type="text" name='email' placeholder='이메일' />
      </div>

      <div className='birthdayContainer'>
      <label id='birthday'>생년월일 *</label>
      <input type="text" name='birthday' placeholder='생년월일' />
      </div>


      <div className='genderContainer'>
      <div className='genderLabelContainer'>
          <label htmlFor="gender">성별 *</label>
      </div>


      <div className='genderCheckBox'>
        <div>
        <label htmlFor="gender">남</label>
        </div>
        <div>
        <input type="checkbox" name='gender'/>
        </div>
      
      <div>
      <label htmlFor="gender">여</label>
      </div>
      <div>
      <input type="checkbox" name='gender'/>
      </div>
      
      </div>


      </div>  


      <div className='modifyButton'>
        <button>수정</button>
        <button>취소</button>
      </div>
    
    


    </div>
      </div>
  
  )
}

export default Userinformation 