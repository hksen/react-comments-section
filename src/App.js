import React, { useState, useEffect } from 'react';
import './App.css';
import Comment from './Comments';
import Input from './Input';
import data from './data.json';
import Delete from './Delete';
import Replies from './Replies';

function App() {
  const [deleteBlock, showDeleteBlock] = useState('');
  const [replyingTo, setReplyingTo] = useState({});
  const [replyTo, setReplyTo] = useState('');

  const [isUpdating, setIsUpdating] = useState({});

  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('comments');
    return savedComments ? JSON.parse(savedComments) : data.comments;
  });
  const [comment, setComment] = useState('');

  const [score, setScore] = useState({});

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const updateScore = (id, newScore, symbol) => {
    setComments(prevComments => {
      const updatedComments = prevComments.map(comment => {
        if (comment.id === id) {
          if (!score[id] || (score[id] && score[id] !== symbol)) { // Check if user hasn't set the score or has set a different score before
            if(symbol === "+"){
              setScore({...score, [id]: '+'}); // Update the score state for the comment
              return {
                ...comment,
                score: newScore + 1
              };
            } else if(symbol === '-'){
              setScore({...score, [id]: '-'}); // Update the score state for the comment
              return {
                ...comment,
                score: newScore - 1
              };
            }
          }
  
        } else if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === id) {
              if (!score[id] || (score[id] && score[id] !== symbol)) { // Check if user hasn't set the score or has set a different score before
                if(symbol === '+'){
                  setScore({...score, [id]: '+'}); // Update the score state for the reply
                  return {
                    ...reply,
                    score: newScore + 1
                  };
                } else if(symbol === '-'){
                  setScore({...score, [id]: '-'}); // Update the score state for the reply
                  return {
                    ...reply,
                    score: newScore - 1
                  };
                }
              }
            }
            return reply;
          });
          return {
            ...comment,
            replies: updatedReplies
          };
        }
        return comment;
      });
      return updatedComments;
    });
  }

  const totalCommentsLength = comments.reduce((acc, cur) => {
    if (cur.id > acc) {
      acc = cur.id;
    }
    if (cur.replies) {
      const maxReplyId = cur.replies.reduce((replyAcc, replyCur) => {
        if (replyCur.id > replyAcc) {
          replyAcc = replyCur.id;
        }
        return replyAcc;
      }, 0);
      if (maxReplyId > acc) {
        acc = maxReplyId;
      }
    }
    return acc;
  }, 0);

  const [totalLength, setTotalLength] = useState(totalCommentsLength);


  const isCurrentUser = (commentUser, currentUser) => {
    return commentUser === currentUser;
  };

  const handleDeleteClick = (id) => {
    showDeleteBlock(id);
  }

  const cancelDelete = () => {
    showDeleteBlock(false);
  }

  const handleEdit = (id, editValue, replyT) => {
    const newEditContent = editValue.replace(`@${replyT} `, '')
    setComments(prevComments => {
      const updatedComments = prevComments.map(comment => {
        if (comment.id === id) {
          return {
            ...comment,
            content: newEditContent
          };
        } else if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === id) {
              return {
                ...reply,
                content: newEditContent
              };
            }
            return reply;
          });
          return {
            ...comment,
            replies: updatedReplies
          };
        }
        return comment;
      });
      return updatedComments;
    });

    setIsUpdating(false);
  };

const handleDelete = (id) => {
  setComments(prevComments => {
    let updatedComments = [...prevComments];
    let commentToDelete = updatedComments.find(comment => comment.id === id);
    
    if (commentToDelete) {
      // Delete the comment
      updatedComments = updatedComments.filter(comment => comment.id !== id);
    } else {
      // Try to find the reply
      let parentComment = updatedComments.find(comment => comment.replies && comment.replies.some(reply => reply.id === id));
      
      if (parentComment) {
        // Delete the reply
        parentComment.replies = parentComment.replies.filter(reply => reply.id !== id);
      }
    }
    
    return updatedComments;
  });
  
  showDeleteBlock(false);
}

  const handleReply = (commentId, content) => {
    const newContent = content.replace(`@${replyTo} `, '')
    const reply = {
      id: totalLength + 1,
      content: newContent,
      createdAt: `1 sec ago`,
      user: {
        image: {
          webp: data.currentUser.image.webp,
        },
        username: data.currentUser.username
      },
      replyingTo: replyTo,
      score: 0
    };
    setComments(prevComments => {
      const updatedComments = prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply]
          };
        }
        return comment;
      });
      return updatedComments;
    });
    setTotalLength(totalLength + 1);
    setReplyingTo('');
  };

  const isCurrent = (replyUser, currentUser) => {
    return replyUser === currentUser;
  };


  return (
    <div className="App">
      <div className="wrapper">
        {deleteBlock ? <Delete key={4} cancelDelete={cancelDelete} handleDelete={handleDelete} deleteBlock={deleteBlock} /> : null}
        <div className="content-wrapper">
        {comments.map(comment => (
          <div key={comment.id} className="comment-wrapper">
        <Comment
          key={`comment-${comment.id}`}
          id={comment.id}
          content={comment.content}
          createdAt={comment.createdAt}
          score={comment.score}
          updateScore={updateScore}
          username={comment.user.username}
          pdp={comment.user.image.webp}
          replies={comment.replies}
          isCurrentUser={isCurrentUser(comment.user.username, data.currentUser.username)}
          handleDeleteClick={handleDeleteClick} // open the delete block
          handleReply={handleReply} // reply 
          setReplyTo={setReplyTo}
          replyTo={replyTo} // for the @
          replyingTo={replyingTo} 
          setReplyingTo={setReplyingTo} // reply or comment id 
          handleEdit={handleEdit} // edit 
          isUpdating={isUpdating} // open the update block
          setIsUpdating={setIsUpdating}
        >
        </Comment>
        {comment.replies.length > 0 && 
        <div className="reply-wrapper">
            <div className="bar-wrapper">
                <div className="bar"></div>
            </div>
            <div key={`reply-content-${comment.id}`} className="reply-content">
                {comment.replies.map(reply => (
                <Replies
                key={`reply-${reply.id}`}
                id={reply.id}
                replyContent={reply.content}
                replyCreatedAt={reply.createdAt}
                replyScore={reply.score}
                updateScore={updateScore}
                replyUsername={reply.user.username}
                replyTo={reply.replyingTo}
                setReplyTo={setReplyTo}
                rePdp={reply.user.image.webp}
                isCurrent={isCurrent(reply.user.username, data.currentUser.username)}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo} // reply or comment id 
                handleDeleteClick={handleDeleteClick} // open the delete block
                handleReply={handleReply} // reply 
                commentId={comment.id} // comment id for the new reply 
                handleEdit={handleEdit} // edit 
                isUpdating={isUpdating} // open the update block
                setIsUpdating={setIsUpdating}

                />
                ))}
            </div>
        </div>
}
        </div>
      ))}

      <Input key={3} comments={comments} setComments={setComments} comment={comment} setComment={setComment} totalLength={totalLength} setTotalLength={setTotalLength} />
        </div>

      </div>
    </div>
  );
}

export default App;
