import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";
import { legal } from "@/config/legal";
import { SiteShell } from "@/components/layout/SiteShell";
import { LegalDocument, OwnerDetails, type LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Cómo trata ${site.owner} los datos personales que recibe a través de esta web.`,
  alternates: { canonical: absoluteUrl("/privacidad") },
};

const email = <a href={`mailto:${legal.email}`}>{legal.email}</a>;

const sections: LegalSection[] = [
  {
    id: "responsable",
    title: "Responsable del tratamiento",
    content: (
      <>
        <p>El responsable de los datos personales que se recogen en esta web es:</p>
        <OwnerDetails />
      </>
    ),
  },
  {
    id: "datos",
    title: "Qué datos trato",
    content: (
      <>
        <p>Solo trato los datos que me envías a través del formulario de contacto:</p>
        <ul>
          <li>Tu nombre y tu correo electrónico.</li>
          <li>El nombre de tu empresa, si decides indicarlo.</li>
          <li>El tipo de proyecto que te interesa y el mensaje que me escribes.</li>
        </ul>
        <p>
          Te pido que no incluyas en el mensaje datos especialmente sensibles (como datos de salud) ni datos de otras
          personas que no te hayan dado su permiso.
        </p>
        <p>
          Además, como ocurre con cualquier web, el servicio de alojamiento puede registrar datos técnicos de las
          visitas, como la dirección IP, el navegador o la hora de acceso, para garantizar la seguridad y el
          funcionamiento del servicio.
        </p>
      </>
    ),
  },
  {
    id: "finalidad",
    title: "Para qué los uso",
    content: (
      <>
        <ul>
          <li>Responder a tu consulta y mantener la conversación que inicies conmigo.</li>
          <li>Si me lo pides, preparar y enviarte una propuesta o un presupuesto.</li>
          <li>Proteger la web y el formulario frente a usos indebidos y envíos automáticos (spam).</li>
        </ul>
        <p>
          No uso tus datos para enviarte publicidad sin tu consentimiento, no elaboro perfiles y no tomo decisiones
          automatizadas que te afecten.
        </p>
      </>
    ),
  },
  {
    id: "base-juridica",
    title: "Base jurídica",
    content: (
      <ul>
        <li>
          <strong>Tu consentimiento</strong> (artículo 6.1.a del RGPD), que das al marcar la casilla del formulario.
          Puedes retirarlo en cualquier momento, sin que ello afecte a lo tratado antes.
        </li>
        <li>
          <strong>La aplicación de medidas precontractuales</strong> (artículo 6.1.b del RGPD) cuando me pides una
          propuesta o un presupuesto.
        </li>
        <li>
          <strong>El interés legítimo</strong> (artículo 6.1.f del RGPD) en mantener la web segura y libre de spam,
          para los datos técnicos de las visitas.
        </li>
      </ul>
    ),
  },
  {
    id: "conservacion",
    title: "Cuánto tiempo los conservo",
    content: (
      <>
        <p>
          Conservo tus datos mientras sean necesarios para atender tu consulta. Si llegamos a trabajar juntos, los
          mantendré durante la relación y, después, durante los plazos que exija la ley.
        </p>
        <p>
          Si no llega a haber relación comercial, los suprimiré como máximo en {legal.retentionWithoutContract}.
          Puedes pedirme que los borre antes.
        </p>
      </>
    ),
  },
  {
    id: "destinatarios",
    title: "Con quién los comparto",
    content: (
      <>
        <p>
          No vendo ni cedo tus datos a terceros, salvo obligación legal (por ejemplo, si me los requiere una
          autoridad competente).
        </p>
        <p>
          Para que la web y el formulario funcionen me apoyo en proveedores que tratan los datos por mi cuenta, como
          encargados del tratamiento, y solo para prestar su servicio:
        </p>
        <ul>
          <li>
            <strong>Formspree</strong>, el servicio que recibe los mensajes del formulario y me los reenvía por
            correo electrónico.
          </li>
          <li>
            <strong>GitHub Pages</strong>, el servicio de GitHub que aloja esta web.
          </li>
          <li>El servicio de correo electrónico con el que recibo y gestiono los mensajes.</li>
        </ul>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "Transferencias internacionales",
    content: (
      <p>
        Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En ese caso, la
        transferencia debe contar con las garantías que exige el RGPD, como una decisión de adecuación de la
        Comisión Europea o cláusulas contractuales tipo aprobadas por la Comisión. Puedes pedirme más información
        sobre estas garantías escribiéndome a {email}.
      </p>
    ),
  },
  {
    id: "derechos",
    title: "Tus derechos",
    content: (
      <>
        <p>En cualquier momento puedes:</p>
        <ul>
          <li>Acceder a tus datos y saber cómo los trato.</li>
          <li>Rectificarlos si son inexactos o pedirme que los suprima.</li>
          <li>Oponerte a su tratamiento o pedir que lo limite.</li>
          <li>Solicitar su portabilidad.</li>
          <li>Retirar el consentimiento que me diste.</li>
        </ul>
        <p>
          Para ejercerlos, escríbeme a {email} indicando qué derecho quieres ejercer. Si no puedo confirmar tu
          identidad, te pediré algún dato adicional. Te responderé en el plazo de un mes, que la ley permite ampliar
          en casos complejos.
        </p>
        <p>
          Si consideras que no he tratado bien tus datos, puedes presentar una reclamación ante la Agencia Española
          de Protección de Datos en{" "}
          <a href="https://www.aepd.es" rel="noopener noreferrer">
            www.aepd.es
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "menores",
    title: "Menores de edad",
    content: (
      <p>
        Esta web se dirige a empresas y profesionales. Si tienes menos de 14 años, no me envíes tus datos a través
        del formulario.
      </p>
    ),
  },
  {
    id: "seguridad",
    title: "Seguridad",
    content: (
      <p>
        Aplico medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no autorizados,
        pérdidas o alteraciones. La web se sirve con conexión cifrada (HTTPS) y el formulario envía los datos también
        de forma cifrada.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>
          Esta web no utiliza cookies ni otras tecnologías de seguimiento, analítica o publicidad. Las tipografías y
          las ilustraciones se sirven desde la propia web, sin conexiones a servicios de terceros. La única conexión
          con un servicio externo se produce cuando envías el formulario, para hacerme llegar tu mensaje a través de
          Formspree.
        </p>
        <p>
          Si en el futuro incorporo herramientas que utilicen cookies, actualizaré esta política y te pediré el
          consentimiento cuando la ley lo exija.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    title: "Cambios en esta política",
    content: (
      <p>
        Puedo actualizar esta política para adaptarla a cambios en la web o en la normativa. Publicaré siempre la
        versión vigente en esta página, con su fecha de actualización.
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <SiteShell>
      <LegalDocument
        title="Política de privacidad"
        intro={
          <p>
            Qué datos recojo cuando me escribes, para qué los uso y cómo puedes controlarlos, conforme al Reglamento
            General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
          </p>
        }
        sections={sections}
      />
    </SiteShell>
  );
}
