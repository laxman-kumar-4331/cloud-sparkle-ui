import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useFileStore } from '@/store/fileStore';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FileGrid from '@/components/dashboard/FileGrid';
import UploadModal from '@/components/dashboard/UploadModal';

const Dashboard = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading, initialize, user } = useAuthStore();
  const { fetchFiles, isLoading: filesLoading } = useFileStore();
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchFiles(user.id);
    }
  }, [user?.id, fetchFiles]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading your files...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 ml-[280px] min-h-screen"
      >
        <DashboardHeader onUploadClick={() => setIsUploadOpen(true)} />

        <main className="p-6 lg:p-8">
          <FileGrid isLoading={filesLoading} />
        </main>
      </motion.div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};

export default Dashboard;
