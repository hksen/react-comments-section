import React from 'react'; 

function Delete({ cancelDelete, handleDelete, deleteBlock}){
    return (
        <div className="delete-wrapper">
        <div className="delete-background"></div>
        <div className="delete-container">
          <h2>Delete comment</h2>
          <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
          <div className="button-wrapper">
            <button className="cancel" onClick={cancelDelete}>No, cancel</button>
            <button className="yes" onClick={() => handleDelete(deleteBlock)}>Yes, delete</button>
          </div>
        </div>
      </div>
    )
}

export default Delete;