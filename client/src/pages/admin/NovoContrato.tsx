import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

export default function NovoContrato() {
  const [, setLocation] = useLocation();
  const [salvando, setSalvando] = useState(false);
  const sigCanvasCliente = useRef<SignatureCanvas>(null);
  const sigCanvasAdvogado = useRef<SignatureCanvas>(null);
  
  const [dados, setDados] = useState({
    // Dados do Cliente
    nomeCliente: '',
    cpfCliente: '',
    rgCliente: '',
    enderecoCliente: '',
    numeroCliente: '',
    complementoCliente: '',
    bairroCliente: '',
    cepCliente: '',
    cidadeCliente: '',
    estadoCliente: 'SP',
    emailCliente: '',
    telefoneCliente: '',
    
    // Objeto do Contrato
    objetoContrato: '',
    descricaoServicos: '',
    
    // Honorários
    valorHonorarios: '',
    formaPagamento: 'À vista',
    numeroParcelas: '1',
    diaVencimento: '10',
    prazoContrato: 'Indeterminado',
    dataInicio: new Date().toISOString().split('T')[0],
    dataTermino: '',
    clausulasAdicionais: '',
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

  const limparAssinaturaCliente = () => {
    sigCanvasCliente.current?.clear();
  };

  const limparAssinaturaAdvogado = () => {
    sigCanvasAdvogado.current?.clear();
  };

  const handleSalvar = async () => {
    if (!sigCanvasCliente.current?.isEmpty() && !sigCanvasAdvogado.current?.isEmpty()) {
      setSalvando(true);
      
      const assinaturaCliente = sigCanvasCliente.current?.toDataURL() || '';
      const assinaturaAdvogado = sigCanvasAdvogado.current?.toDataURL() || '';
      
      const payload = {
        ...dados,
        assinaturaCliente,
        assinaturaAdvogado,
      };

      try {
        // Aqui você chamaria o endpoint tRPC
        // const resultado = await trpc.admin.criarContrato.mutate(payload);
        
        console.log('Dados do contrato para enviar:', payload);
        
        // Simulação de sucesso
        setTimeout(() => {
          setSalvando(false);
          alert('Contrato criado com sucesso! PDF enviado por email.');
          setLocation('/admin/dashboard');
        }, 2000);
        
      } catch (error) {
        setSalvando(false);
        alert('Erro ao criar contrato: ' + error);
      }
    } else {
      alert('Por favor, ambas as partes devem assinar o contrato');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/dashboard')} className="text-white hover:bg-green-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Novo Contrato de Serviços</h1>
            <p className="text-sm text-green-200">Painel Administrativo</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Dados do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente (Contratante)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Nome Completo *</label>
                <Input value={dados.nomeCliente} onChange={(e) => handleChange('nomeCliente', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CPF *</label>
                <Input value={dados.cpfCliente} onChange={(e) => handleChange('cpfCliente', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">RG *</label>
                <Input value={dados.rgCliente} onChange={(e) => handleChange('rgCliente', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input type="email" value={dados.emailCliente} onChange={(e) => handleChange('emailCliente', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone *</label>
                <Input value={dados.telefoneCliente} onChange={(e) => handleChange('telefoneCliente', e.target.value)} required />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Endereço do Cliente</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Logradouro *</label>
                  <Input value={dados.enderecoCliente} onChange={(e) => handleChange('enderecoCliente', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número *</label>
                  <Input value={dados.numeroCliente} onChange={(e) => handleChange('numeroCliente', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Complemento</label>
                  <Input value={dados.complementoCliente} onChange={(e) => handleChange('complementoCliente', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bairro *</label>
                  <Input value={dados.bairroCliente} onChange={(e) => handleChange('bairroCliente', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CEP *</label>
                  <Input value={dados.cepCliente} onChange={(e) => handleChange('cepCliente', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cidade *</label>
                  <Input value={dados.cidadeCliente} onChange={(e) => handleChange('cidadeCliente', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado *</label>
                  <Input value={dados.estadoCliente} onChange={(e) => handleChange('estadoCliente', e.target.value)} maxLength={2} required />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objeto e Honorários */}
        <Card>
          <CardHeader>
            <CardTitle>Objeto do Contrato e Honorários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Objeto do Contrato *</label>
              <Input 
                value={dados.objetoContrato} 
                onChange={(e) => handleChange('objetoContrato', e.target.value)} 
                placeholder="Ex: Assessoria jurídica empresarial"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição Detalhada dos Serviços *</label>
              <Textarea 
                value={dados.descricaoServicos} 
                onChange={(e) => handleChange('descricaoServicos', e.target.value)}
                rows={4}
                placeholder="Descreva os serviços que serão prestados..."
                required 
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Honorários Advocatícios</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Valor dos Honorários (R$) *</label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={dados.valorHonorarios} 
                    onChange={(e) => handleChange('valorHonorarios', e.target.value)} 
                    placeholder="0.00"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Forma de Pagamento *</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={dados.formaPagamento} 
                    onChange={(e) => handleChange('formaPagamento', e.target.value)}
                  >
                    <option>À vista</option>
                    <option>Parcelado</option>
                    <option>Mensal</option>
                    <option>Êxito</option>
                  </select>
                </div>
                {dados.formaPagamento === 'Parcelado' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Número de Parcelas *</label>
                      <Input 
                        type="number" 
                        value={dados.numeroParcelas} 
                        onChange={(e) => handleChange('numeroParcelas', e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Dia de Vencimento *</label>
                      <Input 
                        type="number" 
                        min="1"
                        max="31"
                        value={dados.diaVencimento} 
                        onChange={(e) => handleChange('diaVencimento', e.target.value)} 
                        required 
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Prazo do Contrato</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prazo *</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={dados.prazoContrato} 
                    onChange={(e) => handleChange('prazoContrato', e.target.value)}
                  >
                    <option>Indeterminado</option>
                    <option>3 meses</option>
                    <option>6 meses</option>
                    <option>12 meses</option>
                    <option>Até conclusão do serviço</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Início *</label>
                  <Input 
                    type="date" 
                    value={dados.dataInicio} 
                    onChange={(e) => handleChange('dataInicio', e.target.value)} 
                    required 
                  />
                </div>
                {dados.prazoContrato !== 'Indeterminado' && dados.prazoContrato !== 'Até conclusão do serviço' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Término</label>
                    <Input 
                      type="date" 
                      value={dados.dataTermino} 
                      onChange={(e) => handleChange('dataTermino', e.target.value)} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cláusulas Adicionais (Opcional)</label>
              <Textarea 
                value={dados.clausulasAdicionais} 
                onChange={(e) => handleChange('clausulasAdicionais', e.target.value)}
                rows={3}
                placeholder="Adicione cláusulas específicas se necessário..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Assinaturas */}
        <Card>
          <CardHeader>
            <CardTitle>Assinaturas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Assinatura do Cliente (Contratante) *</h3>
              <div className="border rounded p-2 bg-white">
                <SignatureCanvas
                  ref={sigCanvasCliente}
                  canvasProps={{
                    className: 'w-full h-40 border rounded',
                  }}
                />
              </div>
              <Button variant="outline" size="sm" onClick={limparAssinaturaCliente} className="mt-2">
                Limpar Assinatura
              </Button>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Assinatura do Advogado (Contratado) *</h3>
              <div className="border rounded p-2 bg-white">
                <SignatureCanvas
                  ref={sigCanvasAdvogado}
                  canvasProps={{
                    className: 'w-full h-40 border rounded',
                  }}
                />
              </div>
              <Button variant="outline" size="sm" onClick={limparAssinaturaAdvogado} className="mt-2">
                Limpar Assinatura
              </Button>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setLocation('/admin/dashboard')} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSalvar} disabled={salvando} className="flex-1 bg-green-700 hover:bg-green-600">
                {salvando ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar e Enviar Contrato
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

