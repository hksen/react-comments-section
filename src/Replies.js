import React, { useState } from 'react';
import './App.css';
import Images from './Images';
import data from './data.json';

function Replies({ id, replyContent, replyCreatedAt, replyScore, updateScore, replyUsername, replyTo, setReplyTo, rePdp, isCurrent,  replyingTo, setReplyingTo, handleDeleteClick, handleReply, commentId, handleEdit, isUpdating, setIsUpdating }){
    
    // HANDLE THE INPUT 
    const [inputValue, setInputValue] = useState();

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
    };


    // OPEN THE REPLY INPUT
    const handleReplyClick = (id) => {
        setReplyTo(replyUsername)
        setInputValue(`@${replyUsername} `)
        setReplyingTo((prevState) => {
          if (prevState[id]) {
            const newState = { ...prevState };
            delete newState[id];
            return newState;
          } else {
            return { ...prevState, [id]: true };
          }
        });
      };

      // OPEN THE EDIT TEXTAREA
      const handleEditClick = (id) => {
        setInputValue(`@${replyTo} ${replyContent}`)
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
        <div className="reply-block comment-container">
            <div className={`${isUpdating[id] ? 'comment-update' : 'reply-block-wrapper comment'}`}>
        <div className="number">
            <p className="plus" onClick={() => updateScore(id, replyScore, '+')}>+</p>
            <p className="number-p">{replyScore}</p>
            <p className="minus" onClick={() => updateScore(id, replyScore, '-')}>-</p>
        </div>
                    <div className="info-nd-date">
                        <img alt="profile" className="pdp" src={require( "" + rePdp  )}></img>
                        {isCurrent ? (
                            <div className="you-button">
                                <h4>{replyUsername}</h4>
                                <button type="disabled" className="you">you</button>
                            </div>
                        ) : (
                            <h4>{replyUsername}</h4>
                        )}
                        
                        <p>{replyCreatedAt}</p>
                    </div>
                    {isCurrent ? (
                        <div className="edit-nd-delete">
                            <div className="edit-delete-wrapper" onClick={() => handleDeleteClick(id)}>
                                <img alt="reply" className="reply-img" src={Images.delete}></img>
                                <h3 className="delete">Delete</h3>
                            </div>
                            <div className="edit-delete-wrapper" onClick={() => handleEditClick(id, replyUsername)}>
                                <img alt="reply" className="reply-img" src={Images.edit}></img>
                                <h3 className="edit">Edit</h3>
                            </div>
                        </div>
                        ) : (
                        <div className="reply" onClick={() => handleReplyClick(id, replyUsername)}>
                            <img alt="reply" className="reply-img" src={Images.reply}></img>
                            <h3>Reply</h3>
                        </div>
                        )}
                {isUpdating[id] ? (
                        <textarea className="update-reply" type="text" placeholder="Add a comment..." value={inputValue} onChange={handleInputChange} autoComplete='off'></textarea>
                    ) : (
                        <p className="content"><span className="reply-to">@{replyTo} </span>{replyContent}</p>
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
                    <button className="send" onClick={() => handleReply(commentId, inputValue)}>Reply</button>
                </div>
            </div>
        ) : null}
    </div>
    )
}

export default Replies; 