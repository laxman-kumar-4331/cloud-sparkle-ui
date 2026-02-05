import { create } from 'zustand';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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
  cloudinary_public_id: string;
  cloudinary_url: string;
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
  permanentlyDeleteFile: (id: string, cloudinaryPublicId: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  toggleStar: (id: string, isStarred: boolean) => Promise<void>;
  selectFile: (id: string) => void;
  clearSelection: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setCurrentFolder: (folder: string) => void;
  setSearchQuery: (query: string) => void;
  downloadFile: (url: string, fileName: string) => Promise<void>;
}

const callFilesFunction = async (body: Record<string, unknown>) => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/mongodb-files`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

const callCloudinaryFunction = async (body: Record<string, unknown>) => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/cloudinary-upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

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

    try {
      const data = await callFilesFunction({ action: 'list', user_id: userId });

      const files: FileItem[] = (data.files || []).map((file: Record<string, unknown>) => ({
        id: file._id as string,
        name: file.name as string,
        original_name: file.original_name as string,
        type: getFileType(file.type as string),
        size: formatFileSize(file.size as number),
        uploadDate: new Date(file.created_at as string).toISOString().split('T')[0],
        isStarred: file.is_starred as boolean,
        isDeleted: file.is_deleted as boolean,
        cloudinary_public_id: file.cloudinary_public_id as string,
        cloudinary_url: file.cloudinary_url as string,
        thumbnail: file.thumbnail_url as string | undefined,
        user_id: file.user_id as string,
      }));

      set({ files, isLoading: false });
    } catch (error) {
      console.error('Error fetching files:', error);
      set({ isLoading: false });
    }
  },

  uploadFile: async (file: File, userId: string) => {
    // Get Cloudinary signature
    const signatureData = await callCloudinaryFunction({
      action: 'get_signature',
      user_id: userId,
    });

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.api_key);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('signature', signatureData.signature);
    formData.append('folder', signatureData.folder);

    const resourceType = file.type.startsWith('video/') ? 'video' : 
                         file.type.startsWith('image/') ? 'image' : 'raw';

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/${resourceType}/upload`,
      { method: 'POST', body: formData }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const cloudinaryData = await cloudinaryResponse.json();

    // Save file metadata to MongoDB
    await callFilesFunction({
      action: 'create',
      user_id: userId,
      file_data: {
        name: file.name,
        original_name: file.name,
        size: file.size,
        type: file.type,
        cloudinary_public_id: cloudinaryData.public_id,
        cloudinary_url: cloudinaryData.secure_url,
        thumbnail_url: cloudinaryData.thumbnail_url || cloudinaryData.secure_url,
      },
    });

    // Refresh files list
    await get().fetchFiles(userId);
  },

  deleteFile: async (id: string) => {
    const file = get().files.find((f) => f.id === id);
    if (!file) return;

    await callFilesFunction({
      action: 'update',
      file_id: id,
      user_id: file.user_id,
      file_data: { is_deleted: true },
    });

    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isDeleted: true } : f)),
    }));
  },

  restoreFile: async (id: string) => {
    const file = get().files.find((f) => f.id === id);
    if (!file) return;

    await callFilesFunction({
      action: 'update',
      file_id: id,
      user_id: file.user_id,
      file_data: { is_deleted: false },
    });

    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isDeleted: false } : f)),
    }));
  },

  permanentlyDeleteFile: async (id: string, cloudinaryPublicId: string) => {
    const file = get().files.find((f) => f.id === id);
    if (!file) return;

    // Delete from Cloudinary
    try {
      await callCloudinaryFunction({
        action: 'delete',
        public_id: cloudinaryPublicId,
      });
    } catch (error) {
      console.error('Cloudinary delete error:', error);
    }

    // Delete from MongoDB
    await callFilesFunction({
      action: 'delete',
      file_id: id,
      user_id: file.user_id,
    });

    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    }));
  },

  renameFile: async (id: string, newName: string) => {
    const file = get().files.find((f) => f.id === id);
    if (!file) return;

    await callFilesFunction({
      action: 'update',
      file_id: id,
      user_id: file.user_id,
      new_name: newName,
    });

    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, name: newName } : f)),
    }));
  },

  toggleStar: async (id: string, isStarred: boolean) => {
    const file = get().files.find((f) => f.id === id);
    if (!file) return;

    await callFilesFunction({
      action: 'update',
      file_id: id,
      user_id: file.user_id,
      file_data: { is_starred: !isStarred },
    });

    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isStarred: !isStarred } : f)),
    }));
  },

  downloadFile: async (url: string, fileName: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
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
