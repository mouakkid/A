import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Politique de confidentialité de Garmin.ma : données de compte, fichiers GPS traités dans le navigateur, cookies, cartes et mesure d'audience.",
  alternates: { canonical: "/confidentialite" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Confidentialité" }]} eyebrow="Vos données" title="Politique de confidentialité" intro="Dernière mise à jour : 18 septembre 2026." />
      <div className="container-x py-12">
        <Prose>
          <h2>Fichiers sportifs (GPX, TCX)</h2>
          <p>Les outils de Garmin.ma traitent vos fichiers directement dans votre navigateur. Par défaut, aucun fichier sportif n'est envoyé sur nos serveurs, et aucun contenu de fichier n'apparaît dans nos journaux ni dans une mesure d'audience. Le fichier original n'est jamais modifié : les outils produisent des copies que vous téléchargez.</p>
          <h2>Cartes</h2>
          <p>L'affichage cartographique d'une trace peut contacter un fournisseur de tuiles externe, qui reçoit alors les zones géographiques affichées et votre adresse IP. Cet affichage est optionnel : l'analyse fonctionne sans carte, et la carte n'est chargée que si vous l'activez.</p>
          <h2>Compte et forum</h2>
          <p>Pour participer au forum, nous stockons : votre adresse e-mail (jamais affichée), votre pseudonyme, un mot de passe haché (scrypt), vos messages, et des informations techniques minimales de session. Nous ne demandons jamais vos identifiants Garmin Connect. Vous pouvez demander la suppression de votre compte via la page Contact.</p>
          <h2>Cookies</h2>
          <p>Un cookie de session strictement nécessaire est déposé à la connexion. Les préférences d'affichage (thème, sélection du comparateur) sont conservées localement dans votre navigateur et ne nous sont pas transmises.</p>
          <h2>Mesure d'audience</h2>
          <p>Aucun outil de mesure d'audience n'est actif sur cette version. Si un outil respectueux de la vie privée est ajouté, cette page sera mise à jour avant son activation.</p>
          <h2>Limitation de débit et sécurité</h2>
          <p>Pour protéger le forum contre le spam, nous comptons le nombre de requêtes par compte ou par adresse IP sur de courtes fenêtres de temps. Ces compteurs ne contiennent pas le contenu des messages.</p>
          <h2>Contact</h2>
          <p>Pour toute question relative à vos données : voir la page Contact.</p>
        </Prose>
      </div>
    </>
  );
}
