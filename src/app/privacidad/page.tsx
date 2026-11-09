import type { Metadata } from "next";
import { site } from "@/config/site";
import { legal } from "@/config/legal";
import { SiteShell } from "@/components/layout/SiteShell";
import { Field, LegalDocument, OwnerDetails, type LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Cómo trata ${site.name} los datos personales que recibe a través de su web.`,
  alternates: { canonical: "/privacidad" },
};

const owner = <Field value={legal.ownerName} label="Razón social o nombre" />;
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
    title: "Qué datos tratamos",
    content: (
      <>
        <p>Solo tratamos los datos que nos envías a través del formulario de contacto:</p>
        <ul>
          <li>Nombre y correo electrónico.</li>
          <li>Nombre de tu empresa, si decides indicarlo.</li>
          <li>El tipo de ayuda que buscas y el mensaje que nos escribes.</li>
        </ul>
        <p>
          Te pedimos que no incluyas en el mensaje datos especialmente sensibles (como datos de
          salud) ni datos de otras personas que no te hayan dado su permiso.
        </p>
        <p>
          Además, como cualquier web, el proveedor de alojamiento puede registrar datos técnicos de
          las visitas, como la dirección IP, el navegador o la hora de acceso, para garantizar la
          seguridad y el funcionamiento del servicio.
        </p>
      </>
    ),
  },
  {
    id: "finalidad",
    title: "Para qué los usamos",
    content: (
      <>
        <ul>
          <li>Responder a tu consulta y mantener la conversación que inicies con nosotros.</li>
          <li>
            Si nos lo pides, preparar y enviarte un diagnóstico o una propuesta de servicios.
          </li>
          <li>Proteger la web frente a usos indebidos y ataques.</li>
        </ul>
        <p>
          No usamos tus datos para enviarte publicidad sin tu consentimiento, no elaboramos
          perfiles y no tomamos decisiones automatizadas que te afecten.
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
          <strong>Tu consentimiento</strong> (artículo 6.1.a del RGPD), que das al marcar la
          casilla del formulario. Puedes retirarlo en cualquier momento, sin que ello afecte a lo
          tratado antes.
        </li>
        <li>
          <strong>La aplicación de medidas precontractuales</strong> (artículo 6.1.b del RGPD)
          cuando nos pides una propuesta.
        </li>
        <li>
          <strong>Nuestro interés legítimo</strong> (artículo 6.1.f del RGPD) en mantener la web
          segura, para los datos técnicos de las visitas.
        </li>
      </ul>
    ),
  },
  {
    id: "conservacion",
    title: "Cuánto tiempo los conservamos",
    content: (
      <>
        <p>
          Conservamos tus datos mientras sean necesarios para atender tu consulta. Si llegamos a
          trabajar juntos, los mantendremos durante la relación y, después, durante los plazos que
          exija la ley.
        </p>
        <p>
          Si no llega a haber relación comercial, los suprimiremos como máximo en{" "}
          {legal.retentionWithoutContract}. Puedes pedirnos que los borremos antes.
        </p>
      </>
    ),
  },
  {
    id: "destinatarios",
    title: "Con quién los compartimos",
    content: (
      <>
        <p>
          No vendemos ni cedemos tus datos a terceros, salvo obligación legal (por ejemplo, si nos
          los requiere una autoridad competente).
        </p>
        <p>
          Para prestar el servicio nos apoyamos en proveedores que tratan los datos por cuenta de{" "}
          {owner} como encargados del tratamiento, con un contrato que les obliga a protegerlos y a
          usarlos solo siguiendo nuestras instrucciones:
        </p>
        <ul>
          <li>El proveedor de alojamiento de la web.</li>
          <li>
            El servicio de correo electrónico o de automatización que usamos para recibir y
            gestionar los mensajes del formulario.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "Transferencias internacionales",
    content: (
      <p>
        Si alguno de estos proveedores trata datos fuera del Espacio Económico Europeo, lo hará con
        las garantías que exige el RGPD: una decisión de adecuación de la Comisión Europea (como el
        Marco de Privacidad de Datos UE-EE. UU. para empresas adheridas) o cláusulas contractuales
        tipo aprobadas por la Comisión.
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
          <li>Acceder a tus datos y saber cómo los tratamos.</li>
          <li>Rectificarlos si son inexactos o pedir que los suprimamos.</li>
          <li>Oponerte a su tratamiento o pedir que lo limitemos.</li>
          <li>Solicitar su portabilidad.</li>
          <li>Retirar el consentimiento que nos diste.</li>
        </ul>
        <p>
          Para ejercerlos, escríbenos a {email} indicando qué derecho quieres ejercer. Si no
          podemos confirmar tu identidad, te pediremos algún dato adicional. Te responderemos en
          el plazo de un mes, que la ley permite ampliar en casos complejos.
        </p>
        <p>
          Si consideras que no hemos tratado bien tus datos, puedes presentar una reclamación ante
          la Agencia Española de Protección de Datos en{" "}
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
        Esta web se dirige a empresas y profesionales. Si tienes menos de 14 años, no nos envíes
        tus datos a través del formulario.
      </p>
    ),
  },
  {
    id: "seguridad",
    title: "Seguridad",
    content: (
      <p>
        Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a
        accesos no autorizados, pérdidas o alteraciones. La web se sirve con conexión cifrada
        (HTTPS) y solo accede a los mensajes el personal que los necesita para responderte.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>
          Esta web no utiliza cookies ni otras tecnologías de seguimiento, analítica o publicidad.
          Las tipografías y el resto de recursos se sirven desde nuestro propio dominio, sin
          conexiones a servicios de terceros.
        </p>
        <p>
          Si en el futuro incorporamos herramientas que las utilicen, actualizaremos esta política
          y te pediremos el consentimiento cuando la ley lo exija.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    title: "Cambios en esta política",
    content: (
      <p>
        Podemos actualizar esta política para adaptarla a cambios en la web o en la normativa.
        Publicaremos siempre la versión vigente en esta página, con su fecha de actualización.
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
            Qué datos recogemos cuando nos escribes, para qué los usamos y cómo puedes controlarlos,
            conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018
            (LOPDGDD).
          </p>
        }
        sections={sections}
      />
    </SiteShell>
  );
}
