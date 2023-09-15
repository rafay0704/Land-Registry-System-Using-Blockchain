import React from 'react';
import { Typography } from 'antd';
import { Box, Button, Paper, TextField } from '@mui/material';
import { useRef, useState, useEffect } from 'react';

const Profiledetail = ({
  setByte,
  stream,
  profile,
  title,
  handleInputChange,
  witness,
}) => {
  const videoRef = useRef(null);
  const [capturePic, setCapturePic] = useState(null);
  const [isCapturing] = useState(true);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
    return () => {
      stopStream();
    };
  }, [stream]);

  const handleCapture = () => {
    if (isCapturing) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef?.current.videoWidth;
      canvas.height = videoRef?.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef?.current, 0, 0);
      setCapturePic(canvas.toDataURL());
      setByte(canvas.toDataURL('image/png').split(',')[1]);
    }
  };

  const stopStream = () => {
    if (videoRef?.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '10px' }}>
      <Typography>{title}</Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box width={200}>
          {capturePic && (
            <img src={capturePic} alt="Capture" style={{ maxWidth: '100%' }} />
          )}
          <video
            ref={videoRef}
            style={{
              display: isCapturing && !capturePic ? 'block' : 'none',
              maxWidth: '100%',
            }}
          ></video>
          {<Button onClick={handleCapture}>Take Picture</Button>}
        </Box>
        <Box>
          {title === 'Witness' ? (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  minHeight: '10px',
                  overflow: 'hidden',
                  elevation: 3,
                }}
              >
                <Typography>Wallet Address:</Typography>
                <TextField
                  id="address"
                  name="address"
                  value={witness.address}
                  onChange={handleInputChange}
                />
              </Paper>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  minHeight: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'none',
                }}
              >
                <Typography>Name:</Typography>
                <TextField
                  id="name"
                  name="name"
                  value={witness.name}
                  onChange={handleInputChange}
                />
              </Paper>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  minHeight: '10px',
                  overflow: 'hidden',
                  elevation: 3,
                }}
              >
                <Typography>Wallet Address:</Typography>
                {profile?.address}
              </Paper>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  minHeight: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'none',
                }}
              >
                <Typography>Name:{profile?.name}</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  minHeight: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'none',
                }}
              >
                <Typography>Age:{profile?.age}</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  minHeight: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'none',
                }}
              >
                <Typography>CNIC: {profile?.cinc}</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  minHeight: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'none',
                }}
              >
                <Typography>City:{profile?.city}</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  minHeight: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'none',
                }}
              >
                <Typography>Email:{profile?.email}</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  minHeight: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'none',
                }}
              >
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${profile?.document?.substring(6)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Document
                </a>
              </Paper>
            </div>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Profiledetail;
