import React from "react";
import {
  Typography,
  Grid,
  Box,
  makeStyles,
  Card,
  CardContent,
} from "@material-ui/core";
import land4 from "./images/home.jpg";
import land1 from "./images/global.jpg";
import land2 from "./images/land2.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  title: {
    fontWeight: "bold",
    fontSize: "2.5rem",
    marginBottom: theme.spacing(1),
    textAlign: "center",
  },
  description: {
    fontSize: "1.2rem",
    marginBottom: theme.spacing(2),
    textAlign: "justify",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: theme.spacing(1),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: theme.spacing(1),
    transition: "0.3s",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    },
  },
  cardContent: {
    padding: theme.spacing(2),
  },
}));

function AboutUs() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        className={classes.title}
        style= {{marginBottom: 30}}
      >
        About Us

      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <img src={land4} alt="Vision" className={classes.image} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h5" className={classes.title}>
                Our Vision
              </Typography>
              <Typography variant="body2" className={classes.description}>
                🌟 At Land Registry System Using Blockchain, our vision is to
                revolutionize the property ownership and verification process in
                Pakistan. We aim to provide a secure and transparent platform
                powered by blockchain technology, ensuring trust and efficiency
                in property transactions. 🏢✨
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h5" className={classes.title}>
                Our Team
              </Typography>
              <Typography variant="body2" className={classes.description}>
                🤝 The Land Registry System Using Blockchain team is composed of
                passionate individuals dedicated to transforming the real estate
                industry in Pakistan. Our team brings together expertise in real
                estate, blockchain technology, and software development. We are
                committed to delivering a user-friendly and secure platform that
                meets the needs of property owners, buyers, and sellers. 💼🚀
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <img src={land1} alt="Team" className={classes.image} />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <img src={land2} alt="Mission" className={classes.image} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h5" className={classes.title}>
                Our Mission
              </Typography>
              <Typography variant="body2" className={classes.description}>
                🚀 Our mission is to simplify and secure the property
                registration and verification process in Pakistan by leveraging
                the power of blockchain technology. By removing intermediaries,
                reducing paperwork, and ensuring the integrity of property
                records, we strive to streamline property transactions and
                protect the rights of property owners. Join us on this exciting
                journey towards a transparent and efficient real estate industry
                in Pakistan. 🏠✨
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default AboutUs;
