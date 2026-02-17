import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Star, FileText, Image, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileItem, useFileStore } from '@/store/fileStore';
import { useToast } from '@/hooks/use-toast';

interface FilePreviewModalProps {
  file: FileItem | null;
  onClose: () => void;
  files: FileItem[];
  onNavigate: (file: FileItem) => void;
}

const FilePreviewModal = ({ file, onClose, files, onNavigate }: FilePreviewModalProps) => {
  const { downloadFile, toggleStar } = useFileStore();
  const { toast } = useToast();

  if (!file) return null;

  const currentIndex = files.findIndex((f) => f.id === file.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < files.length - 1;

  const handleDownload = async () => {
    try {
      await downloadFile(file.cloudinary_url, file.name);
      toast({ title: 'Download started' });
    } catch {
      toast({ title: 'Download failed', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(file.cloudinary_url);
      toast({ title: 'Link copied!', description: 'Share link copied to clipboard' });
    } catch {
      toast({ title: 'Failed to copy link', variant: 'destructive' });
    }
  };

  const handleStar = async () => {
    await toggleStar(file.id, file.isStarred || false);
  };

  const renderPreview = () => {
    switch (file.type) {
      case 'image':
        return (
          <img
            src={file.cloudinary_url}
            alt={file.name}
            className="max-w-full max-h-[60vh] object-contain rounded-xl"
          />
        );
      case 'video':
        return (
          <video
            src={file.cloudinary_url}
            controls
            className="max-w-full max-h-[60vh] rounded-xl"
          />
        );
      default:
        return (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <p className="text-muted-foreground">Preview not available for this file type</p>
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download to view
            </Button>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-foreground/80 backdrop-blur-md z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-card rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{file.name}</h3>
              <p className="text-sm text-muted-foreground">{file.size} • {file.uploadDate}</p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <Button variant="ghost" size="icon" onClick={handleStar} className="shrink-0">
                <Star className={`w-4 h-4 ${file.isStarred ? 'fill-current text-yellow-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} className="shrink-0">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload} className="shrink-0">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto min-h-0 relative">
            {/* Nav arrows */}
            {hasPrev && (
              <button
                onClick={() => onNavigate(files[currentIndex - 1])}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center hover:bg-accent transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={() => onNavigate(files[currentIndex + 1])}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center hover:bg-accent transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            {renderPreview()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreviewModal;
