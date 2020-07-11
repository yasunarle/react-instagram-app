import React, { useState } from "react"
import firebase from "firebase"
import { Button } from "@material-ui/core"
// CSS
import "./ImageUpLoad.css"
// Plugins
import { db, storage } from "../plugins/firebase"

function ImageUpLoad({ userName }) {
  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState("")
  const [progress, setProgress] = useState(0)

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0])
    }
  }
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },
      (err) => {
        console.log(err)
        alert(err.message)
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection("posts").add({
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              imageUrl: url,
              caption: caption,
              userName: userName,
            })
            setProgress(0)
            setCaption("")
            setImage(null)
          })
      }
    )
  }

  return (
    <div className="image-upload">
      <progress className="image-upload__progress" value={progress} max="100" />
      <input
        type="text"
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        placeholder="Enter a caption..."
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload} color="primary">
        Upload
      </Button>
    </div>
  )
}

export default ImageUpLoad
