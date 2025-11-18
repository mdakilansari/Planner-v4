// frontend/src/components/TaskList.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, CheckCircle, Clock, Calendar, Bookmark, Loader } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, onComplete, onSnooze }) => {
  const isCompleted = task.is_completed;
  const cardClasses = isCompleted 
    ? "bg-white/70 border-l-4 border-emerald-400 opacity-60"
    : "bg-white border-l-4 border-pink-500 shadow-lg hover:shadow-xl transition-shadow duration-300";

  const dueDate = task.due_date ? format(new Date(task.due_date), 'MMM do, h:mm a') : 'No Due Date';

  const getTaskColor = (type) => {
    switch (type) {
      case 'Study': return 'bg-blue-100 text-blue-700';
      case 'Assignment': return 'bg-yellow-100 text-yellow-700';
      case 'Exam': return 'bg-red-100 text-red-700';
      case 'Personal': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getSubjectColor = (subject) => {
    // Simple hash-based color for diverse subjects
    const hash = subject.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ['bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'];
    return colors[hash % colors.length];
  }
  
  const SubjectPill = () => (
    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${getSubjectColor(task.subject)}`}>
      {task.subject}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      layout
      className={` p-5 rounded-xl flex flex-col transition-all duration-300 group`}
    >
      {/* Header/Title */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTaskColor(task.type)} mb-1 w-fit`}>
            {task.type}
          </span>
          <h3 className={`text-xl font-bold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
        </div>
        <SubjectPill />
      </div>

      {/* Details */}
      <div className="text-sm text-gray-600 space-y-2 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-pink-400 flex-shrink-0" />
          <span className={isCompleted ? 'line-through' : ''}>Due: **{dueDate}**</span>
        </div>
        
        <div className="flex items-start">
          <Bookmark className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0 mt-0.5" />
          <p className={`text-gray-500 ${isCompleted ? 'line-through' : ''}`}>
            {task.notes || 'No detailed notes provided.'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-3 border-t border-gray-100">
        <ActionButton 
            Icon={Edit} 
            label="Edit" 
            onClick={() => onEdit(task)} 
            color="text-accent hover:bg-accent/10" 
            disabled={isCompleted}
        />
        <ActionButton 
            Icon={Trash2} 
            label="Delete" 
            onClick={() => onDelete(task)} 
            color="text-red-500 hover:bg-red-500/10"
        />
        {!isCompleted && (
          <>
            <ActionButton 
                Icon={CheckCircle} 
                label="Complete" 
                onClick={() => onComplete(task)} 
                color="text-emerald-500 hover:bg-emerald-500/10"
            />
            <ActionButton 
                Icon={Clock} 
                label="Snooze" 
                onClick={() => onSnooze(task)} 
                color="text-orange-500 hover:bg-orange-500/10"
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

const ActionButton = ({ Icon, label, onClick, color, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'pointer-events-auto'}`}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
);


const TaskList = ({ tasks, isLoading, error, onEdit, onDelete, onComplete, onSnooze }) => {
  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500 flex flex-col items-center">
        <Loader className="w-6 h-6 animate-spin text-pink-500 mb-3" />
        Loading your tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl border border-red-200 m-4">
        Error loading tasks: {error.message || 'Check backend connection.'}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl m-4">
        <p className="text-lg font-medium">No tasks found! 🎉</p>
        <p className="text-sm mt-1">Click 'Add New Task' to start planning your v4 journey.</p>
      </div>
    );
  }
  
  // Sort: Incomplete tasks first, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
      if (a.is_completed !== b.is_completed) {
          return a.is_completed ? 1 : -1;
      }
      return new Date(a.due_date) - new Date(b.due_date);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <AnimatePresence initial={false}>
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
            onSnooze={onSnooze}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
