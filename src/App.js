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
import { auth, db } from "./firebase";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export function App(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [new_task, setNewTask] = useState("");

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

  useEffect(() => {
    let unsubscribe;

    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("tasks")
        .onSnapshot(snapshot => {
          const updated_tasks = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            updated_tasks.push({
              text: data.text,
              checked: data.checked,
              priority: data.priority,
              id: doc.id
            });
          });
          setTasks(updated_tasks);
        });
    }

    return unsubscribe;
  }, [user]);

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

  const handleAddTask = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .add({ text: new_task, checked: false })
      .then(() => {
        setNewTask("");
      });
  };

  const handleDeleteTask = task_id => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .delete();
  };

  const handleCheckTask = (checked, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ checked: checked });
  };

  const handleChange = (priority, task_id) => {
    console.log(priority, task_id);
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ priority: priority });
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
              value={new_task}
              onChange={e => {
                setNewTask(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              disabled={new_task === ""}
            >
              Add
            </Button>
          </div>
          <div>
            <Typography variant="h6" style={{ marginTop: "30px" }}>
              Incomplete Tasks
            </Typography>
            <List>
              {tasks
                .filter(task => {
                  return task.checked === false;
                })
                .map(value => {
                  const labelId = `checkbox-list-label-${value}`;

                  return (
                    <ListItem key={value.id}>
                      <ListItemIcon>
                        <Checkbox
                          checked={value.checked}
                          onChange={(e, checked) => {
                            handleCheckTask(checked, value.id);
                          }}
                          // checked={checked.indexOf(value) !== -1}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={value.text} />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => {
                            handleDeleteTask(value.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
            </List>
          </div>

          <div>
            <Typography variant="h6" style={{ marginTop: "30px" }}>
              Completed Tasks
            </Typography>
            <List>
              {tasks
                .filter(task => {
                  return task.checked === true;
                })
                .map(value => {
                  const labelId = `checkbox-list-label-${value}`;

                  return (
                    <div>
                      <ListItem key={value.id}>
                        <ListItemIcon>
                          <Checkbox
                            checked={value.checked}
                            onChange={(e, checked) => {
                              handleCheckTask(checked, value.id);
                            }}
                            // checked={checked.indexOf(value) !== -1}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={value.text} />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => {
                              handleDeleteTask(value.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <FormControl>
                            <InputLabel htmlFor="age-native-simple">
                              Priority
                            </InputLabel>
                            <Select
                              native
                              value={value.priority}
                              onChange={e => {
                                handleChange(e.target.value, value.id);
                                console.log(value);
                              }}
                            >
                              <option value={"Low"}>Low</option>
                              <option value={"Medium"}>Medium</option>
                              <option value={"High"}>High</option>
                            </Select>
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <div></div>
                    </div>
                  );
                })}
            </List>
          </div>
        </Paper>
      </div>
    </div>
  );
}
