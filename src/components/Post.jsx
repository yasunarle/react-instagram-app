import React, { useState, useEffect } from "react"
import { Avatar } from "@material-ui/core"
import firebase from "firebase"
// CSS
import "./Post.css"
// Plugins
import { db } from "../plugins/firebase"

function Post({ userName, imageUrl, caption, postId, user }) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")

  useEffect(() => {
    let unsubscribe
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timeStamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()))
        })
    }
    return () => {
      unsubscribe()
    }
  }, [postId])

  const postComment = (event) => {
    event.preventDefault()
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      userName: user.displayName,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setComment("")
  }

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="yasunari"
          src="https://i.ytimg.com/vi/8dkGmPprlWM/maxresdefault.jpg"
        />
        <h3>{userName}</h3>
      </div>

      <img className="post__image" src={imageUrl} alt="" />
      <h4 className="post__text">
        <strong>{userName}</strong>
        {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.userName}</strong> {comment.text}
          </p>
        ))}
      </div>

      <form className="post__commentBox">
        <input
          className="post__input"
          type="text"
          placeholder="add a comment..."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
          }}
        />
        <button
          className="post__button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default Post
