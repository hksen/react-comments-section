import React, { useRef } from 'react';
import './App.css';
import data from './data.json';

function Input({ comments, setComments, comment, setComment, totalLength, setTotalLength }){
  const textareaRef = useRef(null);

  const handleCommentSubmit = () => {
    const newComment = {
      id: totalLength + 1,
      content: comment,
      createdAt: '1 sec ago',
      score: 0,
      user: data.currentUser,
      replies: []
    };
    setComments([...comments, newComment]); // update comments with the new one
    setComment(''); 
    setTotalLength(totalLength + 1);
    textareaRef.current.value = ''; // Set the value of the textarea to an empty string
  };

  return (
    <div className="add-comment-wrapper">
      <div className="pdp-wrapper">
        <img  alt="profile" className="user-pdp" src={require( "" + data.currentUser.image.webp  )}></img>
      </div>
      <textarea className="write-reply" onChange={(e) => setComment(e.target.value)} type="text" placeholder="Add a comment..." autoComplete='off' ref={textareaRef}></textarea>
      <div className="send-button">
        <button className="send" onClick={handleCommentSubmit}>Send</button>
      </div>
    </div>
  )
}

export default Input;