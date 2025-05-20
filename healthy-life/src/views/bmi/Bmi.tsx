import React, { useState } from 'react'
import '../../style/bmi/bmiCalculator.css'
import { Box, InputAdornment, TextField } from '@mui/material';

interface body {
  weight: string | number;
  height: string | number;
}



const initialValue: body = {
  weight: '',
  height: ''
}

export default function Bmi(){
  const [body, setBody] = useState<body>(initialValue);
  const [result, setResult] = useState('');

  const {weight, height} = body;

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setBody({
      ...body,

      [name]: value
    }
    )
  }

  


  const bmiCalculator = (e: React.FormEvent) => {
    e.preventDefault(); 

    let m = Number(height) * 0.01;
    let bmiheight = m * m;
    let bmi = Number(weight) / bmiheight;
    
    if(18.5 > bmi){
    
      setResult(`당신의 신체질량지수(BMI)는 ${bmi.toFixed(2)} (으로) 저체중입니다`)
      
    
    } else if(18.5 <= bmi && bmi < 23){
    
      setResult(`당신의 신체질량지수(BMI)는 ${bmi.toFixed(2)}(으로) 정상입니다`)
      

    } else if(23 <= bmi && bmi < 25){
      
      setResult(`당신의 신체질량지수(BMI)는 ${bmi.toFixed(2)}(으로) 경계성 비만입니다`) 
      
    
    } else if(25 <= bmi && bmi < 30){
      
      setResult(`당신의 신체질량지수(BMI)는 ${bmi.toFixed(2)}(으로) 비만입니다`) 
      
    
    } else if(30 <= bmi && bmi < 35){
    
      setResult(`당신의 신체질량지수(BMI)는 ${bmi.toFixed(2)}(으로) 고도비만입니다`) 
      
    } else if(35 <= bmi){
    
      setResult(`당신의 신체질량지수(BMI)는 ${bmi.toFixed(2)}(으로) 중증 고도비만입니다`) 
      
    
    } else{
    
      setResult(`올바른 수치를 입력하세요`)
    
    }

    setBody(initialValue)
  }

  return (
    <div>
      <h1 style={{marginTop: '75px', textAlign: 'center'}}>체제방 계산기</h1>
      <br />
      <Box>

      <form className='bmiCalculator'>
        <br />
        <TextField
          label="몸무게"
          id="weight"
          sx={{ m: 1, width: '40ch' }}
          InputProps={{
            startAdornment: <InputAdornment position="start">kg</InputAdornment>,
          }}
          variant="filled"
          value={weight}
          name='weight'
          onChange={inputHandler}
        />

        <TextField
          label="신장"
          id="height"
          sx={{ m: 1, width: '40ch' }}
          InputProps={{
            startAdornment: <InputAdornment position="start">cm</InputAdornment>,
          }}
          variant="filled"
          value={height}
          name='height'
          onChange={inputHandler}
        />
        <br />
        <br />
        <button className='bmiButton' onClick={bmiCalculator}>결과 확인</button>
        <br />
        <br />
      </form>
        <br />
        <p className='result'>{result}</p>

      </Box>
    </div>


    // bmi = 몸무게 / 신장(제곱)
  )
}
