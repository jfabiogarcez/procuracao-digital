import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de procurações
export const procuracoes = mysqlTable("procuracoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  // Dados do outorgante
  nomeCompleto: text("nomeCompleto").notNull(),
  nacionalidade: varchar("nacionalidade", { length: 100 }).notNull(),
  estadoCivil: varchar("estadoCivil", { length: 50 }).notNull(),
  profissao: varchar("profissao", { length: 100 }).notNull(),
  rg: varchar("rg", { length: 50 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull(),
  endereco: text("endereco").notNull(),
  numero: varchar("numero", { length: 20 }).notNull(),
  complemento: varchar("complemento", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }).notNull(),
  cep: varchar("cep", { length: 9 }).notNull(),
  cidade: varchar("cidade", { length: 100 }).notNull(),
  estado: varchar("estado", { length: 2 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  // Assinatura e autenticação
  assinatura: text("assinatura").notNull(), // Base64 da assinatura
  fotoAutenticacao: text("fotoAutenticacao"), // Base64 da foto
  // Testemunhas
  testemunha1Nome: varchar("testemunha1Nome", { length: 255 }),
  testemunha1Cpf: varchar("testemunha1Cpf", { length: 14 }),
  testemunha1Rg: varchar("testemunha1Rg", { length: 50 }),
  testemunha2Nome: varchar("testemunha2Nome", { length: 255 }),
  testemunha2Cpf: varchar("testemunha2Cpf", { length: 14 }),
  testemunha2Rg: varchar("testemunha2Rg", { length: 50 }),
  // Metadados de segurança
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv4 ou IPv6
  userAgent: text("userAgent"), // Navegador usado
  geolocalizacao: varchar("geolocalizacao", { length: 255 }), // Coordenadas GPS
  // Metadados
  dataEmissao: timestamp("dataEmissao").defaultNow().notNull(),
  qrCode: text("qrCode"), // Dados do QR Code
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Procuracao = typeof procuracoes.$inferSelect;
export type InsertProcuracao = typeof procuracoes.$inferInsert;


// Tabela unificada de documentos
export const documentos = mysqlTable("documentos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tipo: mysqlEnum("tipo", ["procuracao", "contrato", "outro"]).notNull(),
  numeroDocumento: varchar("numeroDocumento", { length: 100 }).notNull().unique(),
  status: mysqlEnum("status", ["ativo", "cancelado", "arquivado"]).default("ativo").notNull(),
  dados: text("dados").notNull(), // JSON com os dados do documento
  pdfUrl: text("pdfUrl"), // URL do PDF no S3
  createdBy: varchar("createdBy", { length: 64 }), // ID do usuário que criou
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Documento = typeof documentos.$inferSelect;
export type InsertDocumento = typeof documentos.$inferInsert;



// Tabela de clientes
export const clientes = mysqlTable("clientes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nomeCompleto: text("nomeCompleto").notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull().unique(),
  rg: varchar("rg", { length: 50 }),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 20 }),
  celular: varchar("celular", { length: 20 }),
  // Endereço
  logradouro: varchar("logradouro", { length: 255 }),
  numero: varchar("numero", { length: 20 }),
  complemento: varchar("complemento", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }),
  cep: varchar("cep", { length: 9 }),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  // Dados adicionais
  dataNascimento: varchar("dataNascimento", { length: 10 }),
  profissao: varchar("profissao", { length: 100 }),
  estadoCivil: varchar("estadoCivil", { length: 50 }),
  nacionalidade: varchar("nacionalidade", { length: 100 }),
  observacoes: text("observacoes"),
  status: mysqlEnum("status", ["ativo", "inativo", "arquivado"]).default("ativo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

// Tabela de processos
export const processos = mysqlTable("processos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  numeroProcesso: varchar("numeroProcesso", { length: 100 }).notNull().unique(),
  clienteId: varchar("clienteId", { length: 64 }).notNull(),
  tipo: varchar("tipo", { length: 100 }).notNull(), // Civil, Trabalhista, etc
  area: varchar("area", { length: 100 }).notNull(), // Área de atuação
  objeto: text("objeto").notNull(), // Descrição do processo
  valor: varchar("valor", { length: 50 }), // Valor da causa
  status: mysqlEnum("status", ["em_andamento", "suspenso", "arquivado", "finalizado"]).default("em_andamento").notNull(),
  // Datas importantes
  dataDistribuicao: varchar("dataDistribuicao", { length: 10 }),
  dataUltimaMovimentacao: varchar("dataUltimaMovimentacao", { length: 10 }),
  proximoPrazo: varchar("proximoPrazo", { length: 10 }),
  // Informações do tribunal
  comarca: varchar("comarca", { length: 100 }),
  vara: varchar("vara", { length: 100 }),
  juiz: varchar("juiz", { length: 255 }),
  // Observações
  observacoes: text("observacoes"),
  createdBy: varchar("createdBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Processo = typeof processos.$inferSelect;
export type InsertProcesso = typeof processos.$inferInsert;

// Tabela de log de atividades
export const atividadesLog = mysqlTable("atividadesLog", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  acao: varchar("acao", { length: 100 }).notNull(), // criar_documento, editar_cliente, etc
  entidade: varchar("entidade", { length: 50 }).notNull(), // documento, cliente, processo
  entidadeId: varchar("entidadeId", { length: 64 }),
  descricao: text("descricao"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AtividadeLog = typeof atividadesLog.$inferSelect;
export type InsertAtividadeLog = typeof atividadesLog.$inferInsert;



// Tabela de peças processuais
export const pecasProcessuais = mysqlTable("pecasProcessuais", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titulo: text("titulo").notNull(),
  tipo: mysqlEnum("tipo", [
    "peticao_inicial",
    "contestacao",
    "recurso",
    "peticao_intermediaria",
    "memoriais",
    "agravo",
    "apelacao",
    "embargos",
    "outro"
  ]).notNull(),
  conteudo: text("conteudo").notNull(),
  processoId: varchar("processoId", { length: 64 }),
  clienteId: varchar("clienteId", { length: 64 }),
  numeroProcesso: varchar("numeroProcesso", { length: 100 }),
  status: mysqlEnum("status", ["rascunho", "revisao", "finalizado", "enviado"]).default("rascunho").notNull(),
  versao: varchar("versao", { length: 10 }).default("1"),
  geradoPorIA: mysqlEnum("geradoPorIA", ["sim", "nao"]).default("nao"),
  promptIA: text("promptIA"),
  jurisprudencias: text("jurisprudencias"), // JSON com jurisprudências encontradas
  tags: text("tags"), // Tags para organização
  createdBy: varchar("createdBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type PecaProcessual = typeof pecasProcessuais.$inferSelect;
export type InsertPecaProcessual = typeof pecasProcessuais.$inferInsert;

