// frontend/src/App.jsx
import React, { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import Header from './components/Header';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import EditTaskDrawer from './components/EditTaskDrawer';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { useToast } from './hooks/useToast';
import { PlusCircle } from 'lucide-react';
import { fetchTasks, createTask, updateTask, deleteTask, completeTask, snoozeTaskReminder } from './api/tasks';

function App() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // --- UI State Management ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // --- React Query: Fetch Tasks ---
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // --- React Query: Mutations ---
  
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      // Invalidate and refetch, or optimistically update
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast(`Task "${data.task.title}" created successfully!`, 'success');
    },
    onError: (err) => {
      const detail = err.response?.data?.detail || err.message;
      addToast(`Error creating task: ${detail}`, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast(`Task "${data.task.title}" updated successfully!`, 'success');
    },
    onError: (err) => {
      const detail = err.response?.data?.detail || err.message;
      addToast(`Error updating task: ${detail}`, 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast(`Task deleted successfully!`, 'success');
    },
    onError: (err) => {
      const detail = err.response?.data?.detail || err.message;
      addToast(`Error deleting task: ${detail}`, 'error');
    },
  });
  
  const completeMutation = useMutation({
    mutationFn: completeTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast(`Task "${data.task.title}" marked as complete! Great job!`, 'success');
    },
    onError: (err) => {
      const detail = err.response?.data?.detail || err.message;
      addToast(`Error completing task: ${detail}`, 'error');
    },
  });
  
  const snoozeMutation = useMutation({
    mutationFn: snoozeTaskReminder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast(`Task "${data.task.title}" snoozed! Reminder rescheduled.`, 'default');
    },
    onError: (err) => {
      const detail = err.response?.data?.detail || err.message;
      addToast(`Error snoozing reminder: ${detail}`, 'error');
    },
  });


  // --- Event Handlers ---

  const handleCreateTask = (newTask) => {
    createMutation.mutate(newTask);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditDrawerOpen(true);
  };

  const handleEditSave = ({ id, updates }) => {
    // updates contains all fields + reminders + remove_reminder_ids
    updateMutation.mutate({ taskId: id, updates });
    setSelectedTask(null);
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    deleteMutation.mutate(selectedTask.id);
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
  };
  
  const handleCompleteTask = (task) => {
    completeMutation.mutate(task.id);
  };
  
  const handleSnoozeTask = (task) => {
    // The snooze API call is simple: POST /tasks/{id}/acknowledge
    snoozeMutation.mutate(task.id);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* 'Add New Task' Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 text-lg font-semibold rounded-xl text-white bg-pink-500 hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30 flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Task
          </button>
        </div>
        
        {/* Task List */}
        <TaskList 
          tasks={tasks?.tasks} // Safely access tasks array from response object
          isLoading={isLoading} 
          error={error} 
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
          onSnooze={handleSnoozeTask}
        />
        
      </main>

      {/* Modals & Drawers */}
      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleCreateTask}
      />
      <EditTaskDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onEditSave={handleEditSave}
        task={selectedTask}
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        task={selectedTask}
      />
      
    </div>
  );
}

// Wrapper to include React Query and Toast Provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './hooks/useToast';

const queryClient = new QueryClient();

export default function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryClientProvider>
  );
}
