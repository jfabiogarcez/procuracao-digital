import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MapaEscritorio() {
  const endereco = "Rua Capitão Antônio Rosa, 409 - São Paulo/SP - CEP 01443-010";
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Rua+Capitão+Antônio+Rosa+409+São+Paulo+SP";
  const wazeUrl = "https://waze.com/ul?q=Rua+Capitão+Antônio+Rosa+409+São+Paulo+SP";

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1a2847] mb-4">Nosso Escritório</h2>
          <p className="text-lg text-gray-600">
            Venha nos visitar ou agende uma consulta
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Informações */}
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-[#1a2847] rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-[#1a2847] mb-2">
                    Localização
                  </h3>
                  <p className="text-gray-600">
                    {endereco}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🚗 De Carro</h4>
                  <p className="text-sm text-blue-800">
                    Estacionamento disponível nas proximidades
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">🚇 Metrô</h4>
                  <p className="text-sm text-green-800">
                    Estação Fradique Coutinho (Linha 4-Amarela) - 10 min a pé
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">🚌 Ônibus</h4>
                  <p className="text-sm text-purple-800">
                    Diversas linhas na Rua Teodoro Sampaio
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#1a2847] hover:bg-[#2a3857]"
                  onClick={() => window.open(googleMapsUrl, '_blank')}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Abrir no Google Maps
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(wazeUrl, '_blank')}
                >
                  Abrir no Waze
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mapa */}
          <Card className="shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0977588447896!2d-46.68194492464!3d-23.564893978787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5799c3d3d3d3%3A0x1234567890abcdef!2sRua%20Capit%C3%A3o%20Ant%C3%B4nio%20Rosa%2C%20409%20-%20Jardim%20Paulistano%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001443-010!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização JFG Advocacia"
              />
            </CardContent>
          </Card>
        </div>

        {/* Horário de Atendimento */}
        <Card className="mt-8 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#1a2847] mb-4">
                Horário de Atendimento
              </h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-[#1a2847] mb-2">Segunda a Sexta</p>
                  <p className="text-gray-600">9h às 18h</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-[#1a2847] mb-2">Sábados e Domingos</p>
                  <p className="text-gray-600">Fechado</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-6">
                💡 <strong>Dica:</strong> Agende sua visita com antecedência para garantir atendimento personalizado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

