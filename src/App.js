import './App.css';

import { TextField, Button, Grid, Box, IconButton } from '@mui/material';
import { NavigateBeforeOutlined, NavigateNextOutlined } from '@mui/icons-material';
import { useState } from 'react';

function App() {
  const [summary, setSummary] = useState([]);
  const [image, setImage] = useState("");
  const [showLoader, setShowLoader] = useState(false)
  const [values, setValues] = useState({"GNR": "", "BNR": "", "SNR": ""})
  const [sendingBlocked, setSendingBlocked] = useState(false);
  const [showError, setShowError] = useState("");
  const [summaryId, setsummaryId] = useState([]);

  const createURL = () => {
    if (values["BNR"] === "") {
      setValues({...values, "BNR": "0"});
    }

    if (values["SNR"] === "") {
      setValues({...values, "SNR": "0"});
    }

    if (!summaryId.length === 0) {
      return 'http://localhost/api/Summary?GNR=' + values["GNR"] + 
                                          '&BNR=' + values["BNR"] + 
                                          '&SNR=' + values["SNR"] +
                                          'StartId=' + 0;
    }

    let startId = Math.max(summaryId);
    return 'http://localhost/api/Summary?GNR=' + values["GNR"] + 
                                        '&BNR=' + values["BNR"] + 
                                        '&SNR=' + values["SNR"] +
                                        '&StartId=' + startId;
  }

  const handleValueChange = (e) => {
    setShowError("");
    setSendingBlocked(false);
    setValues({...values, [e.target.name]: e.target.value})
  }

  const handleSearch = () => {
    setsummaryId(i => []);

    if (sendingBlocked) {
      console.log("Sending has been blocked");
      return;
    }

    if (values["GNR"] === "0" || values["GNR"] === "") {
      setShowError("GNR field cannot be empty");
      return;
    }

    setShowError("");
    setShowLoader(l => true);
    setSendingBlocked(true);

    setSummary(prevSummary => []);
    const eventSourceInitDict = { headers: { 'Access-Control-Allow-Origin': '*' } };
    const eventSource = new EventSource(createURL(), eventSourceInitDict);

    eventSource.addEventListener('message', function (e) {
      const jsonData = JSON.parse(e.data);

      if (summaryId.includes(jsonData["ID"])) {
        return;
      }
      setsummaryId(prevIDs => [...prevIDs, jsonData["ID"]]);
      setShowError("");
      setSummary(prevSummary => [...prevSummary, jsonData]);
    }, false);

    eventSource.addEventListener('close', function (e) {
      setShowLoader(l => false);
      eventSource.close();
      setSendingBlocked(false);
    });

    eventSource.onerror = (error) => {
      setShowLoader(false);
      setShowError("Request failed, try again");
      setSendingBlocked(false);
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
          <TextField
          name='GNR'
          onChange={handleValueChange}
          label="GNR" type="search" />
        </Grid>
        <Grid item>
          <TextField 
          name='BNR'
          onChange={handleValueChange}
          label="BNR" type="search" />
        </Grid>
        <Grid item>
          <TextField 
          name='SNR'
          onChange={handleValueChange}
          label="SNR" type="search" />
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
            </ul>
            {showLoader &&
              <p>Laster...</p>
            }
            {showError !== "" &&
              <p style={{color:"red"}}>{showError}</p>
            }
          </Box>
        </div>
      </Grid>
    </Grid>
  )
}

export default App;
