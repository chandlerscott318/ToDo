import React, { useState, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { auth } from "./firebase";

export function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        props.history.push("/app");
      }
      // do something
    });

    return unsubscribe;
  }, [props.history]);

  const handleSignIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {})
      .catch(error => {
        alert(error.message);
      });
  };

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Sign In
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper style={{ width: "480px", marginTop: "50px", padding: "30px" }}>
          <TextField
            placeholder={"Email"}
            fullWidth={true}
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            type={"password"}
            placeholder="Password"
            fullWidth={true}
            style={{ marginTop: "30px" }}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "30px"
            }}
          >
            <Typography>
              Don't have an account? <Link to="/signup">Sign up!</Link>
            </Typography>
            <Button color="primary" variant="contained" onClick={handleSignIn}>
              Sign in
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
}

export function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        props.history.push("/app");
      }
      // do something
    });

    return unsubscribe;
  }, [props.history]);

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {})
      .catch(error => {
        alert(error.message);
      });
  };

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Sign Up
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper style={{ width: "480px", marginTop: "50px", padding: "30px" }}>
          <TextField
            placeholder={"Email"}
            fullWidth={true}
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            type={"password"}
            placeholder="Password"
            fullWidth={true}
            style={{ marginTop: "30px" }}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "30px"
            }}
          >
            <Typography>
              Already have an account? <Link to="/">Sign in!</Link>
            </Typography>
            <Button color="primary" variant="contained" onClick={handleSignUp}>
              Sign up
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
}

export function App(props) {
  const [drawer_open, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            My App
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawer_open}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <List>
          <ListItem button>
            <ListItemText primary="Home" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
