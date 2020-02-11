import React, { useState, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  AppBar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  Paper,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { auth } from "./firebase";

export function App(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([
    { id: 1, text: "some task", checked: false },
    { id: 2, text: "another task", checked: true }
  ]);

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
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            To Do List
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <Paper style={{ padding: "30px", width: "700px" }}>
          <Typography variant="h6">To Do List</Typography>
          <div style={{ display: "flex", marginTop: "30px" }}>
            <TextField
              fullWidth={true}
              placeholder="Add a new task here"
              style={{ marginRight: "30px" }}
            />
            <Button variant="contained" color="primary">
              Add
            </Button>
          </div>

          <List>
            {tasks.map(value => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={value.id}>
                  <ListItemIcon>
                    <Checkbox
                      checked={value.checked}
                      // checked={checked.indexOf(value) !== -1}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.text} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="comments">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </div>
    </div>
  );
}
