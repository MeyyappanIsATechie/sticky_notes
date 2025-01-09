import React, { useState, useEffect } from "react";

function StickyNote({ note, onDelete, onDragEnd }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    onDelete(note.id);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", note.id);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const x = e.clientX - 100; // Adjusting for cursor position
    const y = e.clientY - 20;
    onDragEnd(note.id, x, y);
  };

  return (
    <div
      className="sticky-note"
      style={{
        left: note.x,
        top: note.y,
        position: "absolute",
        width: "200px",
        backgroundColor: "yellow",
        padding: "10px",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
        cursor: "move",
      }}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pin">📌</div>
      <div>{note.content}</div>
      {isHovered && (
        <button
          onClick={handleDelete}
          style={{
            marginTop: "10px",
            padding: "5px",
            fontSize: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default StickyNote;
