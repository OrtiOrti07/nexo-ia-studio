type SectionIntroProps = {
  id: string;
  title: string;
  body?: string;
  className?: string;
};

/** Titular de sección con texto de apoyo alineado a la derecha en escritorio. */
export function SectionIntro({ id, title, body, className = "" }: SectionIntroProps) {
  return (
    <div className={`grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10 ${className}`}>
      <h2 id={id} className="wide text-h2 lg:col-span-7">
        {title}
      </h2>
      {body && (
        <p className="max-w-copy font-serif text-body text-slate lg:col-span-5 lg:pb-1.5">
          {body}
        </p>
      )}
    </div>
  );
}
