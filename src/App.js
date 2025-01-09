import React, { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import Draggable from "react-draggable";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [deletedNotes, setDeletedNotes] = useState([]);
  const containerRef = useRef();

  const debouncedSetInput = useRef(debounce((v) => setInput(v), 30)).current;

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
    setNotes(savedNotes.map((note) => ({ ...note })));
  }, []);

  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
  }, [notes]);

  const handleInputChange = (e) => {
    debouncedSetInput(e.target.value);
  };

  const addNote = () => {
    if (input.trim() === "") return;

    const newNotePosition = calculatePosition();
    const newNote = {
      id: Date.now(),
      content: input,
      x: newNotePosition.x,
      y: newNotePosition.y,
    };
    setNotes([...notes, newNote]);
    setInput("");
  };

  const calculatePosition = () => {
    const margin = 20;
    let x = margin;
    let y = margin;

    notes.forEach((note) => {
      const noteBottom = note.y + 100; // Approximate height of a note
      const noteRight = note.x + 200; // Width of a note

      if (y < noteBottom) {
        y = noteBottom + margin;
      }

      if (x < noteRight) {
        x = noteRight + margin;
      }
    });

    return { x, y };
  };

  const checkCollision = (x, y, noteId) => {
    const noteWidth = 200;
    const noteHeight = 100;

    // Check collision with the input bar and enter button
    const inputRect = containerRef.current
      .querySelector(".input-bar")
      .getBoundingClientRect();
    if (
      x < inputRect.right &&
      x + noteWidth > inputRect.left &&
      y < inputRect.bottom &&
      y + noteHeight > inputRect.top
    ) {
      return true;
    }

    // Check collision with other notes
    for (let note of notes) {
      if (note.id !== noteId) {
        if (
          x < note.x + noteWidth &&
          x + noteWidth > note.x &&
          y < note.y + noteHeight &&
          y + noteHeight > note.y
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const updateNotePosition = (id, x, y, lastX, lastY) => {
    if (checkCollision(x, y, id)) {
      // If collision is detected, revert to the original position
      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, x: lastX, y: lastY } : note
        )
      );
    } else {
      // No collision, update the position
      setNotes(
        notes.map((note) => (note.id === id ? { ...note, x, y } : note))
      );
    }
  };

  const deleteNote = (id) => {
    const noteToDelete = notes.find((note) => note.id === id);
    setNotes(notes.filter((note) => note.id !== id));

    setDeletedNotes((prevDeletedNotes) => [
      ...prevDeletedNotes,
      {
        ...noteToDelete,
        timer: setTimeout(() => {
          setDeletedNotes((currentDeletedNotes) =>
            currentDeletedNotes.filter((note) => note.id !== id)
          );
        }, 5000),
      },
    ]);
  };

  const undoDelete = (id) => {
    const noteToRestore = deletedNotes.find((note) => note.id === id);
    if (noteToRestore) {
      setNotes([
        ...notes,
        {
          id: noteToRestore.id,
          content: noteToRestore.content,
          x: noteToRestore.x,
          y: noteToRestore.y,
        },
      ]);
      clearTimeout(noteToRestore.timer);
      setDeletedNotes(deletedNotes.filter((note) => note.id !== id));
    }
  };

  return (
    <div className="App" ref={containerRef}>
      <div className="input-bar">
        <input
          type="text"
          style={{marginRight: "10px"}}
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addNote();
            }
          }}
          placeholder="Enter a note"
        />
        <button onClick={addNote}>Enter</button>
      </div>

      {notes.map((note) => (
        <Draggable
          key={note.id}
          position={{ x: note.x, y: note.y }}
          onStart={(e, data) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onStop={(e, data) =>
            updateNotePosition(note.id, data.x, data.y, note.x, note.y)
          }
          bounds="parent"
        >
          <div className="sticky-note">
            <div className="note-content">
              {note.content}
              <span
                className="delete-button"
                onClick={() => deleteNote(note.id)}
              >
                Delete
              </span>
            </div>
          </div>
        </Draggable>
      ))}

      {deletedNotes.map((deletedNote) => (
        <button
          key={deletedNote.id}
          onClick={() => undoDelete(deletedNote.id)}
          style={{
            position: "fixed",
            bottom: "10px",
            right: `${10 + deletedNotes.indexOf(deletedNote) * 80}px`,
            padding: "10px",
            backgroundColor: "green",
            color: "white",
            cursor: "pointer",
          }}
        >
          Undo Delete "{deletedNote.content.slice(0, 10)}..."
        </button>
      ))}
      <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        learn react
      </a>
    </div>
  );
}

export default App;
