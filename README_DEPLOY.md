# 🚀 Guia de Deploy - Lista de Presentes Padrinhos

Este guia contém instruções para publicar sua Lista de Presentes em diferentes plataformas de hospedagem.

## 📋 Pré-requisitos

- Todos os arquivos do projeto
- Conta na plataforma de hospedagem escolhida
- Git instalado (para algumas plataformas)

## 🌐 Opções de Hospedagem

### 1. Netlify (Recomendado - Gratuito)

**Vantagens:** Fácil, rápido, SSL gratuito, domínio customizado gratuito

**Passos:**
1. Acesse [netlify.com](https://netlify.com)
2. Faça login/cadastro
3. Arraste a pasta do projeto para a área de deploy
4. Ou conecte com repositório GitHub:
   - Crie um repositório no GitHub
   - Faça upload dos arquivos
   - Conecte o Netlify ao repositório

**Configurações:**
- Build command: (deixe vazio)
- Publish directory: (deixe vazio)
- O arquivo `netlify.toml` já está configurado

### 2. Vercel (Gratuito)

**Vantagens:** Integração perfeita com GitHub, performance excelente

**Passos:**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte com GitHub
3. Importe o repositório
4. Deploy automático

**Configurações:**
- O arquivo `vercel.json` já está configurado

### 3. GitHub Pages (Gratuito)

**Vantagens:** Integrado com GitHub, simples

**Passos:**
1. Crie um repositório público no GitHub
2. Faça upload dos arquivos
3. Vá em Settings > Pages
4. Selecione source: Deploy from a branch
5. Branch: main, folder: / (root)

### 4. Hospedagem Tradicional (cPanel/FTP)

**Para servidores com Apache:**

**Passos:**
1. Faça upload via FTP de todos os arquivos
2. O arquivo `.htaccess` já está configurado
3. Acesse pelo domínio

## 🔗 URLs Recomendadas

Depois do deploy, você terá:

- **Página Administrativa:** `https://seudominio.com/` ou `https://seudominio.com/admin`
- **Lista Pública:** `https://seudominio.com/public.html` ou `https://seudominio.com/lista`

## 🛡️ Segurança

### Dados de Login:
- **Usuário:** noivo ou noiva
- **Senha:** amor2025!

**⚠️ IMPORTANTE:** Após o deploy, considere alterar as credenciais no arquivo `js/script.js` (linha 3-6).

### Recomendações:
1. Use HTTPS sempre (automático no Netlify/Vercel)
2. Mantenha as credenciais seguras
3. Faça backup regular dos dados
4. Monitore acessos se necessário

## 📱 PWA (Progressive Web App)

A aplicação já está configurada como PWA:
- Pode ser instalada no celular
- Funciona offline
- Ícones configurados

## 🎨 Customização Pós-Deploy

### Domínio Personalizado:
- Netlify: Settings > Domain management
- Vercel: Settings > Domains
- GitHub Pages: Settings > Pages > Custom domain

### Analytics (Opcional):
Adicione Google Analytics inserindo o código no `<head>` das páginas.

## 📞 Suporte

Se tiver problemas:
1. Verifique se todos os arquivos foram enviados
2. Confira as configurações de SSL
3. Teste em modo incógnito
4. Verifique o console do navegador (F12)

## ✅ Checklist Final

- [ ] Todas as páginas carregam corretamente
- [ ] Login funciona (noivo/noiva - amor2025!)
- [ ] Adicionar presentes funciona
- [ ] Página pública exibe presentes
- [ ] Design responsivo funcionando
- [ ] Animações de loading ativas
- [ ] SSL ativo (HTTPS)

**🎉 Pronto! Sua lista de presentes está online!**
