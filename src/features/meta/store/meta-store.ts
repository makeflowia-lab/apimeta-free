import { create } from 'zustand';
import { MetaDeveloper, FacebookPage, AutomationConfig, RegistrationLog } from '../types';
import * as MetaService from '../services/meta-service';

interface MetaState {
  developers: MetaDeveloper[];
  pages: FacebookPage[];
  automations: AutomationConfig[];
  registrationLogs: RegistrationLog[];
  isLoading: boolean;
  error: string | null;

  fetchInitialData: () => Promise<void>;
  addDeveloper: (dev: Omit<MetaDeveloper, 'id' | 'created_at'>) => Promise<void>;
  updateDeveloper: (id: string, dev: Partial<MetaDeveloper>) => Promise<void>;
  deleteDeveloper: (id: string) => Promise<void>;
  syncPage: (page: Omit<FacebookPage, 'id' | 'created_at'>) => Promise<void>;
  syncPages: (developerId: string) => Promise<void>;
  addAutomation: (config: Omit<AutomationConfig, 'id' | 'created_at'>) => Promise<void>;
  addRegistrationLog: (log: Omit<RegistrationLog, 'id' | 'created_at'>) => Promise<void>;
  updateRegistrationLog: (id: string, log: Partial<RegistrationLog>) => Promise<void>;
  deleteRegistrationLog: (id: string) => Promise<void>;
}

export const useMetaStore = create<MetaState>((set, get) => ({
  developers: [],
  pages: [],
  automations: [],
  registrationLogs: [],
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      // Ensure tables exist
      await MetaService.ensureTablesExist();
      
      const [developers, pages, automations, logs] = await Promise.all([
        MetaService.getDevelopers(),
        MetaService.getPages(),
        MetaService.getAutomations(),
        MetaService.getRegistrationLogs()
      ]);
      set({ developers, pages, automations, registrationLogs: logs, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addDeveloper: async (devData) => {
    set({ isLoading: true });
    try {
      const newDev = await MetaService.createDeveloper(devData);
      set((state) => ({ 
        developers: [newDev, ...state.developers], 
      }));
      // Auto-sync after adding
      await get().syncPages(newDev.id);
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateDeveloper: async (id, devData) => {
    set({ isLoading: true });
    try {
      const updatedDev = await MetaService.updateDeveloper(id, devData);
      if (updatedDev) {
        set((state) => ({
          developers: state.developers.map(d => d.id === id ? updatedDev : d),
        }));
        // Auto-sync after updating
        await get().syncPages(id);
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  deleteDeveloper: async (id) => {
    set({ isLoading: true });
    try {
      await MetaService.deleteDeveloper(id);
      set((state) => ({
        developers: state.developers.filter(d => d.id !== id),
        pages: state.pages.filter(p => p.developer_id !== id),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  syncPage: async (pageData) => {
    set({ isLoading: true });
    try {
      const updatedPage = await MetaService.upsertPage(pageData);
      set((state) => ({
        pages: state.pages.some(p => p.page_id === updatedPage.page_id)
          ? state.pages.map(p => p.page_id === updatedPage.page_id ? updatedPage : p)
          : [updatedPage, ...state.pages],
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  syncPages: async (developerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const newPages = await MetaService.syncDeveloperPages(developerId);
      
      if (newPages.length === 0) {
        set({ 
          error: "Conexión exitosa, pero Meta no devolvió ninguna página. Asegúrate de que tu Token tenga permisos 'pages_show_list' y 'pages_read_engagement'.",
          isLoading: false 
        });
        return;
      }

      set((state) => {
        const otherPages = state.pages.filter(p => !newPages.some(np => np.page_id === p.page_id));
        return { 
          pages: [...newPages, ...otherPages], 
          isLoading: false 
        };
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addAutomation: async (configData) => {
    set({ isLoading: true });
    try {
      const newConfig = await MetaService.createAutomation(configData);
      set((state) => ({
        automations: state.automations.some(a => a.id === newConfig.id)
          ? state.automations.map(a => a.id === newConfig.id ? newConfig : a)
          : [newConfig, ...state.automations],
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addRegistrationLog: async (logData) => {
    set({ isLoading: true });
    try {
      const newLog = await MetaService.createRegistrationLog(logData);
      set((state) => ({
        registrationLogs: [newLog, ...state.registrationLogs],
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateRegistrationLog: async (id, logData) => {
    set({ isLoading: true });
    try {
      const updatedLog = await MetaService.updateRegistrationLog(id, logData);
      if (updatedLog) {
        set((state) => ({
          registrationLogs: state.registrationLogs.map(log => log.id === id ? updatedLog : log),
          isLoading: false
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  deleteRegistrationLog: async (id) => {
    set({ isLoading: true });
    try {
      await MetaService.deleteRegistrationLog(id);
      set((state) => ({
        registrationLogs: state.registrationLogs.filter(log => log.id !== id),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
