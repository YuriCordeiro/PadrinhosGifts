<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Lista de Presentes - Padrinhos

Este é um projeto web para gerenciar uma lista de presentes para padrinhos, com design elegante e mobile-first.

## Tecnologias Utilizadas
- HTML5 semântico
- CSS3 com variáveis CSS e Grid Layout
- JavaScript ES6+ vanilla
- localStorage para persistência
- Design responsivo mobile-first

## Padrões de Código
- Use sempre `const` e `let` ao invés de `var`
- Prefira arrow functions quando apropriado
- Use template literals para strings dinâmicas
- Implemente tratamento de erros adequado
- Mantenha funções pequenas e com responsabilidade única
- Use comentários JSDoc para funções importantes

## Estilo e Design
- Cores principais: preto (#000000), cinza (#333333, #666666), branco (#ffffff)
- Fonte: Inter (Google Fonts)
- Border radius: 12px para cards, 8px para elementos menores
- Spacing baseado em múltiplos de 8px (8px, 16px, 24px, 32px, 48px)
- Animações suaves com transition: all 0.3s ease
- Mobile-first approach com breakpoints em 480px e 768px

## Funcionalidades
- Adicionar presentes com título, imagem e link
- Validação de URLs e imagens
- Persistência local com localStorage
- Interface responsiva e acessível
- Estados de loading e feedback visual
- Remoção de itens com confirmação

## Boas Práticas de Acessibilidade
- Sempre incluir alt text em imagens
- Focus states visíveis
- Navegação por teclado (ESC para fechar modal)
- Contraste adequado entre cores
- Labels apropriados em formulários

## Segurança
- Escape HTML para prevenir XSS
- Validação de URLs
- Sanitização de inputs do usuário
