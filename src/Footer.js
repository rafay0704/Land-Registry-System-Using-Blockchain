import React from 'react';
import { Box, Container, Grid, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import logo from './images/logo3.png';
import logo1 from './images/logo2.png';
import logo3 from './images/logo.png';
const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#263238', color: 'white', mt: 5, py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>About Us</Typography>
            <Typography style={{textAlign:"justify"}}>
              🤝 Land Registry System Using Blockchain team is composed of passionate individuals dedicated to transforming the real estate industry in Pakistan.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>Quick Links</Typography>
            <Typography>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a></li>
                <li><a href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a></li>
                <li><a href="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a></li>
                <li><a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</a></li>
              </ul>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>Connect with us:</Typography>
            <IconButton color="inherit" href="https://facebook.com/your-company" target="_blank">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" href="https://instagram.com/your-company" target="_blank">
              <InstagramIcon />
            </IconButton>
            <IconButton color="inherit" href="https://linkedin.com/your-company" target="_blank">
              <LinkedInIcon />
            </IconButton>
            <IconButton color="inherit" href="https://twitter.com/your-company" target="_blank">
              <TwitterIcon />
            </IconButton>
          </Grid>
            <img src={logo1} alt="Logo" style={{ height: '200px'}}/>
            <img src={logo3} alt="Logo" style={{ height: '200px'}}/>
        <img src={logo} alt="Logo" style={{ height: '200px'}}/>
        </Grid>
      
        
     
        <Box display="flex" alignItems="center" justifyContent='center'>
        
        <Typography variant="body2" color="white"  fontWeight= "bold" align="center" sx={{ mt: 6 }}>
          
        </Typography>
        <Typography
         variant="body2" 
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#f5f5f5",
            textShadow: "2px 2px #1e88e5",
            letterSpacing: "2px",
          }}
        >
         © {new Date().getFullYear()} Land Registry System Using Blockchain. All rights reserved.
        </Typography>
      </Box>
      
       
      </Container>
    </Box>
  );
};

export default Footer;
