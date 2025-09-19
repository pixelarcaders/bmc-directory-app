import { useState, useEffect } from 'react';
import { Business } from '../types';

export const useSavedBusinesses = () => {
  const [savedBusinessIds, setSavedBusinessIds] = useState<Set<string>>(new Set());

  // Load saved business IDs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedBusinessIds');
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        setSavedBusinessIds(new Set(ids));
      } catch (error) {
        console.error('Error loading saved business IDs:', error);
      }
    }
  }, []);

  // Save to localStorage whenever savedBusinessIds changes
  useEffect(() => {
    localStorage.setItem('savedBusinessIds', JSON.stringify(Array.from(savedBusinessIds)));
  }, [savedBusinessIds]);

  const toggleSaved = (business: Business) => {
    const businessId = business.id || business.name;
    const newSavedIds = new Set(savedBusinessIds);
    
    if (newSavedIds.has(businessId)) {
      newSavedIds.delete(businessId);
      // Also remove from saved businesses list
      const savedBusinesses = JSON.parse(localStorage.getItem('savedBusinesses') || '[]');
      const updatedSaved = savedBusinesses.filter((b: Business) => (b.id || b.name) !== businessId);
      localStorage.setItem('savedBusinesses', JSON.stringify(updatedSaved));
    } else {
      newSavedIds.add(businessId);
      // Add to saved businesses list
      const savedBusinesses = JSON.parse(localStorage.getItem('savedBusinesses') || '[]');
      const businessExists = savedBusinesses.some((b: Business) => (b.id || b.name) === businessId);
      if (!businessExists) {
        savedBusinesses.push(business);
        localStorage.setItem('savedBusinesses', JSON.stringify(savedBusinesses));
      }
    }
    
    setSavedBusinessIds(newSavedIds);
  };

  const isSaved = (business: Business) => {
    const businessId = business.id || business.name;
    return savedBusinessIds.has(businessId);
  };

  return {
    toggleSaved,
    isSaved,
    savedCount: savedBusinessIds.size
  };
};