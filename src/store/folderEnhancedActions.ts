import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, Attachment, TimelineEntry, GeneratedDocument, Deadline } from './types';

export const createFolderEnhancedActions = (set: any, get: any) => ({
  // Attachment actions
  addAttachment: async (folderId: string, attachment: Omit<Attachment, 'id' | 'folderId' | 'uploadedAt'>): Promise<void> => {
    try {
      const newAttachment: Attachment = {
        ...attachment,
        id: uuidv4(),
        folderId,
        uploadedAt: Date.now(),
      };

      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { ...folder, attachments: [...folder.attachments, newAttachment] }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Pièce jointe ajoutée avec succès"
      });
    } catch (error) {
      console.error('Error adding attachment:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de la pièce jointe",
        variant: "destructive"
      });
    }
  },

  removeAttachment: async (folderId: string, attachmentId: string): Promise<void> => {
    try {
      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { ...folder, attachments: folder.attachments.filter(att => att.id !== attachmentId) }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Pièce jointe supprimée"
      });
    } catch (error) {
      console.error('Error removing attachment:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la pièce jointe",
        variant: "destructive"
      });
    }
  },

  // Timeline actions
  addTimelineEntry: async (folderId: string, entry: Omit<TimelineEntry, 'id' | 'folderId' | 'createdAt'>): Promise<void> => {
    try {
      const newEntry: TimelineEntry = {
        ...entry,
        id: uuidv4(),
        folderId,
        createdAt: Date.now(),
      };

      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { ...folder, timeline: [...folder.timeline, newEntry].sort((a, b) => b.date - a.date) }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Événement ajouté à la chronologie"
      });
    } catch (error) {
      console.error('Error adding timeline entry:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout à la chronologie",
        variant: "destructive"
      });
    }
  },

  updateTimelineEntry: async (folderId: string, entryId: string, updates: Partial<TimelineEntry>): Promise<void> => {
    try {
      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { 
                ...folder, 
                timeline: folder.timeline.map(entry => 
                  entry.id === entryId ? { ...entry, ...updates } : entry
                ).sort((a, b) => b.date - a.date)
              }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Événement mis à jour"
      });
    } catch (error) {
      console.error('Error updating timeline entry:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive"
      });
    }
  },

  removeTimelineEntry: async (folderId: string, entryId: string): Promise<void> => {
    try {
      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { ...folder, timeline: folder.timeline.filter(entry => entry.id !== entryId) }
            : folder
        ),
      }));

      toast({
        title: "Succès", 
        description: "Événement supprimé de la chronologie"
      });
    } catch (error) {
      console.error('Error removing timeline entry:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  },

  // Document actions
  addDocument: async (folderId: string, document: Omit<GeneratedDocument, 'id' | 'folderId' | 'createdAt' | 'lastModified'>): Promise<void> => {
    try {
      const now = Date.now();
      const newDocument: GeneratedDocument = {
        ...document,
        id: uuidv4(),
        folderId,
        createdAt: now,
        lastModified: now,
      };

      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { ...folder, documents: [...folder.documents, newDocument] }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Document généré avec succès"
      });
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du document",
        variant: "destructive"
      });
    }
  },

  updateDocument: async (folderId: string, documentId: string, updates: Partial<GeneratedDocument>): Promise<void> => {
    try {
      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { 
                ...folder, 
                documents: folder.documents.map(doc => 
                  doc.id === documentId 
                    ? { ...doc, ...updates, lastModified: Date.now() }
                    : doc
                )
              }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Document mis à jour"
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du document",
        variant: "destructive"
      });
    }
  },

  removeDocument: async (folderId: string, documentId: string): Promise<void> => {
    try {
      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { ...folder, documents: folder.documents.filter(doc => doc.id !== documentId) }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Document supprimé"
      });
    } catch (error) {
      console.error('Error removing document:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du document",
        variant: "destructive"
      });
    }
  },

  // Deadline actions
  addDeadline: async (folderId: string, deadline: Omit<Deadline, 'id' | 'folderId' | 'createdAt'>): Promise<void> => {
    try {
      const newDeadline: Deadline = {
        ...deadline,
        id: uuidv4(),
        folderId,
        createdAt: Date.now(),
      };

      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { ...folder, deadlines: [...folder.deadlines, newDeadline].sort((a, b) => a.dueDate - b.dueDate) }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Échéance ajoutée"
      });
    } catch (error) {
      console.error('Error adding deadline:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'échéance",
        variant: "destructive"
      });
    }
  },

  updateDeadline: async (folderId: string, deadlineId: string, updates: Partial<Deadline>): Promise<void> => {
    try {
      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { 
                ...folder, 
                deadlines: folder.deadlines.map(deadline => 
                  deadline.id === deadlineId ? { ...deadline, ...updates } : deadline
                ).sort((a, b) => a.dueDate - b.dueDate)
              }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Échéance mise à jour"
      });
    } catch (error) {
      console.error('Error updating deadline:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'échéance",
        variant: "destructive"
      });
    }
  },

  removeDeadline: async (folderId: string, deadlineId: string): Promise<void> => {
    try {
      set((state: ChatState) => ({
        folders: state.folders.map(folder => 
          folder.id === folderId 
            ? { ...folder, deadlines: folder.deadlines.filter(deadline => deadline.id !== deadlineId) }
            : folder
        ),
      }));

      toast({
        title: "Succès",
        description: "Échéance supprimée"
      });
    } catch (error) {
      console.error('Error removing deadline:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'échéance",
        variant: "destructive"
      });
    }
  },
});