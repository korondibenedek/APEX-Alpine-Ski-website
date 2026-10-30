/* Custom resort persistence in browser storage. */

export function getCustomResorts() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem('apex_custom_resorts');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomResort(resort) {
  if (!resort || !resort.id) return false;
  try {
    const list = getCustomResorts();
    const idx = list.findIndex(r => r.id === resort.id);
    if (idx >= 0) {
      list[idx] = resort;
    } else {
      list.unshift(resort); // Place newly generated resort on top
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apex_custom_resorts', JSON.stringify(list));
      localStorage.setItem('apex_custom_resort_' + resort.id, JSON.stringify(resort));
    }
    return true;
  } catch (e) {
    console.error('Failed to save custom resort to localStorage:', e);
    return false;
  }
}

export function deleteCustomResort(resortId) {
  try {
    let list = getCustomResorts();
    list = list.filter(r => r.id !== resortId);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apex_custom_resorts', JSON.stringify(list));
      localStorage.removeItem('apex_custom_resort_' + resortId);
    }
    return true;
  } catch (e) {
    return false;
  }
}
