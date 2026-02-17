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

interface FileCardProps {
  file: FileItem;
  index: number;
  onRename: (file: FileItem) => void;
  onPreview?: (file: FileItem) => void;
}

const FileCard = ({ file, index, onRename, onPreview }: FileCardProps) => {
  const { deleteFile, toggleStar, restoreFile, permanentlyDeleteFile, downloadFile, currentFolder } = useFileStore();
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
        return 'text-pink-500 bg-pink-500/10';
      case 'video':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const Icon = getFileIcon();

  const handleDelete = async () => {
    try {
      if (isTrash) {
        await permanentlyDeleteFile(file.id, file.cloudinary_public_id);
        toast({ title: 'File permanently deleted' });
      } else {
        await deleteFile(file.id);
        toast({ title: 'Moved to trash', description: 'You can restore it from the trash folder' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete file', variant: 'destructive' });
    }
  };

  const handleRestore = async () => {
    try {
      await restoreFile(file.id);
      toast({ title: 'File restored', description: 'The file has been restored to your files' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to restore file', variant: 'destructive' });
    }
  };

  const handleDownload = async () => {
    try {
      toast({ title: 'Download started', description: `Downloading ${file.name}` });
      await downloadFile(file.cloudinary_url, file.name);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download file', variant: 'destructive' });
    }
  };

  const handleStar = async () => {
    try {
      await toggleStar(file.id, file.isStarred || false);
      toast({ title: file.isStarred ? 'Removed from starred' : 'Added to starred' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update star', variant: 'destructive' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => onPreview?.(file)}
      className="group bg-card rounded-2xl border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt={file.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-16 h-16 rounded-2xl ${getIconColor()} flex items-center justify-center`}>
              <Icon className="w-8 h-8" />
            </div>
          </div>
        )}

        {/* Star badge */}
        {file.isStarred && (
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-warning flex items-center justify-center">
            <Star className="w-4 h-4 text-warning-foreground fill-current" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate" title={file.name}>
              {file.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">{file.size}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{file.uploadDate}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
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
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;
