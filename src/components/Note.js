import React, { useState } from 'react';
import { FaCopy, FaEdit, FaTrash, FaThumbtack } from 'react-icons/fa';

const Note = ({ note, onDelete, onEdit, onPin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(note.id, content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(note.id);
  };

  const handlePin = () => {
    onPin(note.id);
  };

  return (
    <div className="note" style={{ position: 'absolute', top: note.y, left: note.x }}>
      <div className="note-content">
        {isEditing ? (
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        ) : (
          <p>{note.content}</p>
        )}
      </div>
      <div className="note-actions">
        <FaCopy onClick={handleCopy} />
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <FaEdit onClick={handleEdit} />
        )}
        <FaTrash onClick={handleDelete} />
        <FaThumbtack onClick={handlePin} />
      </div>
    </div>
  );
};

export default Note;