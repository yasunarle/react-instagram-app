import React, { useState, useEffect } from "react"
import { Modal, makeStyles, Button, Input } from "@material-ui/core"
// CSS
import "./App.css"
// components
import Post from "./components/Post"
import ImageUpLoad from "./components/ImageUpLoad"
// Plugins
import { db, auth } from "./plugins/firebase"

function getModalStyle() {
  const top = 50
  const left = 50
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

function App() {
  // For modal
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  // Posts
  const [posts, setPosts] = useState([])
  // For sign up
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassWord] = useState("")
  // Auth state
  const [user, setUser] = useState(null)

  // Function
  const signUp = (event) => {
    event.preventDefault()
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName,
        })
      })
      .catch((error) => {
        alert(error.message)
      })
  }
  const signIn = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email, password).catch((err) => {
      alert(err.message)
    })
    setOpenSignIn(false)
  }

  // User state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser)
        if (authUser.displayName) {
        } else {
          return authUser.updateProfile({
            displayName: userName,
          })
        }
      } else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [user, userName])
  // Posts listener
  useEffect(() => {
    // this is run when this page created...
    db.collection("posts")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      })
  }, [])

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
            />
            <Button onClick={signUp}>Login</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signIn">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
            />
            <Button onClick={signIn}>Login</Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button type="submit" onClick={() => auth.signOut()}>
            Log out
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button type="submit" onClick={() => setOpen(true)}>
              Sign up
            </Button>
            <Button type="submit" onClick={() => setOpenSignIn(true)}>
              Log in
            </Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        {posts.map((post) => (
          <Post
            key={post.id}
            userName={post.userName}
            imageUrl={post.imageUrl}
            caption={post.caption}
          />
        ))}
      </div>
      <div>
        {user?.displayName ? (
          <ImageUpLoad userName={user.displayName} />
        ) : (
          <h3>Sorry you need to login to upload</h3>
        )}
      </div>
    </div>
  )
}

export default App
