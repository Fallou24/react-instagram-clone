import React, { useState } from "react";
import "./modifyPost.css";
import CloseIcon from "@mui/icons-material/Close";
import { doc, updateDoc } from "firebase/firestore";
import { bdd } from "../../firebase-config";

const ModifyPost = ({post,closeModal}) => {
  
  const [legend, setLegend] = useState(post.legend);
  const handleUpdate = async() =>{
    closeModal(false)
    await updateDoc(doc(bdd,"userPosts",post.id),{
      legend
    })
  }

  return (
    <div className="createPost" onClick={()=>closeModal(false)}>
      <div className="modifyPostContainer" onClick={(e) => e.stopPropagation()}>
        <h3 className="createPostTitle">Modifier la publication publication</h3>
        <>
        <img src={post.imageURL} alt="" className="fileChoosen" />
          <input
            type="textarea"
            placeholder="Ajouter une légende"
            className="legendInput"
            value={legend}
            onChange={(e) => setLegend(e.target.value)}
            required
          />
          <button className="shareBtn" onClick={handleUpdate}>Modifier</button>
        </>
      </div>
      <span className="closeIcon">
        <CloseIcon sx={{ fontSize: 30 }} />
      </span>
    </div>
  );
};

export default ModifyPost;
