import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "@/pages/Home";
import HomeInstitucional from "@/pages/HomeInstitucional";
import CalculadoraHonorarios from "@/pages/CalculadoraHonorarios";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import NovaProcuracao from "./pages/admin/NovaProcuracao";
import NovoContrato from "./pages/admin/NovoContrato";
import ListaDocumentos from "./pages/admin/ListaDocumentos";
import Clientes from "./pages/admin/Clientes";
import Processos from "./pages/admin/Processos";
import Financeiro from "./pages/admin/Financeiro";
import Relatorios from "./pages/admin/Relatorios";
import PecasProcessuais from "./pages/admin/PecasProcessuais";
import EditorPeca from "./pages/admin/EditorPeca";
import GerarPecaIA from "./pages/admin/GerarPecaIA";
import GerarContestacao from "./pages/admin/GerarContestacao";
import GerarContestacaoModular from "./pages/admin/GerarContestacaoModular";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={HomeInstitucional} />
      <Route path="/procuracao" component={Home} />
      <Route path="/calculadora" component={CalculadoraHonorarios} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/procuracao/nova" component={NovaProcuracao} />
      <Route path="/admin/contrato/novo" component={NovoContrato} />
      <Route path="/admin/documentos" component={ListaDocumentos} />
      <Route path="/admin/clientes" component={Clientes} />
      <Route path="/admin/processos" component={Processos} />
      <Route path="/admin/financeiro" component={Financeiro} />
      <Route path="/admin/relatorios" component={Relatorios} />
      <Route path="/admin/pecas" component={PecasProcessuais} />
      <Route path="/admin/pecas/gerar-ia" component={GerarPecaIA} />
      <Route path="/admin/pecas/gerar-contestacao" component={GerarContestacao} />
      <Route path="/admin/pecas/gerar-contestacao-modular" component={GerarContestacaoModular} />
      <Route path="/admin/pecas/:id" component={EditorPeca} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
