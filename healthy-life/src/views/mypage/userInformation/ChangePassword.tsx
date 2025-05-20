import React from 'react'

function ChangePassword() {
  return (
    <div>
      <h2>비밀번호 변경</h2>
      <br />
      
      <div style={{float: 'left'}}>
        <label id='changePassword'>변경된 비밀번호</label>
        <input type="text" name='changepassword' />
        <br />

        <label id='passwordCheck'>비밀번호 확인</label>
        <input type="text" name='passwordCheck' />
        <br />
        <button>수정</button>
      </div>
    </div>
  )
}

export default ChangePassword