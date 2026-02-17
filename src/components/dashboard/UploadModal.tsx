import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Image, Video, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileStore } from '@/store/fileStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadItem {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  preview?: string;
  error?: string;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  return FileText;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useFileStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems: UploadItem[] = Array.from(files).map((file) => ({
      file,
      id: crypto.randomUUID(),
      status: 'pending' as const,
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));
    setUploadItems((prev) => [...prev, ...newItems]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeItem = (id: string) => {
    setUploadItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleUploadAll = async () => {
    if (!user || uploadItems.length === 0) return;
    setIsUploading(true);

    for (const item of uploadItems) {
      if (item.status === 'done') continue;

      setUploadItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 30 } : i))
      );

      try {
        await uploadFile(item.file, user.id);
        setUploadItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'done', progress: 100 } : i))
        );
      } catch (error) {
        setUploadItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error', progress: 0, error: 'Upload failed' }
              : i
          )
        );
      }
    }

    setIsUploading(false);
    const succeeded = uploadItems.filter((i) => i.status !== 'error').length;
    toast({
      title: 'Upload complete!',
      description: `${succeeded} file(s) uploaded successfully.`,
    });
  };

  const resetAndClose = () => {
    uploadItems.forEach((i) => {
      if (i.preview) URL.revokeObjectURL(i.preview);
    });
    setUploadItems([]);
    onClose();
  };

  const pendingCount = uploadItems.filter((i) => i.status === 'pending' || i.status === 'error').length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[80vh] bg-card rounded-3xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h2 className="text-xl font-semibold text-foreground">Upload Files</h2>
              <button onClick={resetAndClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto flex-1 min-h-0">
              {/* Drop zone - always visible */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-1">
                  Drop files here or click to browse
                </h3>
                <p className="text-sm text-muted-foreground">
                  Images, videos, and documents up to 50MB
                </p>
              </div>

              {/* File list */}
              {uploadItems.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadItems.map((item) => {
                    const Icon = getFileIcon(item.file.type);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                      >
                        {item.preview ? (
                          <img src={item.preview} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatSize(item.file.size)}</p>
                          {item.status === 'uploading' && (
                            <Progress value={item.progress} className="h-1 mt-1" />
                          )}
                        </div>

                        <div className="shrink-0">
                          {item.status === 'done' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                          {item.status === 'error' && <AlertCircle className="w-5 h-5 text-destructive" />}
                          {item.status === 'uploading' && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                          {item.status === 'pending' && (
                            <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-background transition-colors">
                              <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 p-5 border-t border-border shrink-0">
              <p className="text-sm text-muted-foreground">
                {uploadItems.length > 0 ? `${uploadItems.length} file(s) selected` : 'No files selected'}
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={resetAndClose} size="sm">
                  Cancel
                </Button>
                <Button
                  onClick={handleUploadAll}
                  disabled={pendingCount === 0 || isUploading}
                  size="sm"
                  className="gradient-primary text-primary-foreground"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {pendingCount > 0 ? `(${pendingCount})` : ''}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
