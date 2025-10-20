# SITE INSTITUCIONAL JFG ADVOCACIA - ONE PAGE LANDING

## VISAO GERAL

Site institucional desenvolvido como **landing page de pagina unica (one-page)** seguindo exatamente o modelo de referencia fornecido. O design e focado em conversao, com navegacao por scroll suave entre secoes.

## MODELO DE REFERENCIA

**URL:** https://escritjurid-5lgyht8v.manus.space

O site foi desenvolvido replicando fielmente a estrutura, design e conteudo do modelo de referencia.

## ESTRUTURA DO SITE

### Formato One-Page

O site e uma landing page de pagina unica com as seguintes secoes:

1. **Header/Hero**
   - Logo JFG Advocacia no topo
   - Botao CTA "Agende uma Consulta" (ancora para secao contato)
   - Imagem hero em tela cheia com overlay azul
   - Titulo principal: "JFG Advocacia & Consultoria Juridica"
   - Subtitulo com proposta de valor

2. **Sobre Nos**
   - Texto sobre experiencia de 20 anos
   - Descricao da equipe e valores
   - Imagem ilustrativa do escritorio
   - Layout em duas colunas (texto + imagem)

3. **Areas de Atuacao**
   - 6 areas principais em grid de cards:
     * Direito Civil
     * Direito Empresarial
     * Direito Trabalhista
     * Direito Tributario
     * Direito de Familia
     * Direito Imobiliario
   - Cada area com icone, titulo e descricao breve

4. **Nossa Equipe**
   - Apresentacao do Dr. Jose Fabio Garcez
   - Foto profissional
   - Cargo: Socio Fundador
   - Especialidades: Direito do Trabalho e Direito Empresarial
   - OAB/SP 504.270

5. **Contato**
   - Fundo azul escuro com gradiente
   - 3 cards com informacoes:
     * Endereco: Rua Capitao Antonio Rosa, 409, Sao Paulo - SP
     * Telefones: (11) 2133-2188 e (11) 9 4721-9180
     * Horario: Segunda a Sexta 9h-18h, Sabado 9h-13h
   - Botao WhatsApp destacado

6. **Footer**
   - Copyright e informacoes legais
   - OAB do advogado

### Elementos Adicionais

- **Botao WhatsApp Flutuante:** Fixo no canto inferior direito em todas as secoes
- **Navegacao Suave:** Scroll suave ao clicar no botao "Agende uma Consulta"

## DESIGN E IDENTIDADE VISUAL

### Paleta de Cores

A paleta segue o padrao profissional para escritorios de advocacia:

- **Azul Marinho:** #1e3a8a, #1e40af (cor primaria - confianca e seriedade)
- **Azul Escuro:** #172554 (footer e secoes escuras)
- **Dourado/Ambar:** #f59e0b, #d97706 (cor secundaria - excelencia e prestigio)
- **Cinza:** #f9fafb, #6b7280 (backgrounds e textos secundarios)
- **Branco:** #ffffff (textos principais e cards)
- **Verde WhatsApp:** #10b981 (botao WhatsApp)

### Tipografia

- **Titulos:** Font-bold, tamanhos grandes (text-4xl a text-6xl)
- **Subtitulos:** Font-semibold, tamanhos medios (text-xl a text-2xl)
- **Textos:** Font-normal, tamanhos regulares (text-base a text-lg)
- **Espacamento:** Leading-relaxed para melhor leitura

### Layout

- **Hero:** Tela cheia com imagem de fundo e overlay escuro
- **Secoes:** Alternancia entre fundo branco e cinza claro
- **Contato:** Fundo azul escuro para destaque
- **Container:** Max-width de 6xl (1280px) para conteudo
- **Espacamento:** Padding generoso (py-20) entre secoes

## IMAGENS UTILIZADAS

### Imagens Reais

1. **logo-jfg.png** - Logo JFG Advocacia gerado com IA
   - Letras JFG em azul marinho
   - Balanca da justica em dourado
   - Design elegante e profissional

2. **hero-image.jpg** - Imagem do escritorio moderno
   - Escritorio de advocacia contemporaneo
   - Iluminacao profissional
   - Alta qualidade

3. **about-image.jpg** - Imagem da secao sobre
   - Escritorio elegante com design moderno
   - Transmite profissionalismo

4. **foto-jfg.jpg** - Foto do advogado
   - Advogado profissional em terno
   - Foto corporativa de qualidade

### Localizacao

Todas as imagens estao em: `/client/public/images/`

## TECNOLOGIAS UTILIZADAS

### Frontend

- **React 18+** com TypeScript
- **Tailwind CSS** para estilizacao
- **Wouter** para roteamento
- **Lucide React** para icones
- **Shadcn/ui** para componentes (Card, Button)

### Componentes Principais

- **HomeLanding.tsx** - Componente principal da landing page
- **Procuracao.tsx** - Formulario de procuracao (rota separada /procuracao)

## RESPONSIVIDADE

O site e totalmente responsivo com design mobile-first:

### Breakpoints

- **Mobile:** < 768px
  - Hero com texto menor
  - Grid de areas em 1 coluna
  - Cards empilhados verticalmente

- **Tablet:** 768px - 1024px
  - Hero com texto medio
  - Grid de areas em 2 colunas
  - Layout adaptado

- **Desktop:** > 1024px
  - Hero com texto grande
  - Grid de areas em 3 colunas
  - Layout completo

### Elementos Responsivos

- Imagens adaptativas com object-cover
- Textos com tamanhos responsivos (text-xl md:text-2xl)
- Grid com breakpoints (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Espacamento ajustado por tamanho de tela

## FUNCIONALIDADES

### Navegacao por Ancoras

A navegacao e feita por scroll suave entre secoes:

```typescript
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
```

### Secoes com IDs

- `#sobre` - Secao Sobre Nos
- `#areas` - Secao Areas de Atuacao
- `#equipe` - Secao Nossa Equipe
- `#contato` - Secao Contato

### Integracao WhatsApp

Dois pontos de contato via WhatsApp:

1. **Botao flutuante:** Fixo no canto inferior direito
2. **Botao na secao contato:** "Chamar no WhatsApp"

Ambos abrem conversa direta com numero (11) 9 4721-9180.

### Sistema de Procuracao

O sistema de procuracao digital continua disponivel na rota `/procuracao`, mantendo todas as funcionalidades:

- Formulario completo
- Validacao de campos
- Busca de CEP
- Assinatura digital
- Foto de autenticacao
- Geracao de PDF
- Integracao WhatsApp

## DADOS DO ESCRITORIO

**Nome:** JFG Advocacia  
**Slogan:** Advocacia & Consultoria Juridica  
**Advogado:** Dr. Jose Fabio Garcez  
**Cargo:** Socio Fundador  
**OAB:** 504.270/SP  
**Especialidades:** Direito do Trabalho e Direito Empresarial  

**Endereco:** Rua Capitao Antonio Rosa, 409, Sao Paulo - SP  
**Telefones:** (11) 2133-2188 | (11) 9 4721-9180  
**Horario:** Segunda a Sexta 9h-18h | Sabado 9h-13h  
**WhatsApp:** (11) 9 4721-9180  

## AREAS DE ATUACAO

1. **Direito Civil** - Contratos, indenizacoes, responsabilidade civil e questoes patrimoniais
2. **Direito Empresarial** - Constituicao de empresas, contratos comerciais e consultoria corporativa
3. **Direito Trabalhista** - Defesa em acoes trabalhistas, acordos e consultoria preventiva
4. **Direito Tributario** - Planejamento tributario, recuperacao de creditos e defesas fiscais
5. **Direito de Familia** - Divorcio, guarda, pensao alimenticia e inventarios
6. **Direito Imobiliario** - Compra e venda, locacao, regularizacao e usucapiao

## DIFERENCAS DO MODELO ANTERIOR

### Modelo Anterior (Multi-Pagina)

- 5 paginas separadas (Home, Sobre, Areas, Contato, Procuracao)
- Navegacao entre paginas com menu
- Mais conteudo detalhado
- Header e Footer em todas as paginas

### Modelo Atual (One-Page)

- 1 pagina unica com 5 secoes
- Navegacao por scroll/ancoras
- Conteudo mais conciso e direto
- Foco em conversao rapida
- Design mais clean e moderno

## VANTAGENS DO ONE-PAGE

1. **Conversao:** Fluxo linear guia o visitante ate o contato
2. **Mobile-Friendly:** Scroll natural em dispositivos moveis
3. **Carregamento:** Uma unica pagina carrega mais rapido
4. **Storytelling:** Narrativa sequencial da marca
5. **Manutencao:** Mais facil de atualizar e manter

## ROTAS DISPONIVEIS

- `/` - Landing page principal (one-page)
- `/procuracao` - Sistema de procuracao digital
- `/404` - Pagina de erro

## PROXIMOS PASSOS

### Melhorias Futuras

1. **Formulario de Contato:** Adicionar formulario funcional na secao contato
2. **Animacoes:** Adicionar animacoes de scroll (fade-in, slide-up)
3. **Mapa:** Integrar Google Maps na secao contato
4. **Depoimentos:** Adicionar secao de depoimentos de clientes
5. **Blog:** Adicionar secao de artigos juridicos
6. **SEO:** Otimizar meta tags e structured data
7. **Analytics:** Integrar Google Analytics
8. **Chat:** Adicionar chat ao vivo

### Sessoes Futuras (Cronograma Original)

- **Sessao 2 (03/11/2025):** Sistema unificado de documentos
- **Sessao 3 (10/11/2025):** Painel administrativo
- **Sessao 4 (17/11/2025):** Sistema de pagamentos
- **Sessao 5 (24/11/2025):** Consultas processuais
- **Sessao 6 (01/12/2025):** Refinamentos finais

## DEPLOY

### Desenvolvimento

- **Servidor local:** http://localhost:3000
- **Servidor dev:** https://3000-i27npk98rbet29sjjfccm-6fee5f36.manusvm.computer

### Producao

- **Dominio:** jfg.adv.br
- **Plataforma:** Vercel
- **Deploy:** Automatico via Git

## TESTES REALIZADOS

- [x] Hero carregando com imagem e overlay
- [x] Logo JFG aparecendo corretamente
- [x] Botao "Agende uma Consulta" funcionando
- [x] Secao Sobre Nos com texto e imagem
- [x] 6 areas de atuacao em cards
- [x] Secao equipe com foto do Dr. Jose Fabio
- [x] Secao contato com 3 cards de informacoes
- [x] Botao WhatsApp flutuante funcionando
- [x] Footer com copyright
- [x] Scroll suave entre secoes
- [x] Design responsivo em mobile
- [x] Sistema de procuracao acessivel via /procuracao

## OBSERVACOES IMPORTANTES

1. **Textos sem acentos:** Mantido padrao sem acentuacao para evitar problemas de encoding
2. **Imagens reais:** Utilizadas imagens profissionais de alta qualidade
3. **Logo gerado:** Logo JFG criado com IA seguindo identidade visual
4. **One-page puro:** Navegacao apenas por scroll, sem menu tradicional
5. **CTA unico:** Foco em "Agende uma Consulta" como acao principal
6. **WhatsApp prioritario:** Dois pontos de contato via WhatsApp para facilitar conversao

## ESTRUTURA DE ARQUIVOS

```
client/
├── public/
│   └── images/
│       ├── logo-jfg.png (logo gerado)
│       ├── hero-image.jpg (escritorio moderno)
│       ├── about-image.jpg (escritorio elegante)
│       └── foto-jfg.jpg (foto advogado)
├── src/
│   ├── pages/
│   │   ├── HomeLanding.tsx (landing page principal - NOVO)
│   │   ├── Procuracao.tsx (formulario procuracao)
│   │   └── NotFound.tsx
│   ├── components/
│   │   └── ui/ (componentes shadcn)
│   └── App.tsx (rotas atualizadas)
```

## STATUS

✅ **SITE ONE-PAGE CONCLUIDO COM SUCESSO**

Landing page de pagina unica desenvolvida seguindo fielmente o modelo de referencia, com design profissional, imagens de qualidade e foco em conversao.

---

**Data de atualizacao:** 20/10/2025  
**Modelo de referencia:** https://escritjurid-5lgyht8v.manus.space  
**Formato:** One-Page Landing Page  
**Status:** Pronto para Deploy  
**Versao:** 2.0.0

