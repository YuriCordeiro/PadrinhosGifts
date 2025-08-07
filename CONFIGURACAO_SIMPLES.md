# 🎯 Configuração Google Sheets - CENTRAL

## ⚠️ ARQUIVO PRINCIPAL PARA CONFIGURAÇÃO

Para integrar com sua planilha Google Sheets, **edite APENAS** este arquivo:

📄 **`js/config.js`** 

## 📝 Passo a passo:

1. **Abra sua planilha** no Google Sheets
2. **Copie a URL** da barra de endereços
3. **Extraia o ID** da URL:
   ```
   https://docs.google.com/spreadsheets/d/[SEU_ID_AQUI]/edit
                                         ↑ Copie esta parte ↑
   ```
4. **Edite o arquivo** `js/config.js`
5. **Substitua** o valor de `spreadsheetId` pelo seu ID
6. **Salve** e recarregue a página

## ✅ Exemplo:

Se sua URL for:
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ789EXEMPLO/edit
```

No arquivo `js/config.js`, altere:
```javascript
spreadsheetId: '1ABC123XYZ789EXEMPLO',
```

## 📊 Estrutura da Planilha:

Sua planilha deve ter estas colunas na **primeira linha**:
| Título | URL do Produto | URL da Imagem |
|--------|----------------|---------------|
| Nome do presente | Link para comprar | Link da foto |

## 🎉 Pronto!

Agora sua aplicação estará conectada ao Google Sheets e será atualizada automaticamente a cada 15 minutos.
