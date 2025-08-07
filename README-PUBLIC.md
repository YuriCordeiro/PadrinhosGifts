# Lista de Presentes - Padrinhos

Uma aplicação web elegante e responsiva para visualizar uma lista de presentes para padrinhos, integrada com Google Sheets para facilitar o gerenciamento.

## 🎨 Design

- **Cores**: Paleta minimalista com preto, cinza e branco
- **Tipografia**: Inter (Google Fonts)
- **Layout**: Mobile-first, responsivo
- **Estilo**: Moderno, limpo e elegante

## ✨ Funcionalidades

- 📊 **Integração Google Sheets**: Lista carregada automaticamente de uma planilha online
- 🔄 **Sincronização Automática**: Atualização a cada 15 minutos
- 🖼️ **Exibição Rica**: Imagens, títulos e links para produtos
- 📱 **Design Responsivo**: Otimizado para mobile, tablet e desktop
- ♿ **Acessibilidade**: Navegação otimizada e foco visual adequado
- ⚡ **Performance**: Cache local para carregamento rápido
- 🌙 **Dark Mode**: Suporte automático ao modo escuro do sistema

## 🔧 Configuração

### Google Sheets Setup:

1. **Criar Planilha**: Crie uma nova planilha no Google Sheets
2. **Estrutura das Colunas**:
   - **Coluna A**: Nome do Produto
   - **Coluna B**: Link Produto  
   - **Coluna C**: Link Imagem Produto
3. **Tornar Pública**: 
   - Clique em "Compartilhar" → "Alterar" → "Qualquer pessoa com o link"
   - Selecione "Visualizador"
4. **Obter ID da Planilha**: 
   - Copie o ID da URL: `https://docs.google.com/spreadsheets/d/[SEU_ID_AQUI]/edit`
5. **Configurar Aplicação**: 
   - Abra `js/main.js`
   - Substitua `SEU_ID_AQUI` pelo ID da sua planilha

### Exemplo de Planilha:
| Nome do Produto | Link Produto | Link Imagem Produto |
|-----------------|--------------|---------------------|
| Aparelho de Jantar 30 Peças | https://exemplo.com/produto1 | https://exemplo.com/imagem1.jpg |
| Conjunto de Panelas | https://exemplo.com/produto2 | https://exemplo.com/imagem2.jpg |

## 🚀 Como Usar

### Para Gerenciar a Lista:
1. **Editar Google Sheets**: Acesse sua planilha diretamente no Google Sheets
2. **Adicionar Produtos**: Insira novas linhas com as informações dos presentes
3. **Atualizar URLs**: Certifique-se de que todos os links são válidos
4. **Salvar**: As mudanças são sincronizadas automaticamente

### Para os Padrinhos (Visualização):
1. **Acessar Lista**: Abra `index.html` ou o link fornecido pelos noivos
2. **Visualizar Presentes**: Veja todos os presentes disponíveis
3. **Acessar Produtos**: Clique em "Ver Produto" para ir ao marketplace
4. **Aguardar Atualizações**: A lista é atualizada automaticamente a cada 15 minutos

## 📁 Estrutura do Projeto

```
PadrinhosGifts/
├── index.html              # Página principal (visualização pública)
├── admin-backup.html       # Backup da versão administrativa
├── manifest.json           # Configuração PWA
├── sw.js                   # Service Worker
├── css/
│   ├── styles-public.css   # Estilos da versão pública
│   └── styles-admin-backup.css # Backup dos estilos administrativos
├── js/
│   ├── main.js            # Script principal (versão pública)
│   ├── public.js          # Script da página pública (backup)
│   └── script.js          # Script administrativo (backup)
└── data/
    └── presentes-iniciais.json # Dados de fallback
```

## 🌐 Deploy

### Netlify:
1. Faça upload da pasta do projeto
2. Configure o Google Sheets ID
3. Site estará disponível automaticamente

### Vercel:
1. Conecte o repositório
2. Configure o Google Sheets ID
3. Deploy automático

### GitHub Pages:
1. Faça upload para um repositório
2. Ative GitHub Pages
3. Configure o Google Sheets ID

## 🔧 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo e animações
- **JavaScript ES6+**: Lógica da aplicação
- **Google Sheets**: Fonte de dados
- **PWA**: Funcionalidades de app nativo

## 📱 PWA (Progressive Web App)

A aplicação pode ser instalada como um app nativo:
- **Android**: "Adicionar à tela inicial"
- **iOS**: "Adicionar à Tela de Início"
- **Desktop**: Ícone de instalação na barra de endereços

## 🛠️ Personalização

### Cores:
Edite as variáveis CSS em `css/styles-public.css`:
```css
:root {
    --color-primary: #000000;
    --color-secondary: #1a1a1a;
    --color-tertiary: #666666;
}
```

### Textos:
Modifique os textos diretamente no `index.html`:
- Título da página
- Subtítulo
- Mensagens de estado vazio

### Intervalo de Sincronização:
Altere em `js/main.js`:
```javascript
// 15 minutos = 900000 ms
setInterval(..., 900000);
```

## 🐛 Solução de Problemas

### Lista não carrega:
1. Verifique se a planilha está pública
2. Confirme o ID da planilha no código
3. Verifique o console do navegador para erros

### Imagens não aparecem:
1. Certifique-se de que as URLs das imagens são públicas
2. Use links diretos para imagens (ex: .jpg, .png)
3. Evite links que redirecionam

### Sincronização lenta:
1. Verifique sua conexão com a internet
2. O Google Sheets pode ter delay para mudanças muito recentes
3. Use o cache local como fallback

## 📄 Licença

Este projeto é de uso pessoal para lista de presentes de casamento.

## 💝 Criado com amor para nossos queridos padrinhos!

---

*Que esta lista ajude a tornar nosso dia especial ainda mais memorável! 💒✨*
