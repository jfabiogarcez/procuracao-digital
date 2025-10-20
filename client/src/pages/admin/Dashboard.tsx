import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, FileCheck, TrendingUp, Plus, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar se está autenticado
    const session = localStorage.getItem("admin_session");
    if (!session) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    setLocation("/admin/login");
  };

  const stats = [
    {
      title: "Total de Documentos",
      value: "0",
      description: "Todos os tipos",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Procurações",
      value: "0",
      description: "Geradas este mês",
      icon: FileCheck,
      color: "text-green-600"
    },
    {
      title: "Contratos",
      value: "0",
      description: "Ativos",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Crescimento",
      value: "+0%",
      description: "vs. mês anterior",
      icon: TrendingUp,
      color: "text-amber-600"
    }
  ];

  const quickActions = [
    {
      title: "Nova Procuração",
      description: "Criar procuração completa",
      href: "/admin/documentos/procuracao",
      icon: FileText
    },
    {
      title: "Novo Contrato",
      description: "Contrato de serviços",
      href: "/admin/documentos/contrato",
      icon: FileCheck
    },
    {
      title: "Ver Documentos",
      description: "Gerenciar todos os documentos",
      href: "/admin/documentos",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img src="/images/logo-jfg.png" alt="JFG" className="h-10 w-10" />
            <div>
              <h1 className="text-lg font-semibold">Painel Administrativo</h1>
              <p className="text-xs text-muted-foreground">JFG Advocacia</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Bem-vindo ao Painel</h2>
          <p className="text-muted-foreground">
            Gerencie documentos, contratos e procurações do escritório
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setLocation(action.href)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <action.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {action.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Documentos Recentes</h3>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/documentos")}>
              Ver Todos
            </Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento criado ainda</p>
              <Button className="mt-4" onClick={() => setLocation("/admin/documentos/novo")}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Documento
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

