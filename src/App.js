import './App.css';

import { TextField, Button, Grid, Box, IconButton } from '@mui/material';
import { NavigateBeforeOutlined, NavigateNextOutlined } from '@mui/icons-material';
import { useState } from 'react';

function App() {
  const [summary, setSummary] = useState([]);
  const [image, setImage] = useState("");
  const [showLoader, setShowLoader] = useState("")
  const [values, setValues] = useState({"GNR": "", "BNR": "", "SNR": ""})
  const [sendingBlocked, setSendingBlocked] = useState(false);
  const [showError, setShowError] = useState("");

  let receivedElements = -1;

  const createURL = () => {
    let url = new URL("http://" + window.location.hostname + "/api/Summary");

    url.searchParams.append("GNR", values["GNR"]);


    if (values["BNR"] !== "") {
      url.searchParams.append("BNR", values["BNR"]);
    }

    if (values["SNR"] !== "") {
      url.searchParams.append("SNR", values["SNR"]);
    }

    url.searchParams.append("StartId", receivedElements +1);

    return url.href;
  }

  const handleValueChange = (e) => {
    setShowError("");
    setSendingBlocked(false);
    setValues({...values, [e.target.name]: e.target.value})
  }

  const handleSearch = () => {

    if (sendingBlocked) {
      console.log("Sending has been blocked");
      return;
    }

    if (values["GNR"] === "0" || values["GNR"] === "") {
      setShowError("GNR field cannot be empty");
      return;
    }

    setShowError("");
    setSendingBlocked(true);

    setSummary(prevSummary => []);
    const eventSourceInitDict = { headers: { 'Access-Control-Allow-Origin': '*' } };
    const eventSource = new EventSource(createURL(), eventSourceInitDict);

    setShowLoader(l => "Loading...");

    eventSource.addEventListener('message', function (e) {
      const jsonData = JSON.parse(e.data);

      console.log("Before " + jsonData["Id"] + " " + receivedElements);
      if (jsonData["Id"] < receivedElements) {
        console.log("After " + jsonData["Id"] + " " + receivedElements);
        //return;
      }

      receivedElements++;
      setShowError("");
      setSummary(prevSummary => [...prevSummary, jsonData]);
    }, false);

    eventSource.addEventListener('update', function (e) {
      const jsonData = JSON.parse(e.data);
      let message = jsonData["message"];
      setShowLoader(l => message);
    });

    eventSource.addEventListener('close', function (e) {
      setShowLoader(l => "");
      eventSource.close();
      setSendingBlocked(false);
      receivedElements = -1;
    });

    eventSource.onerror = (error) => {
      setShowLoader(l => "");
      setShowError("Request failed, try again");
      setSendingBlocked(false);
      receivedElements = -1;
      console.log('EventSource failed:', error);
    };
  };

  const handleSummaryClick = (src) => {
    setImage(img => src);
    console.log("Setting pdf source to " + src)
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
          label="BNR" type="search" 
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              handleSearch();
              ev.preventDefault();
            }
          }}/>
        </Grid>

        <Grid item>
          <TextField 
          name='SNR'
          onChange={handleValueChange}
          label="SNR" type="search"
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              handleSearch();
              ev.preventDefault();
            }
           }} />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Grid>
      </Grid>
      <Grid marginTop="40px" display="flex" flex={1} justifyContent="center" alignItems="center">
        <div id='left' style={{ flex: 1, height:"100%"}}>
          <Box display="flex" id='pdfholder' justifyContent="center" alignItems="center" style={{ height: "100%", overflow: 'hidden' }}>
            <iframe
              src={image}
              style={{ width: '90%', height: '90%'}}
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
            </Grid>
          </div>
        </div>
        <div id='right' style={{ flex: 1, height:"100%"}}>
          <Box width="80%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <h2 id='summaryTitle'>Summary</h2>
            <ul id='summaryList'>
              {summary.map((item, index) => (
                <li id={item.Id} key={index} style={{ paddingTop: "10px" }}>
                  <button className={'summary-button'} onClick={() => handleSummaryClick(item.Document)}>{item.Resolution}</button>
                </li>
              ))}
            </ul>
            {showLoader !== "" &&
              <p style={{fontWeight: "bold"}}>{showLoader}</p>
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
