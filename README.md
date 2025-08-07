# Lista de Presentes - Padrinhos

Uma aplicação web elegante e responsiva para gerenciar uma lista de presentes para padrinhos, com design moderno e foco na experiência mobile.

## 🎨 Design

- **Cores**: Paleta minimalista com preto, cinza e branco
- **Tipografia**: Inter (Google Fonts)
- **Layout**: Mobile-first, responsivo
- **Estilo**: Moderno, limpo e elegante

## ✨ Funcionalidades

- 🔐 **Sistema de Login**: Acesso restrito apenas aos noivos
- ➕ **Adicionar Presentes**: Cadastre itens com título, imagem e link para marketplace
- �️ **Visualização Pública**: Página separada para os padrinhos visualizarem a lista
- �🖼️ **Validação de Imagens**: Verificação automática se as URLs das imagens são válidas
- 💾 **Persistência Local**: Os dados são salvos automaticamente no navegador
- 🗑️ **Remover Itens**: Exclusão com confirmação de segurança (apenas para usuários logados)
- 📱 **Design Responsivo**: Otimizado para mobile, tablet e desktop
- ♿ **Acessibilidade**: Navegação por teclado e foco visual adequado
- 📤 **Compartilhamento**: Botão de compartilhar na página pública (se suportado pelo navegador)

## 🚀 Como Usar

### Para os Noivos (Administradores):
1. **Fazer Login**: Use as credenciais fornecidas na tela de login
   - Usuário: `noivo` ou `noiva`
   - Senha: `amor2025!`
2. **Adicionar Presente**: Clique no botão "Adicionar Presente"
3. **Preencher Dados**:
   - Título do presente
   - URL da imagem do produto
   - Link para o produto no marketplace
4. **Salvar**: Os dados são salvos automaticamente
5. **Visualizar**: Veja todos os presentes em cards organizados
6. **Ver Lista Pública**: Use o botão "👁️ Ver Lista Pública" para abrir a visualização dos padrinhos
7. **Remover**: Use o botão de lixeira para excluir itens
8. **Logout**: Clique em "Sair" quando terminar

### Para os Padrinhos (Visualização):
1. **Acessar Lista**: Abra o arquivo `public.html` ou use o link fornecido pelos noivos
2. **Visualizar Presentes**: Veja todos os presentes disponíveis
3. **Acessar Produtos**: Clique em "Ver Presente" para ir ao marketplace
4. **Compartilhar**: Use o botão de compartilhar (se disponível) para enviar a lista

## 📁 Estrutura do Projeto

```
PadrinhosGifts/
├── index.html          # Página de administração (com login)
├── public.html         # Página pública para visualização
├── css/
│   └── styles.css      # Estilos CSS
├── js/
│   ├── script.js       # Lógica de administração
│   └── public.js       # Lógica da página pública
└── .github/
    └── copilot-instructions.md
```

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com Grid, Flexbox e variáveis CSS
- **JavaScript ES6+**: Funcionalidades interativas
- **localStorage**: Persistência de dados local
- **Google Fonts**: Tipografia Inter

## 📱 Responsividade

- **Mobile**: Até 480px - Layout em coluna única
- **Tablet**: 481px - 768px - Layout em duas colunas
- **Desktop**: 769px+ - Layout em múltiplas colunas

## 🎯 Características Técnicas

- **Mobile-First**: Desenvolvido priorizando dispositivos móveis
- **Performance**: Carregamento otimizado de imagens
- **Acessibilidade**: Suporte a navegação por teclado e leitores de tela
- **Segurança**: Validação de URLs e escape de HTML
- **UX**: Feedback visual e animações suaves

## 🔒 Segurança

- Sistema de autenticação para acesso restrito aos noivos
- Sessões com expiração automática (24 horas)
- Validação de URLs antes de adicionar links
- Escape de HTML para prevenir XSS
- Verificação de imagens antes de exibir
- Sanitização de inputs do usuário
- Separação entre área administrativa e pública

## 💡 Melhorias Futuras

- [ ] Integração com banco de dados real
- [ ] Sistema de notificações
- [ ] Categorização de presentes
- [ ] Sistema de favoritos
- [ ] Backup online/sincronização
- [ ] Múltiplos usuários administrativos
- [ ] Sistema de múltiplas listas
- [ ] Integração com APIs de marketplaces

## 🔑 Credenciais de Acesso

**Usuários Administrativos:**
- Usuário: `noivo` / Senha: `amor2025!`
- Usuário: `noiva` / Senha: `amor2025!`

> **Importante:** Altere as credenciais no arquivo `js/script.js` na seção `AUTH_CONFIG` antes de usar em produção.

## 🤝 Contribuição

Este projeto foi desenvolvido para uso pessoal, mas sinta-se à vontade para sugerir melhorias ou usar como base para seus próprios projetos.

---

Feito com ❤️ para organizar presentes dos padrinhos de forma elegante e prática.
