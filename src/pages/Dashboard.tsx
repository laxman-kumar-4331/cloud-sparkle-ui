import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FileGrid from '@/components/dashboard/FileGrid';
import UploadModal from '@/components/dashboard/UploadModal';

const Dashboard = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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
          <FileGrid />
        </main>
      </motion.div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};

export default Dashboard;
