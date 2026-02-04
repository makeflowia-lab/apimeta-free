'use client';

import { useState } from 'react';
import { useMetaStore } from '../store/meta-store';

export function MetaDeveloperForm() {
  const addDeveloper = useMetaStore((state) => state.addDeveloper);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    app_id: '',
    app_secret: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDeveloper(formData);
    setFormData({ name: '', email: '', app_id: '', app_secret: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Add Meta Developer Account
      </h3>
      <div className="grid gap-4">
        <input
          placeholder="Account Name (e.g., Marketing Admin)"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Developer Email"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          placeholder="App ID"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.app_id}
          onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="App Secret"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.app_secret}
          onChange={(e) => setFormData({ ...formData, app_secret: e.target.value })}
          required
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Register Developer
        </button>
      </div>
    </form>
  );
}
