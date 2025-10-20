import { Link } from "wouter";
import { Scale, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-8 w-8 text-amber-400" />
              <h3 className="text-xl font-bold">JFG Advocacia</h3>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Escritorio de advocacia especializado em diversas areas do direito, 
              oferecendo atendimento personalizado e solucoes juridicas eficientes 
              para individuos e empresas.
            </p>
          </div>

          {/* Links Rapidos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rapidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-blue-200 hover:text-amber-400 transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/sobre">
                  <a className="text-blue-200 hover:text-amber-400 transition-colors">Sobre</a>
                </Link>
              </li>
              <li>
                <Link href="/areas-atuacao">
                  <a className="text-blue-200 hover:text-amber-400 transition-colors">Areas de Atuacao</a>
                </Link>
              </li>
              <li>
                <Link href="/contato">
                  <a className="text-blue-200 hover:text-amber-400 transition-colors">Contato</a>
                </Link>
              </li>
              <li>
                <Link href="/procuracao">
                  <a className="text-blue-200 hover:text-amber-400 transition-colors">Procuracao Digital</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-blue-200 text-sm">
                  Rua Capitao Antonio Rosa, n 409, 1 Andar<br />
                  Edificio Spaces, Jardim Paulistano<br />
                  Sao Paulo/SP - CEP 01443-010
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-amber-400" />
                <a 
                  href="tel:+5511947219180" 
                  className="text-blue-200 hover:text-amber-400 transition-colors"
                >
                  (11) 94721-9180
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-amber-400" />
                <a 
                  href="mailto:jose.fabio.garcez@jfg.adv.br" 
                  className="text-blue-200 hover:text-amber-400 transition-colors text-sm"
                >
                  jose.fabio.garcez@jfg.adv.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200 text-sm">
              © {currentYear} JFG Advocacia. Todos os direitos reservados.
            </p>
            <p className="text-blue-200 text-sm">
              Dr. Jose Fabio Garcez - OAB/SP 504.270
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

