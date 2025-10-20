import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileCheck, FileX, FileSignature, Receipt, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NovoDocumento() {
  const [, setLocation] = useLocation();

  const documentTypes = [
    {
      id: "procuracao",
      title: "Procuração",
      description: "Documento de representação legal com poderes gerais e especiais",
      icon: FileText,
      color: "bg-blue-500",
      available: true
    },
    {
      id: "contrato",
      title: "Contrato de Serviços",
      description: "Contrato de prestação de serviços advocatícios",
      icon: FileCheck,
      color: "bg-green-500",
      available: true
    },
    {
      id: "distrato",
      title: "Distrato",
      description: "Rescisão de contrato de serviços",
      icon: FileX,
      color: "bg-red-500",
      available: false
    },
    {
      id: "declaracao",
      title: "Declaração",
      description: "Declaração personalizada para diversos fins",
      icon: FileSignature,
      color: "bg-purple-500",
      available: false
    },
    {
      id: "recibo",
      title: "Recibo de Honorários",
      description: "Comprovante de pagamento de honorários",
      icon: Receipt,
      color: "bg-amber-500",
      available: false
    }
  ];

  const handleSelectType = (typeId: string) => {
    setLocation(`/admin/documentos/${typeId}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Novo Documento</h1>
              <p className="text-xs text-muted-foreground">Selecione o tipo de documento</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Escolha o Tipo de Documento</h2>
            <p className="text-muted-foreground">
              Selecione o tipo de documento que deseja criar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentTypes.map((type) => (
              <Card 
                key={type.id}
                className={`hover:shadow-lg transition-all ${
                  type.available ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => type.available && handleSelectType(type.id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${type.color} rounded-lg`}>
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{type.title}</CardTitle>
                        {!type.available && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            Em breve
                          </span>
                        )}
                      </div>
                      <CardDescription className="mt-2">
                        {type.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {type.available && (
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Criar {type.title}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              💡 Dica
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Todos os documentos gerados incluem assinatura digital, QR Code único e são
              automaticamente enviados por email para o endereço configurado.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

