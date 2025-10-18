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
  // Metadados
  dataEmissao: timestamp("dataEmissao").defaultNow().notNull(),
  qrCode: text("qrCode"), // Dados do QR Code
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Procuracao = typeof procuracoes.$inferSelect;
export type InsertProcuracao = typeof procuracoes.$inferInsert;
