export async function fetchFacebookPages(accessToken: string) {
  const url = `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}&fields=id,name,access_token,fan_count,category`;
  
  console.log('[MetaAPI] Intentando sincronizar páginas...');
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error('[MetaAPI] Error detectado:', data.error);
      throw new Error(data.error.message || 'Failed to fetch pages from Meta');
    }
    
    if (!data.data || data.data.length === 0) {
      console.warn('[MetaAPI] La respuesta fue exitosa pero Meta devolvió 0 páginas. Verifica que el token tenga permisos pages_show_list y que la App no esté en modo desarrollo restrictivo.');
      return [];
    }

    console.log(`[MetaAPI] Éxito: Se encontraron ${data.data.length} páginas.`);
    
    return data.data.map((page: any) => ({
      page_id: page.id,
      name: page.name,
      access_token: page.access_token,
      fan_count: page.fan_count || 0,
      category: page.category
    }));
  } catch (error) {
    console.error('[MetaAPI] Error crítico en la llamada a Meta:', error);
    throw error;
  }
}
