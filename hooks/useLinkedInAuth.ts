import { useCallback, useEffect, useState } from 'react';

export interface LinkedInProfile {
  sub: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  email?: string;
  emailVerified?: boolean;
  locale?: string;
}

export type LinkedInAuthState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; profile: LinkedInProfile }
  /** Le backend répond mais les identifiants LinkedIn ne sont pas renseignés. */
  | { status: 'unconfigured'; message: string }
  /** Aucun backend joignable (site déployé en statique pur). */
  | { status: 'unavailable' }
  | { status: 'error'; message: string };

const API_BASE = '/api/auth/linkedin';

/** Codes renvoyés par LinkedIn ou par notre callback, traduits pour l'utilisateur. */
const ERROR_MESSAGES: Record<string, string> = {
  user_cancelled_login: 'Connexion annulée : vous ne vous êtes pas identifié sur LinkedIn.',
  user_cancelled_authorize: "Connexion annulée : l'autorisation a été refusée.",
  missing_code: "LinkedIn n'a pas renvoyé de code d'autorisation. Réessayez.",
  token_exchange_failed: "L'échange du code d'autorisation a échoué. Vérifiez la configuration de l'application LinkedIn.",
  userinfo_failed: 'Impossible de récupérer votre profil LinkedIn.',
  id_token_invalid: "Le jeton d'identité LinkedIn n'a pas pu être validé.",
  jwks_failed: 'Impossible de récupérer les clés de signature LinkedIn.',
  upstream_timeout: 'LinkedIn ne répond pas. Réessayez dans un instant.',
};

function describeError(code: string): string {
  return ERROR_MESSAGES[code] ?? `La connexion LinkedIn a échoué (${code}).`;
}

/**
 * Retire les paramètres du flux OAuth de l'URL affichée, sans recharger la page
 * ni empiler une entrée d'historique.
 */
function consumeCallbackParams(): { error?: string; connected: boolean } {
  if (typeof window === 'undefined') return { connected: false };

  const url = new URL(window.location.href);
  const error = url.searchParams.get('li_error') ?? undefined;
  const connected = url.searchParams.get('li') === 'connected';

  if (error || connected) {
    url.searchParams.delete('li_error');
    url.searchParams.delete('li');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }
  return { error, connected };
}

export function useLinkedInAuth() {
  const [state, setState] = useState<LinkedInAuthState>({ status: 'loading' });

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/me`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });

      // Sur un hébergement statique, `/api/...` retombe sur index.html : on le
      // détecte au Content-Type plutôt que de laisser JSON.parse échouer.
      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        setState({ status: 'unavailable' });
        return;
      }

      const body = await response.json();
      if (body.status === 'authenticated') {
        setState({ status: 'authenticated', profile: body.profile });
      } else if (body.status === 'unconfigured') {
        setState({ status: 'unconfigured', message: body.message });
      } else {
        setState({ status: 'anonymous' });
      }
    } catch {
      setState({ status: 'unavailable' });
    }
  }, []);

  useEffect(() => {
    const { error } = consumeCallbackParams();
    if (error) {
      setState({ status: 'error', message: describeError(error) });
      return;
    }
    void refresh();
  }, [refresh]);

  /** Navigation top-level obligatoire : LinkedIn refuse d'être chargé en iframe. */
  const login = useCallback(() => {
    window.location.href = `${API_BASE}/login`;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'same-origin' });
    } finally {
      setState({ status: 'anonymous' });
    }
  }, []);

  const dismissError = useCallback(() => setState({ status: 'anonymous' }), []);

  return { state, login, logout, refresh, dismissError };
}
