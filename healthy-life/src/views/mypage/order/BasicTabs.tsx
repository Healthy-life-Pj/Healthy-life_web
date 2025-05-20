import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Order from './Order';
import OrderList from './OrderList';
import Return from './Return';
import ReturnOrderList from './ReturnOrderList';
import { backdropClasses } from '@mui/material';

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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className='tabsContainer'>
      <div>
        <Tabs value={value} 
        onChange={handleChange} 
        aria-label="basic tabs example"
        TabIndicatorProps={{ style: { display: 'none' } }}
        >
          <Tab label="주문현황" {...a11yProps(0)} 
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&.Mui-selected': {
              color: 'inherit', 
            },
          }}
          />
          <Tab label="취소반품" {...a11yProps(1)} 
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&.Mui-selected': {
              color: 'inherit', 
            },
          }}
          />
        </Tabs>
      </div>
      <CustomTabPanel value={value} index={0}>
      <div>
        <Order />
        <OrderList />
      </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Return />
        <ReturnOrderList />
      </CustomTabPanel>
    </div>
  );
}