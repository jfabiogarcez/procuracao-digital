# SITE INSTITUCIONAL JFG ADVOCACIA

## VISAO GERAL

Site institucional completo desenvolvido para JFG Advocacia, integrando o sistema de procuracao digital existente com novas paginas institucionais profissionais.

## ESTRUTURA DO SITE

### Paginas Desenvolvidas

1. **Home (/)** - `HomeInstitucional.tsx`
   - Hero section com apresentacao do escritorio
   - Cards de areas de atuacao
   - Secao de diferenciais
   - Destaque para procuracao digital
   - CTAs para contato e procuracao

2. **Sobre (/sobre)** - `About.tsx`
   - Historia da JFG Advocacia
   - Apresentacao do Dr. Jose Fabio Garcez
   - Missao e valores do escritorio
   - Localizacao e informacoes

3. **Areas de Atuacao (/areas-atuacao)** - `PracticeAreas.tsx`
   - 8 areas de atuacao detalhadas
   - Servicos especificos de cada area
   - CTA para contato

4. **Contato (/contato)** - `Contact.tsx`
   - Formulario de contato completo
   - Informacoes de endereco e telefone
   - Horario de atendimento
   - Mapa de localizacao (placeholder)

5. **Procuracao Digital (/procuracao)** - `Procuracao.tsx`
   - Formulario completo de procuracao
   - Validacao de campos
   - Busca automatica de CEP
   - Assinatura digital
   - Foto de autenticacao
   - Geracao de PDF
   - Integracao WhatsApp

### Componentes Criados

1. **Header.tsx**
   - Logo JFG Advocacia
   - Menu de navegacao responsivo
   - Botao CTA para procuracao digital
   - Menu hamburger para mobile

2. **Footer.tsx**
   - Informacoes do escritorio
   - Links rapidos
   - Dados de contato completos
   - Copyright e OAB

3. **WhatsAppButton.tsx**
   - Botao flutuante de WhatsApp
   - Link direto para conversa
   - Mensagem pre-formatada

## DESIGN E IDENTIDADE VISUAL

### Paleta de Cores

- **Primaria:** Azul Marinho (#1e3a8a, #1e40af)
- **Secundaria:** Dourado/Ambar (#f59e0b, #d97706)
- **Neutras:** Cinza escuro, cinza claro, branco
- **Destaque:** Verde (WhatsApp - #10b981)

### Tipografia

- Fonte principal: System fonts (Inter, Roboto)
- Hierarquia clara de titulos
- Espacamento adequado para leitura

### Elementos Visuais

- Icones Lucide React
- Cards com hover effects
- Gradientes sutis
- Bordas superiores coloridas nos cards
- Espacamento generoso

## TECNOLOGIAS UTILIZADAS

### Frontend
- React 18+
- TypeScript
- Tailwind CSS
- Wouter (roteamento)
- Lucide React (icones)
- Shadcn/ui (componentes)

### Funcionalidades
- React Signature Canvas (assinatura digital)
- jsPDF (geracao de PDF)
- ViaCEP API (busca de endereco)
- Sonner (notificacoes toast)

## RESPONSIVIDADE

- **Mobile First:** Design otimizado para celular
- **Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Menu hamburger em mobile
- Grid adaptativo em todas as paginas
- Componentes flexiveis

## FUNCIONALIDADES PRINCIPAIS

### Navegacao
- Menu responsivo com todas as paginas
- Links internos funcionais
- Botao destacado para procuracao digital
- Footer com links rapidos

### Formulario de Contato
- Validacao de campos obrigatorios
- Campos: nome, email, telefone, assunto, mensagem
- Feedback visual ao usuario
- Preparado para integracao com servico de email

### Procuracao Digital
- Formulario completo com validacoes
- Busca automatica de endereco por CEP
- Assinatura digital com canvas
- Upload de foto opcional
- Geracao de PDF com todos os dados
- Integracao com WhatsApp
- Download automatico do documento

### WhatsApp
- Botao flutuante em todas as paginas
- Link direto para conversa
- Mensagem pre-formatada
- Icone verde padrao WhatsApp

## DADOS DO ESCRITORIO

**Nome:** JFG Advocacia  
**Advogado:** Dr. Jose Fabio Garcez  
**OAB:** 504.270/SP  
**Endereco:** Rua Capitao Antonio Rosa, n 409, 1 Andar, Edificio Spaces, Jardim Paulistano, Sao Paulo/SP, CEP 01443-010  
**E-mail:** jose.fabio.garcez@jfg.adv.br  
**Telefone/WhatsApp:** (11) 94721-9180  

## AREAS DE ATUACAO

1. Direito de Familia
2. Direito Trabalhista
3. Direito Civil
4. Direito do Consumidor
5. Direito Previdenciario
6. Direito Imobiliario
7. Direito Empresarial
8. Outras Areas

## PROXIMOS PASSOS

### Sessao 2 (03/11/2025)
- Sistema unificado de documentos
- Novos tipos de documentos
- Templates reutilizaveis

### Sessao 3 (10/11/2025)
- Painel administrativo
- Dashboard com estatisticas
- CRUD de advogados
- Sistema de autenticacao

### Sessao 4 (17/11/2025)
- Sistema de pagamentos
- Integracao Mercado Pago
- PIX, Cartao, Boleto

### Sessao 5 (24/11/2025)
- Consultas processuais
- Integracao com APIs juridicas
- Acompanhamento automatico

### Sessao 6 (01/12/2025)
- Refinamentos finais
- Testes integrados
- Otimizacoes
- Documentacao completa

## DEPLOY

### Desenvolvimento
- Servidor local: http://localhost:3000
- Servidor dev: https://3000-i27npk98rbet29sjjfccm-6fee5f36.manusvm.computer

### Producao
- Dominio: jfg.adv.br
- Plataforma: Vercel
- Deploy automatico via Git

## OBSERVACOES IMPORTANTES

1. **Textos sem acentos:** Todos os textos foram escritos sem acentuacao para evitar problemas de encoding
2. **Formulario de contato:** Atualmente simula envio, precisa integracao com servico de email em producao
3. **Mapa:** Placeholder visual, pode ser integrado Google Maps futuramente
4. **Imagens:** Utilizando icones, pode adicionar fotos do escritorio futuramente
5. **SEO:** Meta tags basicas, pode ser otimizado futuramente

## ESTRUTURA DE ARQUIVOS

```
client/src/
├── components/
│   ├── Header.tsx (novo)
│   ├── Footer.tsx (novo)
│   ├── WhatsAppButton.tsx (novo)
│   └── ui/ (componentes shadcn)
├── pages/
│   ├── HomeInstitucional.tsx (novo)
│   ├── About.tsx (novo)
│   ├── PracticeAreas.tsx (novo)
│   ├── Contact.tsx (novo)
│   ├── Procuracao.tsx (renomeado de Home.tsx)
│   └── NotFound.tsx
├── App.tsx (atualizado com novas rotas)
└── main.tsx
```

## TESTES REALIZADOS

- [x] Navegacao entre paginas funcionando
- [x] Menu responsivo em mobile
- [x] Formulario de contato com validacao
- [x] Formulario de procuracao completo
- [x] Busca de CEP funcionando
- [x] Assinatura digital funcionando
- [x] Geracao de PDF funcionando
- [x] Integracao WhatsApp funcionando
- [x] Botao flutuante WhatsApp em todas as paginas
- [x] Footer com links funcionais
- [x] Design responsivo em todas as paginas

## STATUS

✅ **SESSAO 1 CONCLUIDA COM SUCESSO**

Site institucional completo desenvolvido e testado, pronto para deploy em producao.

---

**Data de criacao:** 20/10/2025  
**Sessao:** 1 - Site Institucional  
**Desenvolvido por:** Manus AI  
**Versao:** 1.0.0

