const Noticias = () => (
  <div className="container py-16 max-w-4xl">
    <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-3">Novedades</div>
    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">Noticias de la Agrupación</h1>
    <p className="text-muted-foreground text-lg mb-10">Comunicados, novedades académicas y actividades de DND.</p>

    <div className="grid gap-5">
      {[
        { tag: "Cursada", title: "Inscripciones a permutas 2do cuatrimestre", date: "12 Mar", desc: "Recordatorio: las solicitudes oficiales se cargan en SIU. Mientras tanto, usá el Permutero." },
        { tag: "Asamblea", title: "Asamblea estudiantil sobre nuevo plan", date: "05 Mar", desc: "Convocamos a debatir las modificaciones del plan de estudios. Participación abierta." },
        { tag: "Apuntes", title: "Nuevos resúmenes de Civil III subidos", date: "28 Feb", desc: "Disponibles en la sección de Apuntes. Hechos por estudiantes que aprobaron en marzo." },
      ].map((n, i) => (
        <article
          key={i}
          className="p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:-translate-y-0.5 transition-smooth shadow-paper hover:shadow-elegant"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-semibold">{n.tag}</span>
            <span className="text-xs text-muted-foreground font-medium">{n.date}</span>
          </div>
          <h3 className="font-display font-semibold text-xl mb-1.5 text-foreground">{n.title}</h3>
          <p className="text-muted-foreground text-sm">{n.desc}</p>
        </article>
      ))}
    </div>
  </div>
);
export default Noticias;
