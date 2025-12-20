import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileItem, useFileStore } from '@/store/fileStore';
import FileCard from './FileCard';
import FileListItem from './FileListItem';
import { FolderOpen, Search } from 'lucide-react';
import RenameModal from './RenameModal';

const FileGrid = () => {
  const { files, viewMode, currentFolder, searchQuery } = useFileStore();
  const [renameFile, setRenameFile] = useState<FileItem | null>(null);

  const filteredFiles = useMemo(() => {
    let result = files;

    // Filter by folder/type
    switch (currentFolder) {
      case 'images':
        result = result.filter((f) => f.type === 'image' && !f.isDeleted);
        break;
      case 'videos':
        result = result.filter((f) => f.type === 'video' && !f.isDeleted);
        break;
      case 'documents':
        result = result.filter((f) => f.type === 'document' && !f.isDeleted);
        break;
      case 'starred':
        result = result.filter((f) => f.isStarred && !f.isDeleted);
        break;
      case 'trash':
        result = result.filter((f) => f.isDeleted);
        break;
      default:
        result = result.filter((f) => !f.isDeleted);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [files, currentFolder, searchQuery]);

  const folderTitle = useMemo(() => {
    switch (currentFolder) {
      case 'images':
        return 'Images';
      case 'videos':
        return 'Videos';
      case 'documents':
        return 'Documents';
      case 'starred':
        return 'Starred';
      case 'trash':
        return 'Trash';
      default:
        return 'All Files';
    }
  }, [currentFolder]);

  if (filteredFiles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mb-6">
          {searchQuery ? (
            <Search className="w-12 h-12 text-muted-foreground" />
          ) : (
            <FolderOpen className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {searchQuery ? 'No files found' : 'No files here yet'}
        </h3>
        <p className="text-muted-foreground text-center max-w-sm">
          {searchQuery
            ? `No files match "${searchQuery}". Try a different search term.`
            : currentFolder === 'trash'
            ? 'Deleted files will appear here.'
            : 'Upload your first file to get started.'}
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{folderTitle}</h2>
        <p className="text-muted-foreground mt-1">{filteredFiles.length} files</p>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          >
            {filteredFiles.map((file, index) => (
              <FileCard key={file.id} file={file} index={index} onRename={setRenameFile} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {filteredFiles.map((file, index) => (
              <FileListItem key={file.id} file={file} index={index} onRename={setRenameFile} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <RenameModal file={renameFile} onClose={() => setRenameFile(null)} />
    </>
  );
};

export default FileGrid;
