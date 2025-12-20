import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  FolderOpen,
  Image,
  Video,
  FileText,
  Trash2,
  Star,
  HardDrive,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useFileStore } from '@/store/fileStore';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: FolderOpen, label: 'All Files', path: '/dashboard', folder: 'all' },
  { icon: Star, label: 'Starred', path: '/dashboard/starred', folder: 'starred' },
  { icon: Image, label: 'Images', path: '/dashboard/images', folder: 'images' },
  { icon: Video, label: 'Videos', path: '/dashboard/videos', folder: 'videos' },
  { icon: FileText, label: 'Documents', path: '/dashboard/documents', folder: 'documents' },
  { icon: Trash2, label: 'Trash', path: '/dashboard/trash', folder: 'trash' },
];

const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { currentFolder, setCurrentFolder } = useFileStore();

  const storageUsed = 2.4;
  const storageTotal = 5;
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed left-0 top-0 h-full bg-card border-r border-border z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <HardDrive className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">CloudVault</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md mx-auto">
            <HardDrive className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentFolder === item.folder;
            return (
              <li key={item.label}>
                <button
                  onClick={() => setCurrentFolder(item.folder)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', isCollapsed && 'mx-auto')} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Storage indicator */}
      <div className={cn('p-4 border-t border-border', isCollapsed && 'hidden')}>
        <div className="bg-accent rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Storage</span>
            <span className="text-xs text-muted-foreground">
              {storageUsed} GB / {storageTotal} GB
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${storagePercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full gradient-primary rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {((storageTotal - storageUsed) / storageTotal * 100).toFixed(0)}% of storage available
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className={cn('p-4 border-t border-border', isCollapsed && 'px-3')}>
        <button
          className={cn(
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
            isCollapsed && 'justify-center'
          )}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
