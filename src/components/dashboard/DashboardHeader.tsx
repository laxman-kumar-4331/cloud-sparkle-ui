import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, Bell, Grid3X3, List, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useFileStore } from '@/store/fileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onUploadClick: () => void;
}

const DashboardHeader = ({ onUploadClick }: DashboardHeaderProps) => {
  const { user, logout } = useAuthStore();
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useFileStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 sticky top-0 z-30"
    >
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 py-5 rounded-xl border-border bg-muted/50 focus:bg-card focus:ring-2 focus:ring-primary/20 w-full"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-6">
        {/* View toggle */}
        <div className="hidden sm:flex items-center bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Upload button */}
        <Button
          onClick={onUploadClick}
          className="gradient-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 transition-all"
        >
          <Upload className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Upload</span>
        </Button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-accent transition-colors">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-primary/10">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="font-medium text-foreground">{profile?.name || 'User'}</p>
              <p className="text-sm text-muted-foreground">{user?.email || profile?.email || ''}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
