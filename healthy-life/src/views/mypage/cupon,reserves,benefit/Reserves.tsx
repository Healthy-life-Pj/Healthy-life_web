import React from 'react'
import '../../../style/reserves/resurves.css'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}



function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



function Reserves() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <div className='reservesHead'>
      <h2>적립금</h2>
      <br />
      <div className='viewPoint'>
        <br />
        <p style={{color: 'gray', fontSize: '17px'}}>보유 적립금</p>
        <h1 style={{color: '#67C6E3'}}>0원</h1>
        <br />
        <p style={{fontSize: '16px'}}>15일이내 소멸 예정 적립금 <span style={{fontWeight: 'bold', fontSize: '16px'}}>0원</span></p>
      </div>
      <br />
      <br />

      <Box sx={{ width: '790px', height: '400px' }}>
      <Box sx={{ borderBottom: 3, borderColor: 'GrayText' }}>
        <Tabs value={value}
              onChange={handleChange} aria-label="basic tabs example"
              TabIndicatorProps={{ style: { display: 'none' } }}
              >
          <Tab label="전체내역" {...a11yProps(0)}  sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&.Mui-selected': {
                  color: 'inherit', 
                },
              }} />
          <Tab label="지급내역" {...a11yProps(1)} sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&.Mui-selected': {
                  color: 'inherit', 
                },
              }} />
          <Tab label="차감내역" {...a11yProps(2)} sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&.Mui-selected': {
                  color: 'inherit', 
                },
              }} />
        </Tabs>
      </Box>
      <div className='tabBox'>
        <br />
          <div className='date'>
          <p>날짜</p>
          </div>

          <div className='context'>
          <p>내용</p>
          </div>

          <div className='payOrDeducted'>
          <p>지급/차감</p>
          </div>

          <div className='changePoint'>
          <p>변동 포인트</p>
          </div>

          <div className='expirationPeriod'>
          <p>유효기간</p>
          </div>
          
        </div>
      <CustomTabPanel value={value} index={0}>

        <div className='showUseReserves'>
          <p>적립금을 적립/사용한 내역이 없습니다.</p>
        </div>
      
      </CustomTabPanel>
      
      <CustomTabPanel value={value} index={1}>
      
      <div className='showUseReserves'>
          <p>적립금을 적립/사용한 내역이 없습니다.</p>
        </div>

      </CustomTabPanel>
      
      

      <CustomTabPanel value={value} index={2}>
      <div className='showUseReserves'>
          <p>적립금을 적립/사용한 내역이 없습니다.</p>
        </div>
      </CustomTabPanel>
    </Box>

    </div>
  )
}

export default Reserves