import { useState } from 'react';

export type Page = 'directory' | 'events' | 'add-business' | 'saved' | 'more' | 'about' | 'contact' | 'privacy' | 'terms' | 'advisory';

export const useNavigation = () => {
  const [currentPage, setCurrentPage] = useState<Page>('directory');

  return { currentPage, setCurrentPage };
};