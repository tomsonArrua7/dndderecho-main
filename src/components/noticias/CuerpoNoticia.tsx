import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface CuerpoNoticiaProps {
  contenido: string;
  formato?: string | null;
  className?: string;
}

/**
 * Cuerpo de una noticia. Las notas viejas se guardaron como texto plano y se siguen
 * mostrando respetando sus saltos de línea; las nuevas pueden usar markdown.
 * No usamos dangerouslySetInnerHTML: react-markdown no permite HTML crudo por defecto.
 */
const CuerpoNoticia = ({ contenido, formato, className }: CuerpoNoticiaProps) => {
  const clasesProse = cn(
    "prose dark:prose-invert max-w-none",
    // Tipografía de lectura larga: serif en el cuerpo, interlineado amplio
    "prose-p:font-serif prose-p:leading-[1.85] prose-p:text-foreground/80",
    "prose-li:font-serif prose-li:leading-[1.85] prose-li:text-foreground/80",
    "prose-headings:font-serif prose-headings:text-red-200/90 prose-headings:font-bold",
    "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3",
    "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-2",
    "prose-strong:text-foreground prose-em:text-foreground/90",
    "prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80",
    "prose-blockquote:border-l-2 prose-blockquote:border-primary/40 prose-blockquote:not-italic",
    "prose-blockquote:font-serif prose-blockquote:text-lg prose-blockquote:text-foreground/70",
    "prose-hr:border-border prose-img:rounded-xl prose-img:border prose-img:border-border/50",
    className
  );

  if (formato !== "markdown") {
    return (
      <div className={cn(clasesProse, "whitespace-pre-wrap font-serif leading-[1.85] text-foreground/80")}>
        {contenido}
      </div>
    );
  }

  return (
    <div className={clasesProse}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Los títulos de nivel 1 quedan reservados para el título de la nota
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {contenido}
      </ReactMarkdown>
    </div>
  );
};

export default CuerpoNoticia;
