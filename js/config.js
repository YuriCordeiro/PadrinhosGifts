// ============================================
// 📊 CONFIGURAÇÃO CENTRAL - GOOGLE SHEETS
// ============================================
// 
// ⚠️  IMPORTANTE: Este é o ÚNICO arquivo que você precisa editar
//     para configurar a integração com Google Sheets!
//
// 📝 Como configurar sua planilha:
//    1. Abra sua planilha no Google Sheets
//    2. Clique em "Compartilhar" (botão azul no canto superior direito)
//    3. Clique em "Alterar para qualquer pessoa com o link"
//    4. Selecione "Visualizador" (apenas leitura é suficiente)
//    5. Copie a URL que aparece no navegador
//    6. O ID está entre /d/ e /edit na URL:
//       https://docs.google.com/spreadsheets/d/[SEU_ID_AQUI]/edit
//
// 🔧 Estrutura da planilha (colunas A, B, C):
//    A: Nome do Presente
//    B: URL do Produto  
//    C: URL da Imagem
//
// ============================================

// Configuração da planilha Google Sheets
const SHEETS_CONFIG = {
    // 🔧 SUBSTITUA pelo ID da sua planilha Google Sheets
    spreadsheetId: '1IYr_m43FUPYilTQz_bICKZjHTPg7CUWVXVlS09N-LJI',
    
    // 🌐 URL automática para exportar como CSV (com proxy CORS)
    get csvUrl() {
        const baseUrl = `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/export?format=csv&gid=0`;
        // Usa proxy CORS para resolver problemas de acesso local
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`;
    },
    
    // 🔗 URL para editar a planilha (NÃO ALTERE)
    get editUrl() {
        return `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/edit`;
    }
};

// ============================================
// 🎯 CONFIGURAÇÕES DA APLICAÇÃO
// ============================================

const APP_CONFIG = {
    // ⏱️ Sincronização automática (em milissegundos)
    syncInterval: 900000,    // 15 minutos = 900000 ms
    
    // 📱 Cache local
    cacheTimeout: 15000,     // 15 segundos = 15000 ms
    
    // 🎨 Configurações de UI
    loadingDelay: 1500,      // 1.5 segundos
    
    // 📋 Nome da aplicação
    appName: 'Lista de Presentes - Padrinhos'
};

// ============================================
// 📝 INSTRUÇÕES DE USO
// ============================================
//
// Para configurar sua planilha:
// 1. Torne a planilha pública (compartilhar > qualquer pessoa com o link)
// 2. Modifique apenas o valor de 'spreadsheetId' acima
// 3. Salve o arquivo
// 4. Recarregue a página
//
// Exemplo:
// spreadsheetId: '1ABC123XYZ789EXEMPLO',
//
// 🚨 IMPORTANTE: A planilha DEVE estar pública para funcionar!
//
// ============================================
