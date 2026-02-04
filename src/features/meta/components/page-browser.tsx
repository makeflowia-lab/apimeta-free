'use client';

import { useMetaStore } from '../store/meta-store';

export function PageBrowser() {
  const { pages, isLoading, syncPage } = useMetaStore();

  if (isLoading && pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <div key={page.id} className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {page.name[0]}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{page.name}</h4>
                <p className="text-xs text-muted-foreground">{page.category}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">{page.fan_count.toLocaleString()}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fans</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-[10px] font-mono text-muted-foreground">ID: {page.page_id}</span>
            <button 
              onClick={() => syncPage(page)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sync Now
            </button>
          </div>
        </div>
      ))}
      
      {pages.length === 0 && !isLoading && (
        <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground">No Facebook Pages found. Start by adding a Meta Developer account.</p>
        </div>
      )}
    </div>
  );
}
