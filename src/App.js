import React, { useState } from "react"
// CSS
import "./App.css"
// components
import Post from "./components/Post"

function App() {
  const [posts, setPosts] = useState([
    {
      userName: "yasunari",
      imageUrl: "https://i.ytimg.com/vi/8dkGmPprlWM/maxresdefault.jpg",
      caption: "caption...",
    },
  ])

  return (
    <div className="app">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
      </div>
      {/* Post List */}
      {posts.map((post) => (
        <Post
          userName={post.userName}
          imageUrl={post.imageUrl}
          caption={post.caption}
        />
      ))}
    </div>
  )
}

export default App
