import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-surface-dark border-t border-gray-200 dark:border-white/10">
      <div className="container-main px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div className="text-center md:text-left">
            <a href="#" className="font-bold text-xl tracking-tight">
              <span className="text-primary">Gaid</span>
              <span className="text-text-primary-light dark:text-text-primary-dark"> Trip</span>
            </a>
            <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {SITE.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <a href="#" className="hover:text-primary transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Términos
            </a>
            <a href="mailto:hola@gaidtrip.com" className="hover:text-primary transition-colors">
              Contacto
            </a>
          </div>

          {/* Social placeholders */}
          <div className="flex items-center gap-4">
            {["Instagram", "TikTok", "X"].map((network) => (
              <a
                key={network}
                href="#"
                aria-label={network}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-colors"
              >
                {network[0]}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
          &copy; {new Date().getFullYear()} Gaid Trip. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
