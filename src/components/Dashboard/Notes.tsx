import React, { useState, useEffect } from 'react';
import { Save, FileText, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Note } from '../../types';

interface NotesProps {
  eventId: string;
}

const Notes: React.FC<NotesProps> = ({ eventId }) => {
  const { isDark } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${eventId}`);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        // Load the most recent note content
        if (parsedNotes.length > 0) {
          setCurrentNote(parsedNotes[0].content);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, [eventId]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (currentNote.trim() && currentNote !== (notes[0]?.content || '')) {
        saveNote();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [currentNote]);

  const saveNote = async () => {
    if (!currentNote.trim()) return;

    setIsSaving(true);
    
    const now = new Date().toISOString();
    const newNote: Note = {
      id: notes.length > 0 ? notes[0].id : Date.now().toString(),
      eventId,
      content: currentNote.trim(),
      createdAt: notes.length > 0 ? notes[0].createdAt : now,
      updatedAt: now
    };

    const updatedNotes = notes.length > 0 ? [newNote, ...notes.slice(1)] : [newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${eventId}`, JSON.stringify(updatedNotes));
    
    setLastSaved(now);
    setIsSaving(false);
  };

  const formatLastSaved = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`
          text-2xl font-bold mb-2 transition-colors duration-300
          ${isDark ? 'text-white' : 'text-gray-800'}
        `}>
          Event Notes
        </h2>
        <p className={`
          transition-colors duration-300
          ${isDark ? 'text-white/70' : 'text-gray-600'}
        `}>
          Keep all your event-related notes in one place
        </p>
      </div>

      {/* Notes Editor */}
      <div className={`
        rounded-xl transition-all duration-300
        ${isDark 
          ? 'bg-white/5 border border-white/10' 
          : 'bg-black/5 border border-black/10'
        }
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 border-b transition-all duration-300
          ${isDark ? 'border-white/10' : 'border-black/10'}
        `}>
          <div className="flex items-center space-x-2">
            <FileText className={`
              h-5 w-5 transition-colors duration-300
              ${isDark ? 'text-white/60' : 'text-gray-500'}
            `} />
            <span className={`
              font-medium transition-colors duration-300
              ${isDark ? 'text-white/90' : 'text-gray-700'}
            `}>
              Notes
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Last Saved Indicator */}
            {lastSaved && (
              <div className="flex items-center space-x-1 text-xs">
                <Clock className={`
                  h-3 w-3 transition-colors duration-300
                  ${isDark ? 'text-white/50' : 'text-gray-400'}
                `} />
                <span className={`
                  transition-colors duration-300
                  ${isDark ? 'text-white/50' : 'text-gray-400'}
                `}>
                  Saved {formatLastSaved(lastSaved)}
                </span>
              </div>
            )}
            
            {/* Save Button */}
            <button
              onClick={saveNote}
              disabled={isSaving || !currentNote.trim()}
              className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-4">
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Start writing your notes here...

Examples:
• Send confirmation email to the caterer
• Call DJ about time slots
• Confirm guest count with venue
• Order decorations by Friday"
            className={`
              w-full h-96 p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
              ${isDark 
                ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
              }
            `}
            style={{ fontFamily: 'inherit', lineHeight: '1.6' }}
          />
        </div>

        {/* Footer */}
        <div className={`
          px-4 py-3 border-t transition-all duration-300
          ${isDark ? 'border-white/10' : 'border-black/10'}
        `}>
          <div className="flex items-center justify-between">
            <div className={`
              text-xs transition-colors duration-300
              ${isDark ? 'text-white/50' : 'text-gray-400'}
            `}>
              {currentNote.length} characters • Auto-saves every 2 seconds
            </div>
            
            {isSaving && (
              <div className="flex items-center space-x-2 text-xs text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Auto-saving...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Previous Notes (if any) */}
      {notes.length > 1 && (
        <div className="mt-6">
          <h3 className={`
            text-lg font-semibold mb-4 transition-colors duration-300
            ${isDark ? 'text-white/90' : 'text-gray-800'}
          `}>
            Previous Versions
          </h3>
          <div className="space-y-3">
            {notes.slice(1).map((note, index) => (
              <div
                key={note.id}
                className={`
                  p-4 rounded-lg transition-all duration-300
                  ${isDark 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-black/5 border border-black/10'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    text-sm font-medium transition-colors duration-300
                    ${isDark ? 'text-white/80' : 'text-gray-700'}
                  `}>
                    Version {index + 2}
                  </span>
                  <span className={`
                    text-xs transition-colors duration-300
                    ${isDark ? 'text-white/50' : 'text-gray-500'}
                  `}>
                    {new Date(note.updatedAt).toLocaleString()}
                  </span>
                </div>
                <p className={`
                  text-sm line-clamp-3 transition-colors duration-300
                  ${isDark ? 'text-white/70' : 'text-gray-600'}
                `}>
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;