import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileItem, useFileStore } from '@/store/fileStore';
import { useToast } from '@/hooks/use-toast';

interface RenameModalProps {
  file: FileItem | null;
  onClose: () => void;
}

const RenameModal = ({ file, onClose }: RenameModalProps) => {
  const [newName, setNewName] = useState('');
  const { renameFile } = useFileStore();
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      setNewName(file.name);
    }
  }, [file]);

  const handleRename = () => {
    if (file && newName.trim()) {
      renameFile(file.id, newName.trim());
      toast({ title: 'File renamed', description: `File has been renamed to "${newName.trim()}"` });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {file && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Rename File</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5">
              <label className="text-sm font-medium text-foreground mb-2 block">New Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="py-5 rounded-xl"
                placeholder="Enter new file name..."
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              />
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleRename}
                disabled={!newName.trim() || newName === file.name}
                className="gradient-primary text-primary-foreground"
              >
                Rename
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RenameModal;
