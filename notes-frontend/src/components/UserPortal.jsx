import React, { useState, useEffect, useCallback } from 'react';
import "../styles/UserPortal.css";
import { Plus, Trash2, Edit3, Sun, Moon, LogOut, Save } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
const API= import.meta.env.VITE_API_BASE_URL;

const NoteTab = ({ note, isActive, onSelect, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(note.title);

  useEffect(() => {
    setTempTitle(note.title);
  }, [note.title]);

  const finishRename = () => {
    const trimmed = tempTitle.trim() || 'Untitled';
    onRename(note._id, trimmed);
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
            onDelete(note._id);
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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [userInfo, setUserInfo] = useState({ name: 'Guest', id: null });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoadingUser(true);
      try {
        const response = await fetch(`${API}/api/v1/users/current-user`, {
          method: 'GET',
          credentials: 'include',
          
        });
         

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        if (userData.success && userData.user) {
          setUserInfo({
            name: userData.user.name || 'User',
            id: userData.user._id
          });
        }
      } catch (error) {
        navigate('/');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    if (!userInfo.id || isLoadingUser) return;

    const fetchNotes = async () => {
      setIsLoadingNotes(true);
      try {
        const response = await fetch(`${API}/api/notes`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.notes && Array.isArray(result.notes)) {
          setNotes(result.notes);
          
          const untitledNumbers = result.notes
            .filter(note => note.title.match(/^Untitled \d+$/))
            .map(note => parseInt(note.title.replace('Untitled ', '')))
            .filter(num => !isNaN(num));
          
          if (untitledNumbers.length > 0) {
            setNextUntitled(Math.max(...untitledNumbers) + 1);
          }
        }
      } catch (error) {
      } finally {
        setIsLoadingNotes(false);
      }
    };

    fetchNotes();
  }, [userInfo.id, isLoadingUser]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const active = notes.find((n) => n._id === activeNoteId);
    if (active) {
      setTempTitle(active.title);
    } else {
      setIsRenaming(false);
    }
  }, [activeNoteId, notes]);

  const addNote = useCallback(() => {
    const newNote = {
      _id: `temp_${Date.now()}`, 
      title: `Untitled ${nextUntitled}`,
      content: '',
      isNew: true 
    };
    setNotes((prev) => [newNote, ...prev]); 
    setNoteContent('');
    setNextUntitled((n) => n + 1);
    setIsRenaming(false);
  }, [nextUntitled]);

  const deleteNote = useCallback(
    async (id) => {
      const noteToDelete = notes.find(n => n._id === id);
      
      if (noteToDelete?.isNew) {
        setNotes((prev) => prev.filter((note) => note._id !== id));
        if (activeNoteId === id) {
          setActiveNoteId(null);
          setNoteContent('');
        }
        setIsRenaming(false);
        return;
      }

      
      try {
        const response = await fetch(`${API}/api/notes/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        
        setNotes((prev) => prev.filter((note) => note._id !== id));
        
        
        if (activeNoteId === id) {
          setActiveNoteId(null);
          setNoteContent('');
        }
        
        setIsRenaming(false);
        
      } catch (error) {
        alert('Failed to delete note from database. Please try again.');
      }
    },
    [activeNoteId, notes]
  );

  const handleNoteClick = useCallback((note) => {
    setActiveNoteId(note._id);
    setNoteContent(note.content);
    setIsRenaming(false);
  }, []);

  const handleContentChange = useCallback(
    (e) => {
      const val = e.target.value;
      setNoteContent(val);
      setNotes((prev) =>
        prev.map((note) =>
          note._id === activeNoteId ? { ...note, content: val } : note
        )
      );  
    },
    [activeNoteId]
  );

  const renameNote = useCallback(
    (id, newTitle) => {
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? { ...note, title: newTitle } : note))
      );
      if (id === activeNoteId) {
        setTempTitle(newTitle);
      }
    },
    [activeNoteId]
  );

  const saveNotes = useCallback(async () => {
  if (!userInfo.id || notes.length === 0) return;

  setIsSaving(true);

  try {
    const requests = notes.map(async note => {
      const isNew = note.isNew;
      const method = isNew ? 'POST' : 'PUT';
      const endpoint = isNew
        ? `${API}/api/notes`
        : `${API}/api/notes/${note._id}`;

      const res = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to save note ${note._id}`);
      }
      const data = await res.json();
      return await data.note;
    });

    const savedNotes = await Promise.all(requests);

    setNotes(
      savedNotes.map(note => ({
        ...note,
        isNew: false,
      }))
    );

    
    if (activeNoteId) {
      const stillExists = savedNotes.find(n => n._id === activeNoteId);
      if (!stillExists) {
        setActiveNoteId(savedNotes[0]?._id || null);
      }
    }

  } catch (error) {
    alert('Failed to save all notes. Please try again.');
  } finally {
    setIsSaving(false);
  }
}, [notes, userInfo.id, activeNoteId]);


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
      const active = notes.find((n) => n._id === activeNoteId);
      setTempTitle(active ? active.title : '');
      setIsRenaming(false);
    }
  };

  const handleLogout = async () => {
    alert('Logging out will save all your notes to the database.');
    await saveNotes();
    try {
      const response = await fetch(`${API}/api/v1/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Logout failed:', response.status);
      }
      
      setUserInfo({ name: 'Guest', id: null });
      setNotes([]);
      setActiveNoteId(null);
      setNoteContent('');
      
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/');
    }
  };

  const activeNote = notes.find((n) => n._id === activeNoteId);

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
          {isLoadingUser ? (
            <li className="loading-message">Loading user...</li>
          ) : isLoadingNotes ? (
            <li className="loading-message">Loading notes...</li>
          ) : (
            notes.map((note) => (
              <NoteTab
                key={note._id}
                note={note}
                isActive={note._id === activeNoteId}
                onSelect={handleNoteClick}
                onDelete={deleteNote}
                onRename={renameNote}
              />
            ))
          )}
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
              <div>Welcome {userInfo.name}!!</div>
            )}
          </div>
          <div className="navbar-actions">

            {activeNoteId && (
              <>
                <button
                  className="icon-btn save-btn"
                  onClick={saveNotes}
                  disabled={isSaving}
                  aria-label="Save note"
                  title="Save note to database"
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
                  onClick={() => deleteNote(activeNoteId)}
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
            {isLoadingUser ? (
              "Loading user information..."
            ) : notes.length === 0 && !isLoadingNotes ? (
              "Create your first note by clicking the + button"
            ) : (
              "Select a note to get started"
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserPortal;