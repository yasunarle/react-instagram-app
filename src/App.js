import React from "react"
// CSS
import "./App.css"
// components
import Post from "./components/Post"

function App() {
  const userName = "yasunari"
  const imageUrl = "https://i.ytimg.com/vi/8dkGmPprlWM/maxresdefault.jpg"
  const caption = "caption..."
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
      <Post userName={userName} imageUrl={imageUrl} caption={caption} />
    </div>
  )
}

export default App
