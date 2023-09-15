import React from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import metamask from "./images/metamask.png";
import register from "./images/register.png";
import vuser from "./images/vuser.png";
import vuser1 from "./images/vuser1.png";
import land from './images/land.png';
import buy from './images/buy.png';
import payment from './images/payment.png';
import transfer from './images/transfer.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#f0f0f0',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    height: '100%',
  },
  media: {
    height: 80, // Updated size
    width: 80, // Updated size
    marginBottom: theme.spacing(2),
  },
  stepHeader: {
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  joinButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  joinButton: {
    minWidth: 200,
  },
}));

function JoinUs() {
  const classes = useStyles();

  const steps = [
    {
      title: "Install Metamask",
      description: "Download and set up Metamask Extension. Store your private keys.",
      image: metamask,

    },
    {
      title: "Register Your Account",
      description: "Use your Metamask private key to create your account.",
      image: register,
    },
    {
      title: "Wait for Verification",
      description: "Wait for your account to be verified by our team.",
      image: vuser1,
    },
    {
      title: "Add Land",
      description: "Once verified, you can add your land for verification.",
      image: land,
    },
    {
      title: "Get Land Verified",
      description: "Wait for your land to be verified by our team.",
      image: vuser
    },
    {
      title: "Buy/Sell Lands",
      description: "Start buying or selling verified lands on our platform.",
      image: buy
    },
    {
      title: "Make Crypto Payments",
      description: "Complete your transactions securely with our platform.",
      image: payment
    },
    {
      title: "Instant Ownership Transfer",
      description: "Experience instant ownership transfer with Blockchain Technology.",
      image: transfer
    }
  ];

  return (
    <div className={classes.root}>
      <Typography variant="h3" component="h3" gutterBottom align="center">
        How To Join?
      </Typography>

      <Grid container spacing={2}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className={classes.card}>
              <CardContent>
                <img src={step.image} alt={step.title} className={classes.media} />
                <Typography variant="h5" className={classes.stepHeader}>
                  Step {index + 1}: {step.title}
                </Typography>
                <Typography>{step.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box className={classes.joinButtonContainer}>
        <Link to="/registration" style={{ textDecoration: 'none' }}>
          <Button className={classes.joinButton} variant="contained" color="primary" size="large">
            Join Us
          </Button>
        </Link>
      </Box>
    </div>
  );
}

export default JoinUs;
