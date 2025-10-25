import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { useMutation } from '@tanstack/react-query';

export default function NovaProcuracao() {
  const [, setLocation] = useLocation();
  const [etapa, setEtapa] = useState(1);
  const [salvando, setSalvando] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [foto, setFoto] = useState<string>('');
  
  const [dados, setDados] = useState({
    nomeCompleto: '',
    nacionalidade: 'Brasileiro(a)',
    estadoCivil: 'Solteiro(a)',
    profissao: '',
    rg: '',
    cpf: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: 'SP',
    email: '',
    telefone: '',
    dataEmissao: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const handleChange = (field: string, value: string) => {
    setDados(prev => ({ ...prev, [field]: value }));
  };

  const limparAssinatura = () => {
    sigCanvas.current?.clear();
  };

  const capturarFoto = () => {
    // Simulação de captura de foto (em produção, usar webcam)
    setFoto('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  };

  const handleSalvar = async () => {
    if (!sigCanvas.current?.isEmpty()) {
      setSalvando(true);
      
      const assinatura = sigCanvas.current?.toDataURL() || '';
      
      const payload = {
        ...dados,
        assinatura,
        foto: foto || undefined,
      };

      try {
        // Aqui você chamaria o endpoint tRPC
        // const resultado = await trpc.admin.criarProcuracao.mutate(payload);
        
        console.log('Dados para enviar:', payload);
        
        // Simulação de sucesso
        setTimeout(() => {
          setSalvando(false);
          alert('Procuração criada com sucesso! PDF enviado por email.');
          setLocation('/admin/dashboard');
        }, 2000);
        
      } catch (error) {
        setSalvando(false);
        alert('Erro ao criar procuração: ' + error);
      }
    } else {
      alert('Por favor, assine o documento');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/dashboard')} className="text-white hover:bg-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Nova Procuração</h1>
            <p className="text-sm text-blue-200">Painel Administrativo</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Outorgante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo *</label>
                <Input value={dados.nomeCompleto} onChange={(e) => handleChange('nomeCompleto', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nacionalidade *</label>
                <Input value={dados.nacionalidade} onChange={(e) => handleChange('nacionalidade', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado Civil *</label>
                <select className="w-full border rounded px-3 py-2" value={dados.estadoCivil} onChange={(e) => handleChange('estadoCivil', e.target.value)}>
                  <option>Solteiro(a)</option>
                  <option>Casado(a)</option>
                  <option>Divorciado(a)</option>
                  <option>Viúvo(a)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profissão *</label>
                <Input value={dados.profissao} onChange={(e) => handleChange('profissao', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">RG *</label>
                <Input value={dados.rg} onChange={(e) => handleChange('rg', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CPF *</label>
                <Input value={dados.cpf} onChange={(e) => handleChange('cpf', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input type="email" value={dados.email} onChange={(e) => handleChange('email', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <Input value={dados.telefone} onChange={(e) => handleChange('telefone', e.target.value)} />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Endereço</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Logradouro *</label>
                  <Input value={dados.endereco} onChange={(e) => handleChange('endereco', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número *</label>
                  <Input value={dados.numero} onChange={(e) => handleChange('numero', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Complemento</label>
                  <Input value={dados.complemento} onChange={(e) => handleChange('complemento', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bairro *</label>
                  <Input value={dados.bairro} onChange={(e) => handleChange('bairro', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CEP *</label>
                  <Input value={dados.cep} onChange={(e) => handleChange('cep', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cidade *</label>
                  <Input value={dados.cidade} onChange={(e) => handleChange('cidade', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado *</label>
                  <Input value={dados.estado} onChange={(e) => handleChange('estado', e.target.value)} maxLength={2} required />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Assinatura Digital *</h3>
              <div className="border rounded p-2 bg-white">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    className: 'w-full h-40 border rounded',
                  }}
                />
              </div>
              <Button variant="outline" size="sm" onClick={limparAssinatura} className="mt-2">
                Limpar Assinatura
              </Button>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Foto de Autenticação (Opcional)</h3>
              <Button variant="outline" onClick={capturarFoto}>
                {foto ? 'Foto Capturada ✓' : 'Capturar Foto'}
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => setLocation('/admin/dashboard')} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSalvar} disabled={salvando} className="flex-1 bg-blue-900 hover:bg-blue-800">
                {salvando ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar e Enviar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

