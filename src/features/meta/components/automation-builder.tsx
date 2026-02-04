'use client';

import React, { useState } from 'react';
import { useMetaStore } from '../store/meta-store';
import { FacebookPage } from '../types';

export function AutomationBuilder({ page, onClose }: { page: FacebookPage; onClose: () => void }) {
  const addAutomation = useMetaStore((state) => state.addAutomation);
  const isLoading = useMetaStore((state) => state.isLoading);
  const [config, setConfig] = useState({
    config_name: `Automation for ${page.name}`,
    is_active: true,
    settings: {
      auto_reply: true,
      ai_enabled: true,
      template_id: 'default'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAutomation({
      page_id: page.id,
      config_name: config.config_name,
      settings: config.settings,
      is_active: config.is_active
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Configure Automation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <p className="text-gray-400 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Setting up for <strong>{page.name}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Internal Name</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={config.config_name}
              onChange={(e) => setConfig({ ...config, config_name: e.target.value })}
              title="Internal Name"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-400">Settings</label>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <p className="text-white font-medium">Automatic Replies</p>
                <p className="text-[10px] text-gray-500">Respond to comments automagically</p>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-blue-600"
                checked={config.settings.auto_reply}
                onChange={(e) => setConfig({ 
                  ...config, 
                  settings: { ...config.settings, auto_reply: e.target.checked } 
                })}
                title="Automatic Replies"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <p className="text-white font-medium">AI Brain Integration</p>
                <p className="text-[10px] text-gray-500">Use LLM to generate smarter responses</p>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-blue-600"
                checked={config.settings.ai_enabled}
                onChange={(e) => setConfig({ 
                  ...config, 
                  settings: { ...config.settings, ai_enabled: e.target.checked } 
                })}
                title="AI Brain Integration"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <p className="text-white font-medium">Is Active</p>
                <p className="text-[10px] text-gray-500">Enable/Disable entire flow</p>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-blue-600"
                checked={config.is_active}
                onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
                title="Is Active"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
