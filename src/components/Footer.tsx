import logo from "@/assets/dnd-logo.png";
import { Instagram, Mail } from "lucide-react";

export const Footer = () => (
  <footer className="mt-20 border-t border-white/5 bg-background/50 backdrop-blur-sm">
    <div className="container py-10 grid gap-8 md:grid-cols-3">
      <div className="flex items-start gap-3">
        <img src={logo} alt="DND" className="h-12 w-12 object-contain" />
        <div>
          <div className="font-display font-bold text-lg text-foreground">Agrupación DND</div>
          <p className="text-sm text-muted-foreground max-w-xs mt-1">
            Defendamos Nuestro Derecho — Facultad de Ciencias Jurídicas y Sociales, UNLP.
          </p>
        </div>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Plataforma</h4>
        <ul className="space-y-2 text-sm text-foreground/80">
          <li>Permutero de comisiones</li>
          <li>Plan de estudios personal</li>
          <li>Calendario académico</li>
          <li>Apuntes y noticias</li>
        </ul>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Contacto</h4>
        <div className="flex gap-3">
          <a href="#" className="p-2 rounded-md bg-secondary hover:bg-primary hover:text-white transition-smooth"><Instagram className="h-4 w-4" /></a>
          <a href="#" className="p-2 rounded-md bg-secondary hover:bg-primary hover:text-white transition-smooth"><Mail className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} DND · Defendamos Nuestro Derecho
    </div>
  </footer>
);
