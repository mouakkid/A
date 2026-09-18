/** Applique le thème avant le premier rendu pour éviter un flash (lit localStorage, sinon préférence système). */
export function ThemeScript() {
  const code = `(function(){try{var m=localStorage.getItem('gma-theme');var d=m==='dark'||((!m||m==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
