import type { Metadata } from "next";
import { absoluteUrl, href, site } from "@/config/site";
import { legal } from "@/config/legal";
import { SiteShell } from "@/components/layout/SiteShell";
import { Field, LegalDocument, OwnerDetails, type LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: `Datos identificativos del titular y condiciones de uso del sitio web de ${site.name}.`,
  alternates: { canonical: absoluteUrl("/aviso-legal") },
};

const owner = <Field value={legal.ownerName} label="Razón social o nombre" />;

const sections: LegalSection[] = [
  {
    id: "titular",
    title: "Datos del titular",
    content: (
      <>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
          Sociedad de la Información y de Comercio Electrónico (LSSI-CE), estos son los datos del
          titular de este sitio web, que opera bajo el nombre comercial {site.name}:
        </p>
        <OwnerDetails />
      </>
    ),
  },
  {
    id: "objeto",
    title: "Objeto",
    content: (
      <p>
        Este sitio web informa sobre los servicios de consultoría de inteligencia artificial,
        automatización de procesos y desarrollo de páginas web a medida que ofrece {owner}, y
        permite ponerse en contacto para solicitar información.
      </p>
    ),
  },
  {
    id: "condiciones",
    title: "Condiciones de uso",
    content: (
      <>
        <p>
          Acceder a esta web implica aceptar este aviso legal. Si no estás de acuerdo con él, te
          pedimos que no la utilices.
        </p>
        <p>Al usar la web te comprometes a:</p>
        <ul>
          <li>Hacer un uso lícito, de buena fe y conforme a este aviso legal.</li>
          <li>
            No introducir ni difundir virus, código malicioso ni cualquier otro elemento que pueda
            dañar la web, sus sistemas o los de terceros.
          </li>
          <li>
            Facilitar datos verdaderos en el formulario de contacto y no utilizar los de otras
            personas sin su permiso.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    title: "Propiedad intelectual e industrial",
    content: (
      <>
        <p>
          Los textos, el diseño, las ilustraciones, la escena 3D, el código fuente, los logotipos y
          el resto de elementos de esta web pertenecen a {owner} o se utilizan con la autorización
          de sus titulares.
        </p>
        <p>
          Puedes consultarlos y compartir enlaces a la web, pero no reproducirlos, distribuirlos,
          transformarlos ni comunicarlos públicamente, total o parcialmente, sin autorización
          previa y por escrito, salvo en los casos que permita la ley.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Responsabilidad",
    content: (
      <>
        <p>
          La información de esta web es general y orientativa. No constituye asesoramiento
          profesional ni una oferta vinculante: las condiciones de cada proyecto se concretan por
          escrito en una propuesta.
        </p>
        <p>
          Trabajamos para que la web esté disponible y funcione correctamente, pero no podemos
          garantizar que no haya interrupciones o errores. No respondemos de los daños derivados de
          un uso indebido de la web ni de interrupciones causadas por terceros, fallos técnicos
          ajenos o causas de fuerza mayor.
        </p>
      </>
    ),
  },
  {
    id: "enlaces",
    title: "Enlaces a otras webs",
    content: (
      <p>
        Si esta web incluye enlaces a sitios de terceros, lo hace solo a título informativo. No
        controlamos su contenido ni respondemos de él, de su disponibilidad ni de sus políticas de
        privacidad.
      </p>
    ),
  },
  {
    id: "datos-personales",
    title: "Datos personales",
    content: (
      <p>
        El tratamiento de los datos que nos facilitas a través del formulario de contacto se
        explica en la <a href={href("/privacidad")}>política de privacidad</a>. Esta web no utiliza
        cookies.
      </p>
    ),
  },
  {
    id: "legislacion",
    title: "Legislación aplicable y jurisdicción",
    content: (
      <p>
        Este aviso legal se rige por la legislación española. Para resolver cualquier
        controversia, las partes se someten a los juzgados y tribunales que correspondan conforme
        a la ley. Si eres consumidor o consumidora, serán competentes los de tu domicilio.
      </p>
    ),
  },
];

export default function AvisoLegalPage() {
  return (
    <SiteShell>
      <LegalDocument
        title="Aviso legal"
        intro={
          <p>
            Quién está detrás de esta web y en qué condiciones puedes usarla. Si tienes cualquier
            duda, escríbenos a{" "}
            <a href={`mailto:${legal.email}`} className="text-cobalt underline underline-offset-4">
              {legal.email}
            </a>
            .
          </p>
        }
        sections={sections}
      />
    </SiteShell>
  );
}
