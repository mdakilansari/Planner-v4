// frontend/src/components/AddTaskModal.jsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusCircle, X, Clock, Calendar } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [task, setTask] = useState({ title: '', subject: '', type: 'Study', dueDate: '', notes: '', reminders: [] });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleReminderChange = (index, value) => {
    const newReminders = [...task.reminders];
    newReminders[index].time = value;
    setTask({ ...task, reminders: newReminders });
  };
  
  const addReminderField = () => {
    setTask({ 
      ...task, 
      reminders: [...task.reminders, { time: '', type: 'exact' }] // type: 'exact' or 'before'
    });
  };

  const removeReminderField = (index) => {
    setTask({ ...task, reminders: task.reminders.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim() || !task.subject.trim() || !task.dueDate.trim()) {
      setError("Title, Subject, and Due Date are required.");
      return;
    }
    
    // Transform frontend-friendly dueDate and reminders into backend format
    const newTask = {
      ...task,
      due_date: new Date(task.dueDate).toISOString(),
      reminders: task.reminders.filter(r => r.time).map(r => ({ time: new Date(r.time).toISOString() })),
      is_completed: false,
    };
    
    onSubmit(newTask);
    setTask({ title: '', subject: '', type: 'Study', dueDate: '', notes: '', reminders: [] });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <PlusCircle className="w-6 h-6 mr-2 text-pink-500" />
                Create New Task
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="title" label="Task Title" value={task.title} onChange={handleChange} placeholder="e.g. Master React Hooks" />
                <Input name="subject" label="Subject/Course" value={task.subject} onChange={handleChange} placeholder="e.g. Full Stack Development" />
              </div>

              {/* Date/Type/Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="type">Task Type</Label>
                  <select id="type" name="type" value={task.type} onChange={handleChange} className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-accent focus:border-accent transition bg-gray-50">
                    <option>Study</option>
                    <option>Assignment</option>
                    <option>Exam</option>
                    <option>Personal</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Input 
                    name="dueDate" 
                    label="Due Date/Time" 
                    type="datetime-local" 
                    value={task.dueDate} 
                    onChange={handleChange} 
                    icon={Calendar} 
                  />
                </div>
              </div>

              {/* Reminder Builder */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-700">Reminders ({task.reminders.length})</h4>
                  <button type="button" onClick={addReminderField} className="text-sm text-pink-500 hover:text-pink-600 flex items-center transition font-medium">
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Reminder
                  </button>
                </div>
                
                <div className="space-y-3">
                  {task.reminders.map((reminder, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex space-x-3 items-center"
                    >
                      <Input 
                        label={`Reminder Time #${index + 1}`} 
                        type="datetime-local" 
                        value={reminder.time} 
                        onChange={(e) => handleReminderChange(index, e.target.value)} 
                        icon={Clock}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeReminderField(index)} 
                        className="mt-6 text-red-400 hover:text-red-600 transition p-2 rounded-full"
                        aria-label="Remove reminder"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={task.notes}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-accent focus:border-accent transition bg-gray-50 resize-none"
                  placeholder="Additional details, resources, or goals..."
                ></textarea>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="p-3 bg-red-100 text-red-700 border border-red-200 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
            </form>

            <div className="flex justify-end p-5 border-t border-gray-100 bg-gray-50">
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-3 text-lg font-semibold rounded-xl text-white bg-pink-500 hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30"
              >
                Create Task
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper components for clean structure
const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

const Input = ({ name, label, type = 'text', value, onChange, placeholder, icon: Icon }) => (
  <div>
    <Label htmlFor={name}>{label}</Label>
    <div className="relative mt-1">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-3 border border-gray-200 rounded-lg focus:ring-accent focus:border-accent transition bg-gray-50 ${Icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

export default AddTaskModal;
