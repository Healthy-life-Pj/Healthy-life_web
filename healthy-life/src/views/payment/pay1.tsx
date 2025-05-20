import React from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';






const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'gray',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'gray',
          '&.Mui-focused': {
            color: 'gray',
          },
        },
      },
    },
  },
});


function Pay1() {

  const [option, setOption] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  }

  return (
    <ThemeProvider theme={theme}>
    <div className='pay1Container'>


      <div className='deliveryAddress'>
        <h3>배송지</h3>
      
      
      <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
        marginBottom: '2%', marginLeft: '7px'
      }}
      noValidate
      autoComplete="off"
      >
        <TextField id="standard-basic" label="성함" variant="standard" />
        <TextField id="standard-basic" label="주소" variant="standard" />
        <TextField id="standard-basic" label="전화번호" variant="standard"/>


      </Box>
      </div>

      


        <br />
        <div className='productInformationContainer'>
          <h3>상품정보</h3>
          <br />
        <div className='productInformation'>
          <br />
        <br />
        <img src="https://cdn.pixabay.com/photo/2017/08/25/11/10/plum-2679782_1280.jpg" alt="상품정보이미지1" />
        <div className='productImage1'>
        <p className='dailySet'>[냉동]데일리 블루베리 세트</p>
        <p className='dailyOption'>[옵션: 1상자(2kg)]</p>
        <p className='dailyMany'>수량:2개</p>
        <p className='dailyPrice'>45000원</p>
          </div>
        </div>
        </div>

        <br />






    <div className='deliveryRequest'>
    <Box sx={{ minWidth: 100, margin: '1% 1% 1% 1%'}}>
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">배숑요청사항</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={option}
        label="option"
        onChange={handleChange}
      >
        <MenuItem value={10}>직접 수령하겠습니다</MenuItem>
        <MenuItem value={20}>부제시 경비실에 맡겨주세요</MenuItem>
        <MenuItem value={30}>배송전 연락바랍니다</MenuItem>
        <MenuItem value={40}>문 앞에 놔둬주십시오</MenuItem>
      </Select>
    </FormControl>
  </Box>
        </div>







        <br />

        <div className='cuponPoint'>
          <h3>쿠폰 / 포인트</h3>
          <br />

          <div className='cuponPointFlexBox'>

            <div className='paymentUseFlexBox'>
            
              <div className='usePoint'>
            <p>포인트사용</p>
            <input type="text" name='usePoint'/> 
              </div>

            <div className='useCupon'>
            <p>쿠폰 사용</p>
            <input type="text" name='useCupon'/>
            </div>
            
            </div>

          
            <div className='paymentUseButton' >
            <button>전액사용</button>
            <button>쿠폰사용</button>
            </div>
        
          </div>
          
        </div>

        <br />









        <div className='paymentMethod'>
          <h3>결제방법 선택</h3>
          <br />

        <div className='MethodButtonBox'>
        <button>카드결제</button> 
        <button>간편결제</button> 
        </div>

        </div>

    </div>
  </ThemeProvider>
  )
}

export default Pay1