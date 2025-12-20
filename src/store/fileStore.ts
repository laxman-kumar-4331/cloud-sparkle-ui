import { create } from 'zustand';

export interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'folder';
  size: string;
  uploadDate: string;
  thumbnail?: string;
  isStarred?: boolean;
  isDeleted?: boolean;
}

interface FileStore {
  files: FileItem[];
  selectedFiles: string[];
  viewMode: 'grid' | 'list';
  currentFolder: string;
  searchQuery: string;
  setFiles: (files: FileItem[]) => void;
  addFile: (file: FileItem) => void;
  deleteFile: (id: string) => void;
  restoreFile: (id: string) => void;
  permanentlyDeleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  toggleStar: (id: string) => void;
  selectFile: (id: string) => void;
  clearSelection: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setCurrentFolder: (folder: string) => void;
  setSearchQuery: (query: string) => void;
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Project Presentation.pdf',
    type: 'document',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    isStarred: true,
  },
  {
    id: '2',
    name: 'Team Photo.jpg',
    type: 'image',
    size: '1.8 MB',
    uploadDate: '2024-01-14',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Product Demo.mp4',
    type: 'video',
    size: '45.2 MB',
    uploadDate: '2024-01-13',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'Financial Report Q4.xlsx',
    type: 'document',
    size: '856 KB',
    uploadDate: '2024-01-12',
  },
  {
    id: '5',
    name: 'Brand Guidelines.pdf',
    type: 'document',
    size: '5.1 MB',
    uploadDate: '2024-01-11',
    isStarred: true,
  },
  {
    id: '6',
    name: 'Office Tour.mp4',
    type: 'video',
    size: '120.5 MB',
    uploadDate: '2024-01-10',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop',
  },
  {
    id: '7',
    name: 'Product Mockup.png',
    type: 'image',
    size: '3.2 MB',
    uploadDate: '2024-01-09',
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop',
  },
  {
    id: '8',
    name: 'Meeting Notes.docx',
    type: 'document',
    size: '124 KB',
    uploadDate: '2024-01-08',
  },
  {
    id: '9',
    name: 'Sunset Beach.jpg',
    type: 'image',
    size: '4.5 MB',
    uploadDate: '2024-01-07',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop',
  },
  {
    id: '10',
    name: 'Contract Template.pdf',
    type: 'document',
    size: '1.1 MB',
    uploadDate: '2024-01-06',
  },
  {
    id: '11',
    name: 'Tutorial Video.mp4',
    type: 'video',
    size: '85.3 MB',
    uploadDate: '2024-01-05',
    thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=200&h=200&fit=crop',
  },
  {
    id: '12',
    name: 'Logo Design.svg',
    type: 'image',
    size: '245 KB',
    uploadDate: '2024-01-04',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&h=200&fit=crop',
  },
];

export const useFileStore = create<FileStore>((set) => ({
  files: mockFiles,
  selectedFiles: [],
  viewMode: 'grid',
  currentFolder: 'all',
  searchQuery: '',
  setFiles: (files) => set({ files }),
  addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
  deleteFile: (id) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isDeleted: true } : f)),
    })),
  restoreFile: (id) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isDeleted: false } : f)),
    })),
  permanentlyDeleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),
  renameFile: (id, newName) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, name: newName } : f)),
    })),
  toggleStar: (id) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isStarred: !f.isStarred } : f)),
    })),
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
