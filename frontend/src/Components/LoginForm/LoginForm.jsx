import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    marginTop: theme.spacing(1),
    width: "100%"
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  customError: {
    color: "red",
    fontSize: "0.8em",
    marginTop: 10
  },
  progress: {
    position: "absolute"
  }
});

const LoginForm = props => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState("");
  
  const { classes } = props;

  return (
    <Container>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            helperText={errors.email}
            error={errors.email ? true : false}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="current-password"
            type="password"
            helperText={errors.password}
            error={errors.password ? true : false}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading || !email || !password}
          >
            Sign In
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <Grid container>
            <Grid item>
              <Link href="signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
          {
            errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )
          }
        </form>
      </div>
    </Container>
  );
};

export default withStyles(styles)(LoginForm);
