# 🎁 Lista de Presentes - Padrinhos

Uma aplicação web elegante e responsiva para visualizar uma lista de presentes para padrinhos, integrada com **Google Sheets** para facilitar o gerenciamento.

## ✨ Características

- 🎨 **Design Elegante**: Interface minimalista com tema escuro e glassmorphism
- 📱 **Mobile-First**: Totalmente responsivo para todos os dispositivos
- 📊 **Google Sheets**: Integração direta com planilha online para gerenciamento fácil
- ⚡ **Performance**: Cache inteligente e sincronização automática
- 🌐 **PWA Ready**: Suporte para Progressive Web App
- 🔄 **Auto-Sync**: Sincronização automática a cada 15 minutos

## 🚀 Deploy Rápido

### Vercel (Recomendado)
1. Faça fork deste repositório
2. Acesse [vercel.com](https://vercel.com)
3. Conecte seu GitHub e importe este projeto
4. Configure o Google Sheets ID (veja abaixo)
5. Deploy automático! ✨

### Netlify
1. Faça fork deste repositório
2. Acesse [netlify.com](https://netlify.com)
3. Conecte seu GitHub e selecione este repositório
4. Configure o Google Sheets ID (veja abaixo)
5. Deploy automático! ✨

## ⚙️ Configuração do Google Sheets

### 1. Criar e Configurar a Planilha

1. **Acesse** [Google Sheets](https://sheets.google.com)
2. **Crie** uma nova planilha
3. **Configure as colunas** (A, B, C):
   - **Coluna A**: Nome do Presente
   - **Coluna B**: URL do Produto
   - **Coluna C**: URL da Imagem

### 2. Tornar a Planilha Pública

⚠️ **IMPORTANTE**: A planilha deve estar pública para funcionar!

1. Clique em **"Compartilhar"** (botão azul)
2. Clique em **"Alterar para qualquer pessoa com o link"**
3. Selecione **"Visualizador"** (apenas leitura)
4. Copie o **ID da planilha** da URL:
   ```
   https://docs.google.com/spreadsheets/d/[SEU_ID_AQUI]/edit
   ```

### 3. Configurar na Aplicação

Edite apenas o arquivo: **`js/config.js`**

```javascript
spreadsheetId: 'SEU_ID_DA_PLANILHA_AQUI',
```

## 📁 Estrutura do Projeto

```
PadrinhosGifts/
├── index.html              # Página principal
├── css/
│   └── styles-public.css    # Estilos da aplicação
├── js/
│   ├── config.js           # ⚙️ CONFIGURAÇÃO (edite aqui)
│   └── main.js             # Lógica principal
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
└── vercel.json            # Configuração Vercel
```

## 🎨 Personalização

### Cores e Tema
Edite `css/styles-public.css` nas variáveis CSS:
```css
:root {
    --color-gold: #d4af37;
    --color-white: #ffffff;
    /* ... outras variáveis */
}
```

### Mensagens
Edite o arquivo `index.html` para personalizar:
- Título da página
- Mensagem para padrinhos
- Footer

## 🔧 Tecnologias

- **HTML5** semântico
- **CSS3** com variáveis e Grid Layout
- **JavaScript ES6+** vanilla
- **Google Sheets API** via CSV export
- **Progressive Web App** (PWA)
- **Responsive Design** mobile-first

## 📱 Funcionalidades

- ✅ Visualização elegante de presentes
- ✅ Links diretos para produtos
- ✅ Imagens responsivas com fallback
- ✅ Cache local para performance
- ✅ Sincronização automática
- ✅ Estados de loading e erro
- ✅ Suporte offline básico

## 🌐 Exemplo de Uso

1. **Crie sua planilha** com os presentes desejados
2. **Configure o ID** no arquivo `config.js`
3. **Faça deploy** na Vercel ou Netlify
4. **Compartilhe o link** com seus padrinhos

## 📝 Licença

Este projeto é open source e está disponível sob a [MIT License](LICENSE).

## 🎉 Créditos

Desenvolvido com ❤️ para Carol e Yuri.

---

### 🚀 Pronto para usar!

Basta configurar o Google Sheets ID e fazer deploy. Sua lista de presentes estará online em poucos minutos!
