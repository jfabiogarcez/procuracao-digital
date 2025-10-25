// Tabela de Honorários OAB/SP 2025
// Fonte: https://www.oabsp.org.br/upload/1584951305.pdf

export interface ServicoOAB {
  id: string;
  nome: string;
  area: string;
  valorMinimo: number;
  percentual?: number;
  descricao: string;
}

export const areasAtuacao = [
  "Direito Civil",
  "Direito de Família e Sucessões",
  "Direito Trabalhista",
  "Direito Empresarial",
  "Direito Tributário",
  "Direito Imobiliário",
  "Direito do Consumidor",
  "Direito Previdenciário",
  "Direito Penal",
  "Direito Ambiental",
  "Direito Eleitoral",
  "Direito Administrativo",
] as const;

export const tabelaOAB: ServicoOAB[] = [
  // Atividades Avulsas
  {
    id: "1.1",
    nome: "Consulta",
    area: "Atividades Avulsas",
    valorMinimo: 516.47,
    descricao: "Consulta jurídica básica"
  },
  {
    id: "1.1a",
    nome: "Consulta com exame de documentos",
    area: "Atividades Avulsas",
    valorMinimo: 1106.71,
    descricao: "Consulta em condições excepcionais com análise de documentos"
  },
  {
    id: "1.2",
    nome: "Hora intelectual",
    area: "Atividades Avulsas",
    valorMinimo: 832.25,
    descricao: "Hora de trabalho intelectual"
  },
  {
    id: "1.11",
    nome: "Elaboração de contrato",
    area: "Atividades Avulsas",
    valorMinimo: 4722.00,
    descricao: "Elaboração de minutas de contrato, distrato, alteração, estatuto, testamento, escritura ou documento"
  },
  {
    id: "1.12",
    nome: "Parecer ou memorial",
    area: "Atividades Avulsas",
    valorMinimo: 3329.01,
    descricao: "Elaboração de parecer jurídico ou memorial"
  },
  
  // Direito Civil
  {
    id: "4.1",
    nome: "Ação de Cobrança",
    area: "Direito Civil",
    valorMinimo: 3994.84,
    percentual: 20,
    descricao: "Ação de cobrança de valores"
  },
  {
    id: "4.2",
    nome: "Ação de Indenização",
    area: "Direito Civil",
    valorMinimo: 4722.00,
    percentual: 20,
    descricao: "Ação de indenização por danos materiais ou morais"
  },
  {
    id: "4.3",
    nome: "Ação de Despejo",
    area: "Direito Imobiliário",
    valorMinimo: 3994.84,
    percentual: 20,
    descricao: "Ação de despejo de imóvel"
  },
  
  // Direito de Família
  {
    id: "6.1",
    nome: "Ação de Divórcio Consensual",
    area: "Direito de Família e Sucessões",
    valorMinimo: 4722.00,
    percentual: 20,
    descricao: "Ação de divórcio consensual"
  },
  {
    id: "6.2",
    nome: "Ação de Divórcio Litigioso",
    area: "Direito de Família e Sucessões",
    valorMinimo: 5994.84,
    percentual: 20,
    descricao: "Ação de divórcio litigioso"
  },
  {
    id: "6.3",
    nome: "Ação de Alimentos",
    area: "Direito de Família e Sucessões",
    valorMinimo: 3994.84,
    percentual: 20,
    descricao: "Ação de alimentos (fixação, revisão, exoneração)"
  },
  {
    id: "6.4",
    nome: "Inventário",
    area: "Direito de Família e Sucessões",
    valorMinimo: 7944.00,
    percentual: 10,
    descricao: "Inventário judicial ou extrajudicial"
  },
  {
    id: "6.5",
    nome: "Partilha de Bens",
    area: "Direito de Família e Sucessões",
    valorMinimo: 5994.84,
    percentual: 15,
    descricao: "Ação de partilha de bens"
  },
  
  // Direito Trabalhista
  {
    id: "8.1",
    nome: "Reclamação Trabalhista",
    area: "Direito Trabalhista",
    valorMinimo: 3994.84,
    percentual: 20,
    descricao: "Reclamação trabalhista (empregado)"
  },
  {
    id: "8.2",
    nome: "Defesa Trabalhista",
    area: "Direito Trabalhista",
    valorMinimo: 3994.84,
    percentual: 20,
    descricao: "Defesa em reclamação trabalhista (empregador)"
  },
  {
    id: "8.3",
    nome: "Acordo Trabalhista",
    area: "Direito Trabalhista",
    valorMinimo: 2815.24,
    percentual: 10,
    descricao: "Elaboração e homologação de acordo trabalhista"
  },
  
  // Direito Empresarial
  {
    id: "9.1",
    nome: "Constituição de Empresa",
    area: "Direito Empresarial",
    valorMinimo: 4722.00,
    descricao: "Constituição de pessoa jurídica"
  },
  {
    id: "9.2",
    nome: "Contrato Social",
    area: "Direito Empresarial",
    valorMinimo: 5994.84,
    descricao: "Elaboração ou alteração de contrato social"
  },
  {
    id: "9.3",
    nome: "Recuperação Judicial",
    area: "Direito Empresarial",
    valorMinimo: 15000.00,
    percentual: 10,
    descricao: "Recuperação judicial de empresa"
  },
  
  // Direito do Consumidor
  {
    id: "10.1",
    nome: "Ação de Reparação de Danos",
    area: "Direito do Consumidor",
    valorMinimo: 3994.84,
    percentual: 20,
    descricao: "Ação de reparação de danos ao consumidor"
  },
  {
    id: "10.2",
    nome: "Ação contra Banco/Financeira",
    area: "Direito do Consumidor",
    valorMinimo: 4722.00,
    percentual: 20,
    descricao: "Ação contra instituição financeira"
  },
  
  // Direito Previdenciário
  {
    id: "7.1",
    nome: "Aposentadoria",
    area: "Direito Previdenciário",
    valorMinimo: 3994.84,
    percentual: 20,
    descricao: "Concessão ou revisão de aposentadoria"
  },
  {
    id: "7.2",
    nome: "Auxílio-Doença",
    area: "Direito Previdenciário",
    valorMinimo: 2815.24,
    percentual: 20,
    descricao: "Concessão ou restabelecimento de auxílio-doença"
  },
  {
    id: "7.3",
    nome: "Pensão por Morte",
    area: "Direito Previdenciário",
    valorMinimo: 3329.01,
    percentual: 20,
    descricao: "Concessão de pensão por morte"
  },
  
  // Direito Penal
  {
    id: "13.1",
    nome: "Defesa Criminal",
    area: "Direito Penal",
    valorMinimo: 7944.00,
    descricao: "Defesa em processo criminal"
  },
  {
    id: "13.2",
    nome: "Habeas Corpus",
    area: "Direito Penal",
    valorMinimo: 5994.84,
    descricao: "Impetração de habeas corpus"
  },
  {
    id: "13.3",
    nome: "Queixa-Crime",
    area: "Direito Penal",
    valorMinimo: 4722.00,
    descricao: "Elaboração de queixa-crime"
  },
  
  // Direito Tributário
  {
    id: "11.1",
    nome: "Mandado de Segurança Fiscal",
    area: "Direito Tributário",
    valorMinimo: 5994.84,
    percentual: 10,
    descricao: "Mandado de segurança em matéria fiscal"
  },
  {
    id: "11.2",
    nome: "Defesa Administrativa Fiscal",
    area: "Direito Tributário",
    valorMinimo: 4722.00,
    percentual: 10,
    descricao: "Defesa em processo administrativo fiscal"
  },
  {
    id: "11.3",
    nome: "Planejamento Tributário",
    area: "Direito Tributário",
    valorMinimo: 7944.00,
    descricao: "Consultoria e planejamento tributário"
  },
];

// Função auxiliar para buscar serviços por área
export function getServicosPorArea(area: string): ServicoOAB[] {
  return tabelaOAB.filter(servico => servico.area === area);
}

// Função auxiliar para buscar serviço por ID
export function getServicoPorId(id: string): ServicoOAB | undefined {
  return tabelaOAB.find(servico => servico.id === id);
}

// Função para formatar valor em Real
export function formatarValor(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

