import { motion } from 'framer-motion';
import { FileText, Image, Video, MoreVertical, Download, Pencil, Trash2, Star, RotateCcw } from 'lucide-react';
import { FileItem, useFileStore } from '@/store/fileStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface FileListItemProps {
  file: FileItem;
  index: number;
  onRename: (file: FileItem) => void;
}

const FileListItem = ({ file, index, onRename }: FileListItemProps) => {
  const { deleteFile, toggleStar, restoreFile, permanentlyDeleteFile, currentFolder } = useFileStore();
  const { toast } = useToast();
  const isTrash = currentFolder === 'trash';

  const getFileIcon = () => {
    switch (file.type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  const getIconColor = () => {
    switch (file.type) {
      case 'image':
        return 'text-pink-500 bg-pink-50';
      case 'video':
        return 'text-purple-500 bg-purple-50';
      default:
        return 'text-primary bg-cloud-50';
    }
  };

  const Icon = getFileIcon();

  const handleDelete = () => {
    if (isTrash) {
      permanentlyDeleteFile(file.id);
      toast({ title: 'File permanently deleted' });
    } else {
      deleteFile(file.id);
      toast({ title: 'Moved to trash' });
    }
  };

  const handleRestore = () => {
    restoreFile(file.id);
    toast({ title: 'File restored' });
  };

  const handleDownload = () => {
    toast({ title: 'Download started', description: `Downloading ${file.name}` });
  };

  const handleStar = () => {
    toggleStar(file.id);
    toast({ title: file.isStarred ? 'Removed from starred' : 'Added to starred' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/20 hover:shadow-md transition-all"
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${getIconColor()} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground truncate">{file.name}</h3>
          {file.isStarred && <Star className="w-4 h-4 text-warning fill-current flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-muted-foreground">{file.size}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{file.uploadDate}</span>
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {isTrash ? (
            <>
              <DropdownMenuItem onClick={handleRestore}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Permanently
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename(file)}>
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleStar}>
                <Star className={`w-4 h-4 mr-2 ${file.isStarred ? 'fill-current' : ''}`} />
                {file.isStarred ? 'Remove star' : 'Add star'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Move to Trash
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default FileListItem;
