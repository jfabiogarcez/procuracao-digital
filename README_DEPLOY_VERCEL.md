# 🚀 Deploy no Vercel - Passo a Passo

## ✅ Você está em: https://vercel.com/new

Siga estes passos simples:

---

## 📦 **Opção 1: Upload Direto (MAIS FÁCIL)**

### **Passo 1: Preparar o Projeto**
1. Extraia o arquivo `procuracao-digital-completo.zip`
2. Você terá a pasta `procuracao-digital/`

### **Passo 2: Fazer Upload no Vercel**
1. Na página do Vercel, procure por **"Deploy"** ou **"Import Project"**
2. Escolha **"Upload"** ou arraste a pasta `procuracao-digital`
3. Aguarde o upload (pode levar 1-2 minutos)

### **Passo 3: Configurar**
O Vercel detectará automaticamente:
- ✅ Framework: Vite
- ✅ Build Command: `vite build`
- ✅ Output Directory: `dist`

**Deixe tudo como está e clique em "Deploy"!**

### **Passo 4: Aguardar**
- Deploy leva 2-5 minutos
- Você receberá um link como: `https://procuracao-digital-xxx.vercel.app`

---

## 📦 **Opção 2: Via GitHub (Recomendado para Atualizações)**

### **Passo 1: Criar Repositório no GitHub**
1. Acesse: https://github.com/new
2. Nome: `procuracao-digital`
3. Privado (recomendado)
4. Clique em **"Create repository"**

### **Passo 2: Fazer Upload do Código**

**No seu computador:**
```bash
# Extrair o ZIP
unzip procuracao-digital-completo.zip

# Entrar na pasta
cd procuracao-digital

# Inicializar Git
git init

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Deploy inicial - Sistema de Procuração Digital"

# Conectar ao GitHub (substitua SEU-USUARIO)
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/procuracao-digital.git

# Enviar para GitHub
git push -u origin main
```

### **Passo 3: Importar no Vercel**
1. Na página do Vercel, clique em **"Import Git Repository"**
2. Autorize o acesso ao GitHub (se solicitado)
3. Escolha o repositório `procuracao-digital`
4. Clique em **"Import"**

### **Passo 4: Configurar (Automático)**
O Vercel detectará:
- ✅ Framework: Vite
- ✅ Build Command: `vite build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `pnpm install`

**Clique em "Deploy"!**

---

## ⚙️ **Configurações Importantes**

### **Variáveis de Ambiente** (Se necessário)
Se o projeto precisar de variáveis de ambiente:

1. No Vercel, vá em **"Settings"** → **"Environment Variables"**
2. Adicione:
   ```
   NODE_ENV=production
   ```

---

## 🌐 **Domínio Personalizado**

Após o deploy, você pode configurar seu domínio:

### **Passo 1: No Vercel**
1. Vá em **"Settings"** → **"Domains"**
2. Clique em **"Add Domain"**
3. Digite: `procuracao.jfgadvocacia.com.br`

### **Passo 2: Na Locaweb**
1. Acesse o painel da Locaweb
2. Vá em **"Gerenciamento de DNS"**
3. Adicione um registro CNAME:
   ```
   Nome: procuracao
   Tipo: CNAME
   Valor: cname.vercel-dns.com
   ```

---

## 🎯 **Link Final**

Após o deploy, você terá:
- **Link temporário**: `https://procuracao-digital-xxx.vercel.app`
- **Link personalizado** (após configurar): `https://procuracao.jfgadvocacia.com.br`

---

## 🆘 **Problemas Comuns**

### **Erro: "Build Failed"**
- Verifique se todos os arquivos foram enviados
- Tente novamente o deploy

### **Erro: "Module not found"**
- O Vercel instalará as dependências automaticamente
- Aguarde alguns minutos

### **Página em branco**
- Verifique se o Output Directory está como `dist`
- Recarregue a página (Ctrl+F5)

---

## 📞 **Precisa de Ajuda?**

Se tiver algum problema:
1. Tire um print da tela
2. Me envie a mensagem de erro
3. Vou te ajudar a resolver!

---

**Boa sorte com o deploy! 🚀**

