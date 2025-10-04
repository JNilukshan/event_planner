import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, CheckSquare } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Task } from '../../types';

interface TaskChecklistProps {
  eventId: string;
}

const TaskChecklist: React.FC<TaskChecklistProps> = ({ eventId }) => {
  const { isDark } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${eventId}`);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, [eventId]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(`tasks_${eventId}`, JSON.stringify(tasks));
  }, [tasks, eventId]);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        eventId,
        title: newTaskTitle.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    if (editTitle.trim() && editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask ? { ...task, title: editTitle.trim() } : task
      ));
      setEditingTask(null);
      setEditTitle('');
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`
          text-2xl font-bold mb-2 transition-colors duration-300
          ${isDark ? 'text-white' : 'text-gray-800'}
        `}>
          Task Checklist
        </h2>
        <p className={`
          transition-colors duration-300
          ${isDark ? 'text-white/70' : 'text-gray-600'}
        `}>
          Keep track of all tasks for this event
        </p>
        {totalTasks > 0 && (
          <div className={`
            mt-3 text-sm transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `}>
            Progress: {completedTasks}/{totalTasks} tasks completed
          </div>
        )}
      </div>

      {/* Add New Task */}
      <div className={`
        p-4 rounded-xl mb-6 transition-all duration-300
        ${isDark 
          ? 'bg-white/5 border border-white/10' 
          : 'bg-black/5 border border-black/10'
        }
      `}>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task (e.g., Book Venue)"
            className={`
              flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
              ${isDark 
                ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
              }
            `}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button
            onClick={addTask}
            disabled={!newTaskTitle.trim()}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className={`
            text-center py-12 transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `}>
            <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`
                p-4 rounded-xl transition-all duration-300
                ${isDark 
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10' 
                  : 'bg-black/5 border border-black/10 hover:bg-black/10'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`
                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                    ${task.completed
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                      : isDark
                        ? 'border-white/30 hover:border-white/50'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {task.completed && <Check className="h-4 w-4 text-white" />}
                </button>

                {/* Task Title */}
                <div className="flex-1">
                  {editingTask === task.id ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className={`
                          flex-1 px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                          ${isDark 
                            ? 'bg-white/10 border border-white/20 text-white' 
                            : 'bg-black/10 border border-black/20 text-gray-800'
                          }
                        `}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="p-1 text-green-500 hover:text-green-400 transition-colors duration-200"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-red-500 hover:text-red-400 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className={`
                      transition-all duration-300
                      ${task.completed 
                        ? 'line-through opacity-60' 
                        : ''
                      }
                      ${isDark ? 'text-white' : 'text-gray-800'}
                    `}>
                      {task.title}
                    </span>
                  )}
                </div>

                {/* Actions */}
                {editingTask !== task.id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(task)}
                      className={`
                        p-1 rounded transition-colors duration-200
                        ${isDark 
                          ? 'text-white/60 hover:text-white hover:bg-white/10' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-black/10'
                        }
                      `}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskChecklist;