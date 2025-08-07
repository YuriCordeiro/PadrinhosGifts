# 📊 Configuração Google Sheets - Lista de Presentes

## 🎯 Nova Abordagem: Google Sheets

A aplicação agora carrega dados diretamente de uma **planilha do Google Sheets** online! Isso torna o gerenciamento muito mais prático e colaborativo.

## 📋 Como Configurar o Google Sheets

### **1. Criar a Planilha**
1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Nomeie como "Lista de Presentes - Padrinhos"

### **2. Configurar as Colunas**
Configure exatamente estas 3 colunas (na linha 1):

| A | B | C |
|---|---|---|
| **Nome do Produto** | **Link Produto** | **Link Imagem Produto** |

**Exemplo de dados:**
```
A1: Nome do Produto
B1: Link Produto  
C1: Link Imagem Produto

A2: Aparelho de Jantar Porto Brasil
B2: https://www.portobrasilceramica.com.br/aparelho-de-jantar-30-pecas
C2: https://portobrasil.vtexassets.com/arquivos/ids/180018-1200-auto

A3: Batedeira KitchenAid
B3: https://www.kitchenaid.com.br/batedeira-stand-mixer
C3: https://images.unsplash.com/photo-1578662996442-48f60103fc96
```

### **3. Tornar Pública**
1. Clique em **"Compartilhar"** (canto superior direito)
2. Clique em **"Alterar para qualquer pessoa com o link"**
3. Defina permissão como **"Visualizador"**
4. Clique em **"Concluído"**

### **4. Obter o ID da Planilha**
Da URL da sua planilha:
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ789EXEMPLO/edit#gid=0
```
O ID é: `1ABC123XYZ789EXEMPLO`

## ⚙️ Configurar na Aplicação

### **1. Editar script.js**
Abra `js/script.js` e substitua `SEU_ID_AQUI` pelo ID da sua planilha:

```javascript
const SHEETS_CONFIG = {
    spreadsheetId: '1ABC123XYZ789EXEMPLO', // ← Seu ID aqui
    csvUrl: 'https://docs.google.com/spreadsheets/d/1ABC123XYZ789EXEMPLO/export?format=csv&gid=0'
};
```

### **2. Editar public.js**
Abra `js/public.js` e faça a mesma alteração:

```javascript
const SHEETS_CONFIG = {
    spreadsheetId: '1ABC123XYZ789EXEMPLO', // ← Seu ID aqui
    csvUrl: 'https://docs.google.com/spreadsheets/d/1ABC123XYZ789EXEMPLO/export?format=csv&gid=0'
};
```

## 🚀 Como Usar

### **Para Gerenciar Presentes:**
1. **Acesse sua planilha** no Google Sheets
2. **Adicione uma nova linha** com:
   - Nome do produto na coluna A
   - Link do produto na coluna B  
   - Link da imagem na coluna C
3. **A lista atualiza automaticamente** em até 10 segundos!

### **Para Visualizar:**
- **Página Admin**: Sincroniza a cada 10 segundos
- **Página Pública**: Sincroniza a cada 5 segundos  
- **Botão "↻ Sincronizar"**: Força atualização imediata

## ✨ Vantagens do Google Sheets

### ✅ **Facilidade de Uso**
- Interface familiar e intuitiva
- Edição colaborativa (noivo + noiva)
- Acesso de qualquer dispositivo

### ✅ **Sincronização Automática**
- Mudanças aparecem automaticamente no site
- Sem necessidade de uploads ou downloads
- Cache inteligente para performance

### ✅ **Recursos Avançados**
- Validação de dados automática
- Formatação condicional
- Filtros e ordenação
- Histórico de versões

### ✅ **Backup Automático**
- Google Drive salva automaticamente
- Histórico de edições
- Recuperação de dados

## 🔧 Funcionalidades da Interface

### **Página Administrativa:**
- **📊 Gerenciar Planilha**: Link direto para editar
- **↻ Sincronizar Planilha**: Força atualização
- **Indicador verde**: Mostra sincronização ativa

### **Página Pública:**
- **Atualização automática** a cada 5 segundos
- **Visual limpo** sem botões de edição
- **Ícone 📊** indica origem Google Sheets

## 📱 Exemplo Prático

### **Adicionando "Jogo de Panelas":**
1. Abra sua planilha no Google Sheets
2. Na próxima linha vazia, adicione:
   - **A**: Jogo de Panelas Tramontina
   - **B**: https://www.tramontina.com.br/jogo-panelas
   - **C**: https://images.unsplash.com/photo-1556909114-f6e7ad7d3136
3. Em até 10 segundos, aparece no site automaticamente!

## 🔍 Solução de Problemas

### **Lista não carrega:**
1. Verifique se a planilha está pública
2. Confirme se o ID está correto nos arquivos JS
3. Teste o link CSV no navegador

### **URLs inválidas:**
- Use URLs completas (com https://)
- Teste os links antes de adicionar
- Evite vírgulas nos textos

### **Dados antigos:**
- Use o botão "↻ Sincronizar Planilha"
- Aguarde até 10 segundos para atualização automática
- Verifique o console do navegador (F12)

## 🎉 Agora você tem controle total via Google Sheets!

**A lista de presentes nunca foi tão fácil de gerenciar!** ✨
