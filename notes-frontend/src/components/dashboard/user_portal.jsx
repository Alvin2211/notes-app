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



