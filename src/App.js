import logo from './logo.svg';
import './App.css';

import { TextField , Button, Grid, Box, Container, IconButton} from '@mui/material';
import { BorderAll, NavigateBeforeOutlined, NavigateNextOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const handleSummaryClicked = () => {

}



function Page() {
  const [summary, setSummary] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  const handleSearch = () => {
    fetch("https://baconipsum.com/api/?type=meat-and-filler")
      .then((response) => response.json())
      .then((data) => {
        setSummary(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []); // Empty dependency array to run only once after the initial render

  const images = [
    'https://builtin.com/cdn-cgi/image/f=auto,quality=80,width=752,height=435/https://builtin.com/sites/www.builtin.com/files/styles/byline_image/public/2023-06/react-js-image.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/640px-Joe_Biden_presidential_portrait.jpg',
     // Add your second image URL here
    // Add more image URLs as needed
  ];

  const handleNextImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Container maxWidth="100%" style={{height:"100vh"}}>
      <Grid
        container
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <TextField label="GNR" type="search" />
        </Grid>
        <Grid item>
          <TextField label="BNR" type="search" />
        </Grid>
        <Grid item>
          <TextField label="SNR" type="search" />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Grid>
      </Grid>
      <Box display="flex" paddingTop={5} justifyContent="center" alignItems="center">
  <div id='left' style={{ flex: 1 }}>
  <Box display="flex" id='pdfholder' justifyContent="center" alignItems="center" style={{ maxHeight: '50%', overflow: 'hidden' }}>
          <img
        src={images[imageIndex]}
        alt={`Image ${imageIndex + 1}`}
        style={{ maxWidth: '60%', maxHeight: '60%', width: 'auto', height: 'auto' }}
      />
    </Box>
    <div id='navigator'>
      <Grid
        container
        spacing={20}
        justifyContent="center"
        paddingTop={2}
        alignItems="center"
      >
        <Grid item>
          <IconButton onClick={handlePrevImage}>
            <NavigateBeforeOutlined />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton onClick={handleNextImage}>
            <NavigateNextOutlined />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  </div>
  <div id='right' justifyContent="center" alignItems="center" style={{ flex: 1 }}>
    <Box width="80%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <h2 id='summaryTitle'>Summary</h2>
      <ul id='summaryList'>
        {summary.map((item, index) => (
          <li key={index} style={{ paddingTop: "10px" }}>
            <button className={'summary-button'}>{item}</button>  
          </li>
        ))}
      </ul>
    </Box>
  </div>
</Box>
    </Container>
  )
}

function App() {
  return <Page/>
}

export default App;
