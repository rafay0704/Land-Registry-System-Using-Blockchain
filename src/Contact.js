import React from 'react';
import { Box, Button, Card, CardContent, Grid, IconButton, TextField, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const ContactUs = () => {
  return (
    <Card sx={{maxWidth: 1200, margin: 'auto', marginTop: 5, padding: 3, backgroundColor: '#f5f5f5' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom align="center">Contact Us</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom><IconButton color="primary">
              <HomeIcon fontSize="large" />
            </IconButton>Address</Typography>
            <Typography>University of Lahore, Gujrat Pakistan</Typography>
            
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom> <IconButton color="primary">
              <EmailIcon fontSize="large" />
            </IconButton>Email</Typography>
            <Typography>uol@student.cs.edu.pk</Typography>
           
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>  <IconButton color="primary">
              <PhoneIcon fontSize="large" />
            </IconButton>Phone</Typography>
            <Typography>+923048386</Typography>
          
          </Grid>
        </Grid>

        <Typography margin="15px" variant="h6" gutterBottom align="center">Connect with us on social media:</Typography>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <IconButton color="primary" href="https://facebook.com/your-company" target="_blank">
              <FacebookIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton color="primary" href="https://instagram.com/your-company" target="_blank">
              <InstagramIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton color="primary" href="https://linkedin.com/your-company" target="_blank">
              <LinkedInIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton color="primary" href="https://twitter.com/your-company" target="_blank">
              <TwitterIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>

        <Box component="form" noValidate autoComplete="off" sx={{mt: 4}}>
          <Typography variant="h6" gutterBottom align="center">Subscribe to our newsletter:</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <TextField fullWidth id="outlined-basic" label="Email Address" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" color="primary" size="large" fullWidth>Subscribe</Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContactUs;
