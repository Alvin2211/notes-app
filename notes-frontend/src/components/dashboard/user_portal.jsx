// // UserPortal.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import './UserPortal.css';
// import { Plus, Trash2, Edit3, Sun, Moon, LogOut } from 'lucide-react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const NoteTab = ({ note, isActive, onSelect, onDelete, onRename }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [tempTitle, setTempTitle] = useState(note.title);

//   useEffect(() => {
//     setTempTitle(note.title);
//   }, [note.title]);

//   const finishRename = () => {
//     const trimmed = tempTitle.trim() || 'Untitled';
//     onRename(note.id, trimmed);
//     setIsEditing(false);
//   };

//   const handleKey = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       finishRename();
//     } else if (e.key === 'Escape') {
//       setTempTitle(note.title);
//       setIsEditing(false);
//     }
//   };

//   return (
//     <li
//       className={`note-tab ${isActive ? 'active' : ''}`}
//       onClick={() => !isEditing && onSelect(note)}
//     >
//       <div className="title-wrapper">
//         {isEditing ? (
//           <input
//             className="title-input"
//             value={tempTitle}
//             onChange={(e) => setTempTitle(e.target.value)}
//             onBlur={finishRename}
//             onKeyDown={handleKey}
//             autoFocus
//           />
//         ) : (
//           <span className="note-title">{note.title}</span>
//         )}
//       </div>
//       <div className="tab-actions">
//         <button
//           className="icon-btn rename-btn"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsEditing(true);
//           }}
//           aria-label="Rename note"
//           title="Rename note"
//         >
//           <Edit3 size={14} />
//         </button>
//         <button
//           className="icon-btn delete-btn"
//           onClick={(e) => {
//             e.stopPropagation();
//             onDelete(note.id);
//           }}
//           aria-label="Delete note"
//           title="Delete note"
//         >
//           <Trash2 size={16} />
//         </button>
//       </div>
//     </li>
//   );
// };

// const UserPortal = () => {
//   const [notes, setNotes] = useState([]);
//   const [activeNoteId, setActiveNoteId] = useState(null);
//   const [noteContent, setNoteContent] = useState('');
//   const [nextUntitled, setNextUntitled] = useState(1);
//   const [isDark, setIsDark] = useState(false);
//   const [isRenaming, setIsRenaming] = useState(false);
//   const [tempTitle, setTempTitle] = useState('');
//   const location = useLocation();
//   const navigate = useNavigate();
//   const userName = location.state?.name || 'Guest';

//   // apply theme attribute
//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
//   }, [isDark]);

//   // sync navbar temp title when active note changes
//   useEffect(() => {
//     const active = notes.find((n) => n.id === activeNoteId);
//     if (active) {
//       setTempTitle(active.title);
//     } else {
//       setIsRenaming(false);
//     }
//   }, [activeNoteId, notes]);

//   const addNote = useCallback(() => {
//     const newNote = {
//       id: Date.now(),
//       title: `Untitled ${nextUntitled}`,
//       content: ''
//     };
//     setNotes((prev) => [...prev, newNote]);
//     setActiveNoteId(newNote.id);
//     setNoteContent('');
//     setNextUntitled((n) => n + 1);
//     setIsRenaming(false);
//   }, [nextUntitled]);

//   const deleteNote = useCallback(
//     (id) => {
//       setNotes((prev) => prev.filter((note) => note.id !== id));
//       if (activeNoteId === id) {
//         setActiveNoteId(null);
//         setNoteContent('');
//       }
//       setIsRenaming(false);
//     },
//     [activeNoteId]
//   );

//   const handleNoteClick = useCallback((note) => {
//     setActiveNoteId(note.id);
//     setNoteContent(note.content);
//     setIsRenaming(false);
//   }, []);

//   const handleContentChange = useCallback(
//     (e) => {
//       const val = e.target.value;
//       setNoteContent(val);
//       setNotes((prev) =>
//         prev.map((note) =>
//           note.id === activeNoteId ? { ...note, content: val } : note
//         )
//       );
//     },
//     [activeNoteId]
//   );

//   const renameNote = useCallback(
//     (id, newTitle) => {
//       setNotes((prev) =>
//         prev.map((note) => (note.id === id ? { ...note, title: newTitle } : note))
//       );
//       if (id === activeNoteId) {
//         setTempTitle(newTitle);
//       }
//     },
//     [activeNoteId]
//   );

//   const startNavbarRename = () => {
//     if (!activeNoteId) return;
//     setIsRenaming(true);
//   };

//   const finishNavbarRename = () => {
//     const trimmed = tempTitle.trim() || 'Untitled';
//     renameNote(activeNoteId, trimmed);
//     setIsRenaming(false);
//   };

//   const handleNavbarKey = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       finishNavbarRename();
//     } else if (e.key === 'Escape') {
//       const active = notes.find((n) => n.id === activeNoteId);
//       setTempTitle(active ? active.title : '');
//       setIsRenaming(false);
//     }
//   };

//   const activeNote = notes.find((n) => n.id === activeNoteId);

//   const handleLogout = () => {
//     // clear any client-side state if needed
//     // e.g., localStorage.removeItem('user_notes');
//     navigate('/');
//   };

//   return (
//     <div className="user-portal">
//       <aside className="sidebar">
//         <div className="note-tab-container">
//           <span className="header-label">All Notes</span>
//           <div className="add-note-btn" onClick={addNote} aria-label="Add note" title="Add note">
//             <Plus size={24} />
//           </div>
//         </div>
//         <ul className="note-tabs">
//           {notes.map((note) => (
//             <NoteTab
//               key={note.id}
//               note={note}
//               isActive={note.id === activeNoteId}
//               onSelect={handleNoteClick}
//               onDelete={deleteNote}
//               onRename={renameNote}
//             />
//           ))}
//         </ul>
//       </aside>
//       <main className="note-editor">
//         <div className="editor-navbar">
//           <div className="note-title-display" style={{ minWidth: 0 }}>
//             {activeNoteId ? (
//               isRenaming ? (
//                 <input
//                   className="title-input"
//                   value={tempTitle}
//                   onChange={(e) => setTempTitle(e.target.value)}
//                   onBlur={finishNavbarRename}
//                   onKeyDown={handleNavbarKey}
//                   autoFocus
//                   style={{ width: '200px' }}
//                 />
//               ) : (
//                 <div>{activeNote?.title || 'Untitled'}</div>
//               )
//             ) : (
//               <div>Welcome {userName} !!</div>
//             )}
//           </div>
//           <div className="navbar-actions">
            

//             {activeNoteId && (
//               <>
//                 <button
//                   className="icon-btn rename-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     startNavbarRename();
//                   }}
//                   aria-label="Rename note"
//                   title="Rename note"
//                 >
//                   <Edit3 size={18} />
//                 </button>
//                 <button
//                   className="icon-btn delete-btn-navbar"
//                   onClick={() => deleteNote(activeNoteId)}
//                   aria-label="Delete current note"
//                   title="Delete note"
//                 >
//                   <Trash2 size={18} />
//                 </button>

//               </>
              
//             )}

//             <button
//               className="icon-btn theme-toggle"
//               onClick={() => setIsDark((d) => !d)}
//               aria-label="Toggle theme"
//               title="Change theme"
//             >
//               {isDark ? <Sun size={18} /> : <Moon size={18} />}
//             </button>

//             <button
//               className="icon-btn logout-btn"
//               onClick={handleLogout}
//               aria-label="Logout"
//               title="Logout"
//             >
//               <LogOut size={18} />
//             </button>
//           </div>
//         </div>

//         {activeNoteId ? (
//           <textarea
//             className="note-textarea"
//             value={noteContent}
//             onChange={handleContentChange}
//             placeholder="Start writing your note..."
//           />
//         ) : (
//           <div className="empty-editor">
//             Select or create a note to get started
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default UserPortal;



// UserPortal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './UserPortal.css';
import { Plus, Trash2, Edit3, Sun, Moon, LogOut, Save } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNotes, saveNote, createNote, deleteNote } from './utils/api';

const NoteTab = ({ note, isActive, onSelect, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(note.title);

  useEffect(() => {
    setTempTitle(note.title);
  }, [note.title]);

  const finishRename = () => {
    const trimmed = tempTitle.trim() || 'Untitled';
    onRename(note.id, trimmed);
    setIsEditing(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishRename();
    } else if (e.key === 'Escape') {
      setTempTitle(note.title);
      setIsEditing(false);
    }
  };

  return (
    <li
      className={`note-tab ${isActive ? 'active' : ''}`}
      onClick={() => !isEditing && onSelect(note)}
    >
      <div className="title-wrapper">
        {isEditing ? (
          <input
            className="title-input"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={finishRename}
            onKeyDown={handleKey}
            autoFocus
          />
        ) : (
          <span className="note-title">{note.title}</span>
        )}
      </div>
      <div className="tab-actions">
        <button
          className="icon-btn rename-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          aria-label="Rename note"
          title="Rename note"
        >
          <Edit3 size={14} />
        </button>
        <button
          className="icon-btn delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          aria-label="Delete note"
          title="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
};

const UserPortal = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [nextUntitled, setNextUntitled] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [dirty, setDirty] = useState(false); // track if current note is changed but not saved
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.name || 'Guest';

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
        if (data.length) {
          setActiveNoteId(data[0].id);
          setNoteContent(data[0].content);
          setNextUntitled(
            data.reduce((max, note) => {
              const match = note.title.match(/^Untitled (\d+)$/);
              return match ? Math.max(max, Number(match[1]) + 1) : max;
            }, 1)
          );
        }
      } catch (error) {
        console.error("Failed to fetch notes", error);
      }
    };
    fetchNotes();
  }, []);

  // Sync navbar temp title when active note changes
  useEffect(() => {
    const active = notes.find((n) => n.id === activeNoteId);
    if (active) {
      setTempTitle(active.title);
      setNoteContent(active.content);
      setDirty(false);
    } else {
      setIsRenaming(false);
      setNoteContent('');
      setDirty(false);
    }
  }, [activeNoteId, notes]);

  const addNote = useCallback(async () => {
    const newNote = {
      title: `Untitled ${nextUntitled}`,
      content: '',
    };

    try {
      const created = await createNote(newNote);
      setNotes((prev) => [...prev, created]);
      setActiveNoteId(created.id);
      setNoteContent('');
      setNextUntitled((n) => n + 1);
      setIsRenaming(false);
      setDirty(false);
    } catch (error) {
      console.error("Failed to create note", error);
    }
  }, [nextUntitled]);

  const deleteNoteById = useCallback(async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      if (activeNoteId === id) {
        setActiveNoteId(null);
        setNoteContent('');
      }
      setIsRenaming(false);
      setDirty(false);
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  }, [activeNoteId]);

  const handleNoteClick = useCallback((note) => {
    if (dirty) {
      if (!window.confirm("You have unsaved changes. Continue without saving?")) {
        return;
      }
    }
    setActiveNoteId(note.id);
    setNoteContent(note.content);
    setIsRenaming(false);
    setDirty(false);
  }, [dirty]);

  const handleContentChange = useCallback((e) => {
    const val = e.target.value;
    setNoteContent(val);
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNoteId ? { ...note, content: val } : note
      )
    );
    setDirty(true);
  }, [activeNoteId]);

  const renameNote = useCallback(
    (id, newTitle) => {
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, title: newTitle } : note))
      );
      if (id === activeNoteId) {
        setTempTitle(newTitle);
        setDirty(true);
      }
    },
    [activeNoteId]
  );

  const startNavbarRename = () => {
    if (!activeNoteId) return;
    setIsRenaming(true);
  };

  const finishNavbarRename = () => {
    const trimmed = tempTitle.trim() || 'Untitled';
    renameNote(activeNoteId, trimmed);
    setIsRenaming(false);
  };

  const handleNavbarKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishNavbarRename();
    } else if (e.key === 'Escape') {
      const active = notes.find((n) => n.id === activeNoteId);
      setTempTitle(active ? active.title : '');
      setIsRenaming(false);
    }
  };

  const handleSave = async () => {
    const active = notes.find((n) => n.id === activeNoteId);
    if (!active) return;

    try {
      await saveNote(activeNoteId, { title: active.title, content: noteContent });
      setDirty(false);
      alert("Note saved!");
    } catch (error) {
      console.error("Failed to save note", error);
      alert("Failed to save note. Please try again.");
    }
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleLogout = () => {
    // clear client-side state if needed
    navigate('/');
  };

  return (
    <div className="user-portal">
      <aside className="sidebar">
        <div className="note-tab-container">
          <span className="header-label">All Notes</span>
          <div className="add-note-btn" onClick={addNote} aria-label="Add note" title="Add note">
            <Plus size={24} />
          </div>
        </div>
        <ul className="note-tabs">
          {notes.map((note) => (
            <NoteTab
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onSelect={handleNoteClick}
              onDelete={deleteNoteById}
              onRename={renameNote}
            />
          ))}
        </ul>
      </aside>
      <main className="note-editor">
        <div className="editor-navbar">
          <div className="note-title-display" style={{ minWidth: 0 }}>
            {activeNoteId ? (
              isRenaming ? (
                <input
                  className="title-input"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={finishNavbarRename}
                  onKeyDown={handleNavbarKey}
                  autoFocus
                  style={{ width: '200px' }}
                />
              ) : (
                <div>{activeNote?.title || 'Untitled'}</div>
              )
            ) : (
              <div>Welcome {userName} !!</div>
            )}
          </div>
          <div className="navbar-actions">
            {activeNoteId && (
              <>
                <button
                  className="icon-btn save-btn"
                  onClick={handleSave}
                  disabled={!dirty}
                  aria-label="Save note"
                  title="Save note"
                >
                  <Save size={18} />
                </button>
                <button
                  className="icon-btn rename-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startNavbarRename();
                  }}
                  aria-label="Rename note"
                  title="Rename note"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  className="icon-btn delete-btn-navbar"
                  onClick={() => {
                    if (window.confirm("Delete this note?")) {
                      deleteNoteById(activeNoteId);
                    }
                  }}
                  aria-label="Delete current note"
                  title="Delete note"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button
              className="icon-btn theme-toggle"
              onClick={() => setIsDark((d) => !d)}
              aria-label="Toggle theme"
              title="Change theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="icon-btn logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {activeNoteId ? (
          <textarea
            className="note-textarea"
            value={noteContent}
            onChange={handleContentChange}
            placeholder="Start writing your note..."
          />
        ) : (
          <div className="empty-editor">
            Select or create a note to get started
          </div>
        )}
      </main>
    </div>
  );
};

export default UserPortal;
