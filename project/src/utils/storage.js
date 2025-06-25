// LocalStorage utilities for Mini Memory Journal

export const STORAGE_KEY = 'mini-memory-journal-entries';

export const getEntries = () => {
  try {
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error loading entries:', error);
    return [];
  }
};

export const saveEntry = (entry) => {
  try {
    const entries = getEntries();
    const newEntry = {
      id: entry.id || Date.now().toString(),
      title: entry.title || 'Untitled Entry',
      text: entry.text || '',
      imageURL: entry.imageURL || '',
      doodleDataURL: entry.doodleDataURL || '',
      mood: entry.mood || '😊',
      stickers: entry.stickers || [],
      musicURL: entry.musicURL || '',
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = entries.findIndex(e => e.id === newEntry.id);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = newEntry;
    } else {
      entries.unshift(newEntry);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  } catch (error) {
    console.error('Error saving entry:', error);
    throw error;
  }
};

export const deleteEntry = (id) => {
  try {
    const entries = getEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
    return true;
  } catch (error) {
    console.error('Error deleting entry:', error);
    return false;
  }
};

export const getEntryById = (id) => {
  const entries = getEntries();
  return entries.find(entry => entry.id === id);
};

export const exportToJSON = () => {
  const entries = getEntries();
  const dataStr = JSON.stringify(entries, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `mini-memory-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedEntries = JSON.parse(e.target.result);
        if (Array.isArray(importedEntries)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(importedEntries));
          resolve(importedEntries);
        } else {
          reject('Invalid file format');
        }
      } catch (error) {
        reject('Error parsing file');
      }
    };
    reader.readAsText(file);
  });
};