import React, { createContext, useContext } from 'react';
import { useLinkedInAuth } from './useLinkedInAuth';

type LinkedInAuthValue = ReturnType<typeof useLinkedInAuth>;

const LinkedInAuthContext = createContext<LinkedInAuthValue | null>(null);

/**
 * Partage un unique état d'authentification entre tous les points de montage
 * (barre de navigation desktop et menu mobile). Sans ce contexte, chaque
 * instance interrogerait `/me` de son côté et une déconnexion ne serait
 * répercutée que sur l'instance cliquée.
 */
export const LinkedInAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useLinkedInAuth();
  return <LinkedInAuthContext.Provider value={value}>{children}</LinkedInAuthContext.Provider>;
};

export function useLinkedInAuthContext(): LinkedInAuthValue {
  const value = useContext(LinkedInAuthContext);
  if (!value) {
    throw new Error('useLinkedInAuthContext doit être utilisé dans <LinkedInAuthProvider>.');
  }
  return value;
}
