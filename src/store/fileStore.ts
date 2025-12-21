import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface FileItem {
  id: string;
  name: string;
  original_name: string;
  type: 'image' | 'video' | 'document' | 'folder';
  size: string;
  uploadDate: string;
  thumbnail?: string;
  isStarred?: boolean;
  isDeleted?: boolean;
  storage_path: string;
  user_id: string;
}

interface FileStore {
  files: FileItem[];
  selectedFiles: string[];
  viewMode: 'grid' | 'list';
  currentFolder: string;
  searchQuery: string;
  isLoading: boolean;
  setFiles: (files: FileItem[]) => void;
  fetchFiles: (userId: string) => Promise<void>;
  uploadFile: (file: File, userId: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  restoreFile: (id: string) => Promise<void>;
  permanentlyDeleteFile: (id: string, storagePath: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  toggleStar: (id: string, isStarred: boolean) => Promise<void>;
  selectFile: (id: string) => void;
  clearSelection: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setCurrentFolder: (folder: string) => void;
  setSearchQuery: (query: string) => void;
  downloadFile: (storagePath: string, fileName: string) => Promise<void>;
}

const getFileType = (mimeType: string): 'image' | 'video' | 'document' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  selectedFiles: [],
  viewMode: 'grid',
  currentFolder: 'all',
  searchQuery: '',
  isLoading: false,

  setFiles: (files) => set({ files }),

  fetchFiles: async (userId: string) => {
    set({ isLoading: true });
    
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
      set({ isLoading: false });
      return;
    }

    const files: FileItem[] = (data || []).map((file) => {
      let thumbnail: string | undefined;
      
      if (getFileType(file.type) === 'image') {
        const { data: urlData } = supabase.storage
          .from('user-files')
          .getPublicUrl(file.storage_path);
        thumbnail = urlData.publicUrl;
      }

      return {
        id: file.id,
        name: file.name,
        original_name: file.original_name,
        type: getFileType(file.type),
        size: formatFileSize(file.size),
        uploadDate: new Date(file.created_at).toISOString().split('T')[0],
        isStarred: file.is_starred,
        isDeleted: file.is_deleted,
        storage_path: file.storage_path,
        user_id: file.user_id,
        thumbnail,
      };
    });

    set({ files, isLoading: false });
  },

  uploadFile: async (file: File, userId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const storagePath = `${userId}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(storagePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Create database record
    const { error: dbError } = await supabase.from('files').insert({
      user_id: userId,
      name: file.name,
      original_name: file.name,
      size: file.size,
      type: file.type,
      storage_path: storagePath,
    });

    if (dbError) {
      // Cleanup storage if db insert fails
      await supabase.storage.from('user-files').remove([storagePath]);
      throw dbError;
    }

    // Refresh files list
    await get().fetchFiles(userId);
  },

  deleteFile: async (id: string) => {
    const { error } = await supabase
      .from('files')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw error;
    }

    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isDeleted: true } : f)),
    }));
  },

  restoreFile: async (id: string) => {
    const { error } = await supabase
      .from('files')
      .update({ is_deleted: false, deleted_at: null })
      .eq('id', id);

    if (error) {
      throw error;
    }

    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isDeleted: false } : f)),
    }));
  },

  permanentlyDeleteFile: async (id: string, storagePath: string) => {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('user-files')
      .remove([storagePath]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase.from('files').delete().eq('id', id);

    if (dbError) {
      throw dbError;
    }

    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    }));
  },

  renameFile: async (id: string, newName: string) => {
    const { error } = await supabase
      .from('files')
      .update({ name: newName })
      .eq('id', id);

    if (error) {
      throw error;
    }

    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, name: newName } : f)),
    }));
  },

  toggleStar: async (id: string, isStarred: boolean) => {
    const { error } = await supabase
      .from('files')
      .update({ is_starred: !isStarred })
      .eq('id', id);

    if (error) {
      throw error;
    }

    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isStarred: !isStarred } : f)),
    }));
  },

  downloadFile: async (storagePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('user-files')
      .download(storagePath);

    if (error) {
      throw error;
    }

    // Create download link
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  selectFile: (id) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.includes(id)
        ? state.selectedFiles.filter((fid) => fid !== id)
        : [...state.selectedFiles, id],
    })),

  clearSelection: () => set({ selectedFiles: [] }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setCurrentFolder: (folder) => set({ currentFolder: folder }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
