// Estado da aplicação pública
let gifts = [];
let lastSyncTime = 0;

// Elementos do DOM
const giftsGrid = document.getElementById('giftsGrid');
const emptyState = document.getElementById('emptyState');
const loadingOverlay = document.getElementById('loadingOverlay');
const syncIndicator = document.getElementById('syncIndicator');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * Inicializa a aplicação
 */
async function initializeApp() {
    // Carrega dados com sincronização
    await loadDataWithSync();
    
    // Simula carregamento por 1.5 segundos
    setTimeout(() => {
        renderGifts();
        updateEmptyState();
        hideLoading();
    }, 1500);
    
    // Inicia sincronização automática
    startAutoSync();
}

/**
 * Inicia sincronização automática
 */
function startAutoSync() {
    // Verifica mudanças na planilha a cada 15 minutos
    setInterval(async () => {
        const success = await loadDataWithSync();
        if (success) {
            renderGifts();
            updateEmptyState();
            updateSyncIndicator(true);
        } else {
            updateSyncIndicator(false);
        }
    }, APP_CONFIG.syncInterval); // Sincronização configurável
}

/**
 * Carrega dados com sincronização automática do Google Sheets
 */
async function loadDataWithSync() {
    try {
        // Primeiro, tenta carregar dados locais mais recentes
        const localData = localStorage.getItem('giftsData');
        const localSyncTime = localStorage.getItem('lastSyncTime');
        
        if (localData && localSyncTime) {
            const parsedData = JSON.parse(localData);
            const syncTime = parseInt(localSyncTime);
            
            // Se os dados locais são muito recentes (menos de 5 minutos), usa cache
            if (new Date().getTime() - syncTime < 300000) {
                gifts = parsedData.presentes || [];
                lastSyncTime = syncTime;
                console.log('Dados carregados do cache local (recentes)');
                return true;
            }
        }
        
        // Tenta carregar da planilha Google Sheets
        const response = await fetch(SHEETS_CONFIG.csvUrl + '&t=' + new Date().getTime(), {
            method: 'GET',
            headers: {
                'Accept': 'text/plain, text/csv, */*'
            }
        });
        
        if (response.ok) {
            const csvText = await response.text();
            const parsedGifts = parseCSVToGifts(csvText);
            
            if (parsedGifts.length > 0) {
                gifts = parsedGifts;
                
                // Salva no cache local
                const dataToCache = {
                    presentes: gifts,
                    lastUpdate: new Date().getTime()
                };
                localStorage.setItem('giftsData', JSON.stringify(dataToCache));
                localStorage.setItem('lastSyncTime', new Date().getTime().toString());
                lastSyncTime = new Date().getTime();
                
                console.log('Dados carregados do Google Sheets (' + gifts.length + ' presentes)');
                return true;
            }
        }
        
        // Se chegou aqui, tenta usar dados locais como fallback
        if (localData) {
            const parsedData = JSON.parse(localData);
            gifts = parsedData.presentes || [];
            console.log('Usando dados locais como fallback');
            return true;
        }
        
        // Fallback final para dados padrão
        loadFallbackData();
        return false;
        
    } catch (error) {
        console.log('Erro ao carregar dados do Google Sheets:', error);
        
        // Tenta método alternativo
        try {
            const alternativeResult = await tryAlternativeLoad();
            if (alternativeResult) {
                return true;
            }
        } catch (altError) {
            console.log('Método alternativo também falhou:', altError);
        }
        
        // Tenta usar dados locais em caso de erro
        const localData = localStorage.getItem('giftsData');
        if (localData) {
            try {
                const parsedData = JSON.parse(localData);
                gifts = parsedData.presentes || [];
                console.log('Usando dados locais devido a erro');
                return true;
            } catch (e) {
                console.log('Erro ao carregar dados locais também');
            }
        }
        
        loadFallbackData();
        return false;
    }
}

/**
 * Carrega dados de fallback em caso de erro
 */
function loadFallbackData() {
    gifts = [
        {
            id: "001",
            title: "Aparelho de Jantar - Porto Brasil",
            imageUrl: "https://portobrasil.vtexassets.com/arquivos/ids/180018-1200-auto?v=638278773941030000&width=1200&height=auto&aspect=true",
            productUrl: "https://www.portobrasilceramica.com.br/aparelho-de-jantar-30-pecas-organico-preto-matte-para-6-pessoas-b/p",
            timestamp: new Date().getTime(),
            createdAt: new Date().toISOString()
        }
    ];
    
    console.log('Carregados dados de fallback');
}

/**
 * Converte CSV do Google Sheets para formato de presentes
 */
function parseCSVToGifts(csvText) {
    try {
        const lines = csvText.split('\n');
        const gifts = [];
        
        // Pula a primeira linha (cabeçalho) e processa as demais
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Pula linhas vazias
            
            // Parse simples de CSV (considerando que não há vírgulas nos valores)
            const columns = parseCSVLine(line);
            
            if (columns.length >= 3 && columns[0] && columns[1] && columns[2]) {
                const gift = {
                    id: 'sheet_' + i + '_' + Date.now(),
                    title: columns[0].trim(),
                    productUrl: columns[1].trim(),
                    imageUrl: columns[2].trim(),
                    timestamp: new Date().getTime(),
                    createdAt: new Date().toISOString(),
                    source: 'google_sheets'
                };
                
                // Valida URLs básicas
                if (isValidUrl(gift.productUrl) && isValidUrl(gift.imageUrl)) {
                    gifts.push(gift);
                } else {
                    console.warn('URLs inválidas na linha ' + (i + 1) + ':', gift);
                }
            }
        }
        
        return gifts;
        
    } catch (error) {
        console.error('Erro ao fazer parse do CSV:', error);
        return [];
    }
}

/**
 * Parse de linha CSV considerando aspas e vírgulas
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current); // Adiciona o último campo
    return result;
}

/**
 * Verifica se uma URL é válida
 */
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

/**
 * Esconde a animação de loading
 */
function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

/**
 * Atualiza o indicador de sincronização
 */
function updateSyncIndicator(success) {
    if (!syncIndicator) return;
    
    const dot = syncIndicator.querySelector('.sync-dot');
    const text = syncIndicator.querySelector('.sync-text');
    
    if (success) {
        dot.style.backgroundColor = '#10b981'; // Verde
        text.textContent = 'Atualizada há poucos instantes';
    } else {
        dot.style.backgroundColor = '#f59e0b'; // Amarelo
        text.textContent = 'Usando versão em cache';
    }
}

/**
 * Renderiza a lista de presentes
 */
function renderGifts() {
    giftsGrid.innerHTML = '';
    
    gifts.forEach(gift => {
        const giftCard = createGiftCard(gift);
        giftsGrid.appendChild(giftCard);
    });
}

/**
 * Cria um card de presente
 */
function createGiftCard(gift) {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.innerHTML = `
        <img 
            src="${escapeHtml(gift.imageUrl)}" 
            alt="${escapeHtml(gift.title)}" 
            class="gift-image"
            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjAgMTAwTDE2MCA4MEwxNjAgMTIwTDEyMCAxMDBaIiBmaWxsPSIjQ0NDIi8+CjwvZXZnPgo='"
            loading="lazy"
        >
        <div class="gift-content">
            <h3 class="gift-title">${escapeHtml(gift.title)}</h3>
            <div class="gift-actions">
                <a 
                    href="${escapeHtml(gift.productUrl)}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="btn-link"
                    title="Ver produto"
                >
                    Ver Produto
                </a>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Atualiza a visibilidade do estado vazio
 */
function updateEmptyState() {
    if (gifts.length === 0) {
        emptyState.classList.remove('hidden');
        giftsGrid.style.display = 'none';
    } else {
        emptyState.classList.add('hidden');
        giftsGrid.style.display = 'grid';
    }
}

/**
 * Escape HTML para prevenir XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Tenta métodos alternativos para carregar dados do Google Sheets
 */
async function tryAlternativeLoad() {
    const alternativeProxies = [
        // Proxy alternativo 1
        `https://corsproxy.io/?${encodeURIComponent(`https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.spreadsheetId}/export?format=csv&gid=0`)}`,
        // Proxy alternativo 2  
        `https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.spreadsheetId}/export?format=csv&gid=0`,
        // Tentativa direta (pode funcionar em alguns casos)
        `https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.spreadsheetId}/export?format=csv&gid=0`
    ];
    
    for (const proxyUrl of alternativeProxies) {
        try {
            console.log('Tentando proxy alternativo:', proxyUrl);
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain, text/csv, */*'
                }
            });
            
            if (response.ok) {
                const csvText = await response.text();
                const parsedGifts = parseCSVToGifts(csvText);
                
                if (parsedGifts.length > 0) {
                    gifts = parsedGifts;
                    
                    // Salva no cache local
                    const dataToCache = {
                        presentes: gifts,
                        lastUpdate: new Date().getTime()
                    };
                    localStorage.setItem('giftsData', JSON.stringify(dataToCache));
                    localStorage.setItem('lastSyncTime', new Date().getTime().toString());
                    lastSyncTime = new Date().getTime();
                    
                    console.log('Dados carregados via proxy alternativo (' + gifts.length + ' presentes)');
                    return true;
                }
            }
        } catch (error) {
            console.log('Proxy alternativo falhou:', error.message);
            continue; // Tenta o próximo proxy
        }
    }
    
    return false;
}

// Service Worker para cache (funcionalidade PWA básica)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}
