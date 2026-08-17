import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, BadgeCheck, Linkedin, Loader2, LogOut } from 'lucide-react';
import { useLinkedInAuthContext } from '../hooks/LinkedInAuthContext';
import type { LinkedInProfile } from '../hooks/useLinkedInAuth';

/** Couleur de marque LinkedIn. */
const LINKEDIN_BLUE = '#0A66C2';

interface LinkedInConnectProps {
  /** `mobile` s'étale sur toute la largeur du menu déroulant. */
  variant?: 'desktop' | 'mobile';
  /** Appelé après une action, pour refermer le menu mobile. */
  onAction?: () => void;
}

function initials(profile: LinkedInProfile): string {
  const first = profile.givenName?.[0] ?? profile.name?.[0] ?? '?';
  const last = profile.familyName?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
}

function displayName(profile: LinkedInProfile): string {
  return profile.givenName ?? profile.name ?? 'Membre LinkedIn';
}

const Avatar: React.FC<{ profile: LinkedInProfile; size: number }> = ({ profile, size }) => {
  const [broken, setBroken] = useState(false);
  const showImage = profile.picture && !broken;

  return (
    <span
      className="shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-indigo-600/30 text-indigo-200 font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {showImage ? (
        <img
          src={profile.picture}
          alt=""
          width={size}
          height={size}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      ) : (
        initials(profile)
      )}
    </span>
  );
};

const LinkedInConnect: React.FC<LinkedInConnectProps> = ({ variant = 'desktop', onAction }) => {
  const { state, login, logout, dismissError } = useLinkedInAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = variant === 'mobile';

  // Fermeture du menu au clic extérieur et à la touche Échap.
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  // Sans backend joignable (déploiement statique), on n'affiche rien plutôt
  // qu'un bouton qui mènerait à une 404.
  if (state.status === 'unavailable') return null;

  if (state.status === 'loading') {
    return (
      <span
        className={`flex items-center gap-2 text-sm text-gray-500 ${isMobile ? 'justify-center py-3' : ''}`}
        aria-live="polite"
      >
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        <span className="sr-only">Vérification de la session LinkedIn…</span>
      </span>
    );
  }

  if (state.status === 'unconfigured') {
    return (
      <span
        title={state.message}
        className={`flex items-center gap-2 text-xs text-amber-400/80 ${isMobile ? 'justify-center py-3' : ''}`}
      >
        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
        LinkedIn non configuré
      </span>
    );
  }

  if (state.status === 'authenticated') {
    const { profile } = state;

    return (
      <div ref={containerRef} className={`relative ${isMobile ? 'w-full' : ''}`}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className={`flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${
            isMobile ? 'w-full justify-center py-3 px-4' : 'py-1.5 pl-1.5 pr-4'
          }`}
        >
          <Avatar profile={profile} size={isMobile ? 32 : 28} />
          <span className="text-sm font-medium text-white truncate max-w-[10rem]">
            {displayName(profile)}
          </span>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className={`z-50 glass-card rounded-2xl p-4 bg-[#0B0C15] ${
                isMobile ? 'relative mt-3 w-full' : 'absolute right-0 mt-3 w-72'
              }`}
            >
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <Avatar profile={profile} size={40} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {profile.name ?? displayName(profile)}
                  </p>
                  {profile.email && (
                    <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                      {profile.email}
                      {profile.emailVerified && (
                        <BadgeCheck
                          className="w-3.5 h-3.5 text-indigo-400 shrink-0"
                          aria-label="Adresse vérifiée par LinkedIn"
                        />
                      )}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 py-3">
                Compte LinkedIn connecté à ACode.tech.
              </p>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  void logout();
                  onAction?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-300 text-gray-300 text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Se déconnecter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // `anonymous` et `error` partagent le même bouton d'appel à l'action.
  return (
    <div className={isMobile ? 'w-full' : 'relative'}>
      <button
        type="button"
        onClick={() => {
          dismissError();
          login();
          onAction?.();
        }}
        style={{ backgroundColor: LINKEDIN_BLUE }}
        className={`flex items-center gap-2 font-semibold text-white text-sm hover:brightness-110 transition-all ${
          isMobile ? 'w-full justify-center py-3 rounded-lg' : 'px-5 py-2.5 rounded-full'
        }`}
      >
        <Linkedin className="w-4 h-4" aria-hidden="true" />
        Se connecter avec LinkedIn
      </button>

      {state.status === 'error' && (
        <p
          role="alert"
          className={`flex items-start gap-1.5 text-xs text-red-400 mt-2 ${
            isMobile ? '' : 'absolute right-0 w-64 text-right'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{state.message}</span>
        </p>
      )}
    </div>
  );
};

export default LinkedInConnect;
