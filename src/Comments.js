import React, { useState } from 'react';
import './App.css';
import Images from './Images';
import data from './data.json';

function Comment({ id, content, createdAt, score, updateScore, username, pdp, replies, isCurrentUser, handleDeleteClick, handleReply, setReplyTo, replyTo, replyingTo, setReplyingTo, handleEdit, isUpdating, setIsUpdating}){

    const [inputValue, setInputValue] = useState();

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
    };

      const handleReplyClick = (id, username) => {
        setReplyTo(username)
        setInputValue(`@${username} `)
        setReplyingTo((prevState) => {
          if (prevState[id]) {
            // Comment is already open, so close it
            const newState = { ...prevState };
            delete newState[id];
            return newState;
          } else {
            // Comment is not open, so open it
            return { ...prevState, [id]: true };
          }
        });
      };

      const handleEditClick = (id) => {
        setInputValue(`${content}`)
        setIsUpdating((prevState) => {
          if (prevState[id]) {
            const newState = { ...prevState };
            delete newState[id];
            return newState;
          } else {
            return { ...prevState, [id]: true };
          }
        });
      };

    return (
<div className={`comment-container ${replies.length !== 0 && (!replyingTo && !Object.keys(replyingTo).includes(id.toString())) ? 'margin20' : (replyingTo && replyingTo[id]) ? '' : 'margin20'}`}>
  <div className={`${replies.length !== 0 && (!replyingTo && !Object.keys(replyingTo).includes(id.toString())) ? 'comment' : (replyingTo && replyingTo[id]) ? 'comment margin8' : isUpdating[id] ? 'comment-update' : 'comment'}`}>
            <div className="number">
                <p className="plus" onClick={() => updateScore(id, score, '+')}>+</p>
                <p className="number-p">{score}</p>
                <p className="minus" onClick={() => updateScore(id, score, '-')}>-</p>
            </div>
                    <div className="info-nd-date">
                        <img alt="profile" className="pdp" src={require( "" + pdp  )}></img>
                        {isCurrentUser ? (
                            <div className="you-button">
                                <h4>{username}</h4>
                                <button type="disabled" className="you">you</button>
                            </div>
                        ) : (
                            <h4>{username}</h4>
                        )}
                        <p>{createdAt}</p>
                    </div>
                    {isCurrentUser ? (
                        <div className="edit-nd-delete">
                            <div className="edit-delete-wrapper" onClick={() => handleDeleteClick(id)}>
                                <img alt="reply" className="reply-img" src={Images.delete}></img>
                                <h3 className="delete">Delete</h3>
                            </div>
                            <div className="edit-delete-wrapper" onClick={() => handleEditClick(id, username)}>
                                <img alt="reply" className="reply-img" src={Images.edit}></img>
                                <h3 className="edit">Edit</h3>
                            </div>
                        </div>
                    ) : (
                    <div className="reply" onClick={() => handleReplyClick(id, username)}>
                            <img alt="reply" className="reply-img" src={Images.reply}></img>
                            <h3>Reply</h3>
                    </div>
                    )}
                    {isUpdating[id] ? (
                        <textarea className="update-reply" type="text" placeholder="Add a comment..." value={inputValue} onChange={handleInputChange} autoComplete='off'></textarea>
                    ) : (
                        <p className="content">{content}</p>
                    )}

                {isUpdating[id] ? (
                        <div className="update-button">
                            <button className="send" onClick={() => handleEdit(id, inputValue, replyTo)}>Update</button>
                        </div>
                    ) : null}
        </div>
        {replyingTo[id] ? (
                    <div className="add-reply-wrapper">
                    <div className="pdp-wrapper">
                        <img  alt="profile" className="user-pdp" src={require( "" + data.currentUser.image.webp  )}></img>
                    </div>
                    <textarea className="write-reply" type="text" value={inputValue} onChange={handleInputChange} autoComplete='off'></textarea>
                    <div className="send-button">
                        <button className="send" onClick={() => handleReply(id, inputValue)}>Reply</button>
                    </div>
                </div>
        ) : null}

        </div>
    )
}

export default Comment; 