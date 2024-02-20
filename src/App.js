import './App.css';

import { TextField, Button, Grid, Box, Container, IconButton } from '@mui/material';
import { NavigateBeforeOutlined, NavigateNextOutlined } from '@mui/icons-material';
import { useState } from 'react';

function Page() {
  const [summary, setSummary] = useState([]);
  const [image, setImage] = useState("");
  const [showLoader, setShowLoader] = useState(false)

  const url = "http://localhost/api/Summary?GNR=101&BNR=102&SNR=103";

  const handleSearch = () => {
    setSummary(prevSummary => []);
    const eventSourceInitDict = { headers: { 'Access-Control-Allow-Origin': '*' } };
    const eventSource = new EventSource(url, eventSourceInitDict);

    eventSource.addEventListener('message', function (e) {
      setShowLoader(l => true);
      const jsonData = JSON.parse(e.data);
      setSummary(prevSummary => [...prevSummary, jsonData]);
    }, false);

    eventSource.addEventListener('close', function (e) {
      setShowLoader(l => false);
      eventSource.close();
    });

    eventSource.onerror = (error) => {
      console.log('EventSource failed:', error);
    };
  };

  const handleNextImage = () => {
    //setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    //setImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleSummaryClick = (src) => {
    setImage(img => src);
  }

  return (
    <Grid height="100vh" display="flex" flexDirection="column">
      <Grid
        container
        spacing={1}
        marginTop="10px"
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
      <Grid marginTop="40px" display="flex" flex={1} justifyContent="center" alignItems="center">
        <div id='left' style={{ flex: 1, height:"100%"}}>
          <Box display="flex" id='pdfholder' justifyContent="center" alignItems="center" style={{ maxHeight: '50%', overflow: 'hidden' }}>
            <iframe
              src={image}
              style={{ width: '60%', height: '60%'}}
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
        <div id='right' style={{ flex: 1, height:"100%"}}>
          <Box width="80%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <h2 id='summaryTitle'>Summary</h2>
            <ul id='summaryList'>
              {summary.map((item, index) => (
                <li key={index} style={{ paddingTop: "10px" }}>
                  <button className={'summary-button'} onClick={() => handleSummaryClick(item.Document)}>{item.Resolution}</button>
                </li>
              ))}
              {showLoader &&
                <li>
                  <p>Laster...</p>
                </li>
              }
            </ul>
          </Box>
        </div>
      </Grid>
    </Grid>
  )
}

function App() {
  return <Page />
}

export default App;
