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

// Tabela de documentos (sistema unificado)
export const documentos = mysqlTable("documentos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tipo: mysqlEnum("tipo", ["procuracao", "contrato", "distrato", "declaracao", "recibo"]).notNull(),
  numero: varchar("numero", { length: 50 }).notNull(), // Número sequencial por tipo
  status: mysqlEnum("status", ["rascunho", "gerado", "enviado", "assinado"]).default("rascunho").notNull(),
  
  // Dados do cliente
  clienteNome: text("clienteNome").notNull(),
  clienteCpf: varchar("clienteCpf", { length: 14 }).notNull(),
  clienteRg: varchar("clienteRg", { length: 50 }),
  clienteEndereco: text("clienteEndereco"),
  clienteTelefone: varchar("clienteTelefone", { length: 20 }),
  clienteEmail: varchar("clienteEmail", { length: 320 }),
  
  // Conteúdo específico do documento (JSON)
  conteudoJson: text("conteudoJson").notNull(),
  
  // Assinaturas
  assinaturaCliente: text("assinaturaCliente"),
  fotoCliente: text("fotoCliente"),
  dataAssinaturaCliente: timestamp("dataAssinaturaCliente"),
  ipCliente: varchar("ipCliente", { length: 45 }),
  
  assinaturaAdvogado: text("assinaturaAdvogado"),
  dataAssinaturaAdvogado: timestamp("dataAssinaturaAdvogado"),
  
  // Metadados
  qrCode: text("qrCode"),
  pdfUrl: text("pdfUrl"),
  emailEnviado: mysqlEnum("emailEnviado", ["sim", "nao"]).default("nao"),
  criadoPor: varchar("criadoPor", { length: 64 }).notNull(), // ID do usuário
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Documento = typeof documentos.$inferSelect;
export type InsertDocumento = typeof documentos.$inferInsert;

// Tabela de templates
export const templates = mysqlTable("templates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tipoDocumento: mysqlEnum("tipoDocumento", ["procuracao", "contrato", "distrato", "declaracao", "recibo"]).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  conteudo: text("conteudo").notNull(), // HTML/Markdown com variáveis
  versao: varchar("versao", { length: 20 }).default("1.0"),
  ativo: mysqlEnum("ativo", ["sim", "nao"]).default("sim"),
  padrao: mysqlEnum("padrao", ["sim", "nao"]).default("nao"), // Template padrão não editável
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

// Tabela de audit log
export const auditLog = mysqlTable("audit_log", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  acao: varchar("acao", { length: 100 }).notNull(),
  documentoId: varchar("documentoId", { length: 64 }),
  detalhes: text("detalhes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;
