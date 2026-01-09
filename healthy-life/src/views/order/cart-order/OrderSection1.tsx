import React from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import '../../../style/Order.css';

function OrderSection1() {
  const [option, setOption] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  }

  return (
      <div className="pay1Container">

        <div className="deliveryAddress section">
          <h3>배송지</h3>
          <Box
            component="form"
            className="customBox"
            noValidate
            autoComplete="off"
          >
            <TextField className='deliveryTextField' label="성함" variant="standard" />
            <TextField className='deliveryTextField' label="주소" variant="standard" />
            <TextField className='deliveryTextField' label="전화번호" variant="standard" />
          </Box>
        </div>

        <div className="productInformationContainer section">
          <h3>상품정보</h3>
          <div className="productInformation">
            <div className='orderProductImgPDiv'>
            <div className='orderProductImgDiv'>
            <img src="" alt="상품정보이미지1"className='orderProductImg' />
            </div>
            <p className="dailySet">[냉동]데일리 블루베리 세트</p>
            </div>
            <div className="productImage1">
              <p className="dailyMany">{}</p>
              <p className="dailyPrice">45000원</p>
            </div>
          </div>
        </div>

        <div className="deliveryRequest section">
          <Box sx={{ minWidth: 100, margin: '1%' }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">배송요청사항</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={option}
                label="option"
                onChange={handleChange}
              >
                <MenuItem value={10}>직접 수령하겠습니다</MenuItem>
                <MenuItem value={20}>부재 시 경비실에 맡겨주세요</MenuItem>
                <MenuItem value={30}>배송 전 연락 바랍니다</MenuItem>
                <MenuItem value={40}>문 앞에 놔두십시오</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>

        <div className="paymentMethod section">
          <h3>결제방법 선택</h3>
          <div className="MethodButtonBox">
            <button>카드결제</button>
            <button>간편결제</button>
          </div>
        </div>
        
      </div>
  );
}

export default OrderSection1;
