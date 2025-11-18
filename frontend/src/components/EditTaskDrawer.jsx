// frontend/src/components/EditTaskDrawer.jsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Save, X, Clock, Calendar, Edit3, PlusCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Helper components (re-used from AddTaskModal)
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

// Function to format ISO date for datetime-local input
const toDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    try {
        const date = parseISO(isoString);
        return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch {
        return '';
    }
};

const EditTaskDrawer = ({ isOpen, onClose, onEditSave, task }) => {
  const [localTask, setLocalTask] = useState(null);
  const [error, setError] = useState(null);

  // Sync prop task with local state for editing
  useEffect(() => {
    if (task) {
        setLocalTask({
            ...task,
            // Convert ISO dates to local datetime format for input fields
            dueDate: toDateTimeLocal(task.due_date),
            reminders: (task.reminders || []).map(r => ({
                ...r,
                time: toDateTimeLocal(r.time)
            }))
        });
        setError(null);
    }
  }, [task]);

  if (!localTask) return null;

  const handleChange = (e) => {
    setLocalTask({ ...localTask, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleReminderChange = (index, value) => {
    const newReminders = [...localTask.reminders];
    newReminders[index].time = value;
    setLocalTask({ ...localTask, reminders: newReminders });
  };
  
  const addReminderField = () => {
    setLocalTask({ 
      ...localTask, 
      reminders: [...localTask.reminders, { id: null, time: '', type: 'exact' }] // id: null indicates new reminder
    });
  };

  const removeReminderField = (index) => {
    setLocalTask({ ...localTask, reminders: localTask.reminders.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localTask.title.trim() || !localTask.subject.trim() || !localTask.dueDate.trim()) {
      setError("Title, Subject, and Due Date are required.");
      return;
    }
    
    // Separate reminders to remove vs reminders to update/create
    const existingReminderIds = (task.reminders || []).map(r => r.id);
    const updatedReminderIds = localTask.reminders.map(r => r.id).filter(id => id); // existing IDs in local state
    
    const removeReminderIds = existingReminderIds.filter(id => !updatedReminderIds.includes(id));

    // Prepare reminders for backend: filter out empty times
    const remindersForBackend = localTask.reminders.filter(r => r.time).map(r => ({
        // If it has an ID, keep it for update. If null, it's a new one (backend will assign ID).
        id: r.id, 
        time: new Date(r.time).toISOString() 
    }));
    
    // Transform frontend-friendly fields back to backend ISO format
    const updates = {
      title: localTask.title,
      subject: localTask.subject,
      type: localTask.type,
      due_date: new Date(localTask.dueDate).toISOString(),
      notes: localTask.notes,
      is_completed: !!localTask.is_completed, 
      reminders: remindersForBackend,
      remove_reminder_ids: removeReminderIds,
    };
    
    // Call the parent update function
    onEditSave({ id: localTask.id, updates });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed top-0 right-0 w-full max-w-lg h-full bg-white shadow-2xl overflow-hidden max-h-screen flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Edit3 className="w-6 h-6 mr-2 text-accent" />
                Edit Task: <span className='ml-2 truncate max-w-[200px] font-normal'>{localTask.title}</span>
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-grow">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="title" label="Task Title" value={localTask.title} onChange={handleChange} />
                <Input name="subject" label="Subject/Course" value={localTask.subject} onChange={handleChange} />
              </div>

              {/* Date/Type/Completion */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="type">Task Type</Label>
                  <select id="type" name="type" value={localTask.type} onChange={handleChange} className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-accent focus:border-accent transition bg-gray-50">
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
                    value={localTask.dueDate} 
                    onChange={handleChange} 
                    icon={Calendar} 
                  />
                </div>
              </div>
              
              {/* Completion Status */}
              <div className='flex items-center pt-2'>
                <input 
                    id="is_completed" 
                    name="is_completed" 
                    type="checkbox" 
                    checked={localTask.is_completed} 
                    onChange={(e) => setLocalTask({...localTask, is_completed: e.target.checked})}
                    className="h-5 w-5 text-pink-500 rounded border-gray-300 focus:ring-pink-500"
                />
                <Label htmlFor="is_completed" className="ml-3 mt-1 text-base">
                    Mark as Completed
                </Label>
              </div>


              {/* Reminder Builder */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-700">Reminders ({localTask.reminders.length})</h4>
                  <button type="button" onClick={addReminderField} className="text-sm text-accent hover:text-purple-600 flex items-center transition font-medium">
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Reminder
                  </button>
                </div>
                
                <div className="space-y-3">
                  {localTask.reminders.map((reminder, index) => (
                    <motion.div 
                      key={reminder.id || `new-${index}`}
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
                  value={localTask.notes}
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

            <div className="flex justify-end p-5 border-t border-gray-100 bg-white">
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-3 text-lg font-semibold rounded-xl text-white bg-accent hover:bg-purple-600 transition-colors shadow-lg shadow-accent/30 flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Update Task
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditTaskDrawer;
