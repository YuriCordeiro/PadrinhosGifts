// Estado da aplicação pública
let gifts = [];
let lastSyncTime = 0;

// Elementos do DOM
const giftsGrid = document.getElementById('giftsGrid');
const emptyState = document.getElementById('emptyState');
const loadingOverlay = document.getElementById('loadingOverlay');
const syncIndicator = document.getElementById('syncIndicator');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializePublicApp);

/**
 * Inicializa a aplicação com carregamento progressivo
 */
async function initializePublicApp() {
    // Esconde loading mais rápido (500ms)
    setTimeout(() => {
        hideLoading();
    }, 500);
    
    // Carrega dados de forma assíncrona sem bloquear a UI
    loadDataProgressively();
    
    // Inicia sincronização automática
    startAutoSync();
}

/**
 * Carrega dados de forma progressiva
 */
async function loadDataProgressively() {
    try {
        // Primeiro, tenta carregar do cache local imediatamente
        const localData = localStorage.getItem('giftsData');
        if (localData) {
            const parsedData = JSON.parse(localData);
            const cachedGifts = parsedData.presentes || [];
            
            if (cachedGifts.length > 0) {
                console.log('Carregando ' + cachedGifts.length + ' itens do cache local...');
                // Renderiza cache progressivamente primeiro
                renderGiftsProgressively(cachedGifts);
                updateEmptyState();
                updateSyncIndicator(true);
            }
        }
        
        // Em paralelo, busca dados atualizados do Google Sheets com renderização progressiva
        const success = await loadDataWithProgressiveRendering();
        
        if (success) {
            updateEmptyState();
            updateSyncIndicator(true);
        } else {
            updateSyncIndicator(false);
        }
        
        // Remove loading overlay após carregamento inicial
        hideLoading();
        
    } catch (error) {
        console.error('Erro no carregamento progressivo:', error);
        hideLoading();
        updateSyncIndicator(false);
    }
}

/**
 * Carrega dados com renderização progressiva item por item
 */
async function loadDataWithProgressiveRendering() {
    try {
        console.log('🔄 Iniciando carregamento progressivo...');
        
        // Limpa lista atual para novo carregamento
        gifts = [];
        giftsGrid.innerHTML = '';
        
        // Tenta carregar usando múltiplos proxies como fallback
        const csvUrls = SHEETS_CONFIG.csvUrls;
        let csvText = null;
        let successUrl = null;
        
        for (let i = 0; i < csvUrls.length; i++) {
            const url = csvUrls[i];
            
            try {
                console.log(`📡 Tentativa ${i + 1}/${csvUrls.length}: ${url.includes('allorigins') ? 'AllOrigins' : url.includes('cors-anywhere') ? 'CORS Anywhere' : url.includes('codetabs') ? 'CodeTabs' : 'Direto'}`);
                
                const response = await fetch(url + '&t=' + new Date().getTime(), {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain, text/csv, */*'
                    }
                });
                
                if (response.ok) {
                    const responseText = await response.text();
                    
                    // Se usar AllOrigins com JSON wrapper, extrai o content
                    if (url.includes('api.allorigins.win/get')) {
                        try {
                            const jsonData = JSON.parse(responseText);
                            csvText = jsonData.contents;
                        } catch (e) {
                            csvText = responseText;
                        }
                    } else {
                        csvText = responseText;
                    }
                    
                    // Verifica se o CSV é válido (tem pelo menos uma linha com dados)
                    if (csvText && csvText.includes(',') && csvText.split('\n').length > 1) {
                        successUrl = url;
                        console.log('✅ Dados carregados com sucesso via:', successUrl.includes('allorigins') ? 'AllOrigins' : url.includes('cors-anywhere') ? 'CORS Anywhere' : url.includes('codetabs') ? 'CodeTabs' : 'Direto');
                        break;
                    }
                }
            } catch (error) {
                console.log(`❌ Falhou com proxy ${i + 1}:`, error.message);
                continue;
            }
        }
        
        if (!csvText) {
            console.error('❌ Todos os proxies CORS falharam');
            return false;
        }
        
        console.log('📋 CSV carregado, iniciando processamento progressivo...');
        
        // Processa e renderiza progressivamente
        const validatedGifts = await parseCSVToGifts(csvText, true); // true = renderizar conforme valida
        
        // Salva no cache após processamento completo
        setTimeout(() => {
            const dataToCache = {
                presentes: gifts,
                lastUpdate: new Date().getTime(),
                source: successUrl
            };
            localStorage.setItem('giftsData', JSON.stringify(dataToCache));
            localStorage.setItem('lastSyncTime', new Date().getTime().toString());
            lastSyncTime = new Date().getTime();
            
            console.log('💾 Dados salvos no cache (' + gifts.length + ' presentes)');
        }, 2000); // Delay para garantir que todos os itens foram processados
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro no carregamento progressivo:', error);
        return false;
    }
}

/**
 * Inicia sincronização automática
 */
function startAutoSync() {
    // Verifica mudanças na planilha a cada 15 minutos
    setInterval(async () => {
        const success = await loadDataWithSync();
        if (success) {
            renderGiftsProgressively(gifts);
            updateEmptyState();
            updateSyncIndicator(true);
        } else {
            updateSyncIndicator(false);
        }
    }, APP_CONFIG.syncInterval);
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
            
            // Se os dados locais são muito recentes (menos de 15 segundos), usa cache
            if (new Date().getTime() - syncTime < APP_CONFIG.cacheTimeout) {
                gifts = parsedData.presentes || [];
                lastSyncTime = syncTime;
                console.log('Dados carregados do cache local (recentes)');
                return true;
            }
        }
        
        // Tenta carregar da planilha Google Sheets com múltiplos proxies
        const csvUrls = SHEETS_CONFIG.csvUrls;
        let csvText = null;
        
        for (let i = 0; i < csvUrls.length; i++) {
            const url = csvUrls[i];
            
            try {
                console.log(`🔄 Sync tentativa ${i + 1}/${csvUrls.length}`);
                
                const response = await fetch(url + '&t=' + new Date().getTime(), {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain, text/csv, */*'
                    }
                });
                
                if (response.ok) {
                    const responseText = await response.text();
                    
                    // Se usar AllOrigins com JSON wrapper, extrai o content
                    if (url.includes('api.allorigins.win/get')) {
                        try {
                            const jsonData = JSON.parse(responseText);
                            csvText = jsonData.contents;
                        } catch (e) {
                            csvText = responseText;
                        }
                    } else {
                        csvText = responseText;
                    }
                    
                    // Verifica se o CSV é válido
                    if (csvText && csvText.includes(',') && csvText.split('\n').length > 1) {
                        break;
                    }
                }
            } catch (error) {
                console.log(`❌ Sync falhou com proxy ${i + 1}`);
                continue;
            }
        }
        
        if (csvText) {
            const parsedGifts = await parseCSVToGifts(csvText);
            
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
 * Converte CSV do Google Sheets para formato de presentes
 * Agora renderiza cada item conforme é validado
 */
async function parseCSVToGifts(csvText, renderAsValidated = false) {
    try {
        const lines = csvText.split('\n');
        const gifts = [];
        const validatedGifts = [];
        
        // Pula a primeira linha (cabeçalho) e processa as demais
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Pula linhas vazias
            
            // Parse simples de CSV (considerando que não há vírgulas nos valores)
            const columns = parseCSVLine(line);
            
            if (columns.length >= 3 && columns[0] && columns[1] && columns[2]) {
                // Gera ID único baseado no título para evitar duplicatas
                const uniqueId = generateUniqueId(columns[0].trim());
                
                const gift = {
                    id: uniqueId,
                    title: columns[0].trim(),
                    productUrl: columns[1].trim(),
                    imageUrl: columns[2].trim(),
                    order: columns[3] ? parseInt(columns[3].trim()) || 999 : 999, // Coluna D para ordem
                    timestamp: new Date().getTime(),
                    createdAt: new Date().toISOString(),
                    source: 'google_sheets'
                };
                
                // Valida URLs básicas
                if (isValidUrl(gift.productUrl) && isValidUrl(gift.imageUrl)) {
                    gifts.push(gift);
                    
                    // Se deve renderizar conforme valida, processa individualmente
                    if (renderAsValidated) {
                        validateAndRenderGift(gift, validatedGifts);
                    }
                } else {
                    console.warn('URLs inválidas na linha ' + (i + 1) + ':', gift);
                }
            }
        }
        
        // Se não está renderizando conforme valida, faz validação em lote
        if (!renderAsValidated) {
            console.log(`Validando ${gifts.length} imagens de produtos...`);
            updateLoadingState('Validando imagens dos produtos...');
            
            const validationPromises = gifts.map(gift =>
                validateImage(gift.imageUrl).then(isValid => ({
                    gift,
                    isValid
                }))
            );
            
            const validationResults = await Promise.all(validationPromises);
            
            // Filtra apenas presentes com imagens válidas
            const validGifts = [];
            validationResults.forEach(result => {
                if (result.isValid) {
                    validGifts.push(result.gift);
                } else {
                    console.warn('Imagem inválida ou não carregou:', result.gift.title, result.gift.imageUrl);
                }
            });
            
            console.log(`${validGifts.length} produtos com imagens válidas carregados de ${validationResults.length} total`);
            
            // Ordena pela coluna "Ordem" (crescente)
            validGifts.sort((a, b) => a.order - b.order);
            
            return validGifts;
        }
        
        // Para renderização progressiva, retorna array vazio inicialmente
        // Os itens serão adicionados conforme validados
        return validatedGifts;
        
        return gifts;
        
    } catch (error) {
        console.error('Erro ao fazer parse do CSV:', error);
        return [];
    }
}

/**
 * Valida e renderiza um presente individual conforme é processado
 */
async function validateAndRenderGift(gift, validatedGifts) {
    try {
        // Adiciona delay progressivo para efeito escalonado
        const delay = validatedGifts.length * 200; // 200ms entre cada item
        
        setTimeout(async () => {
            console.log(`Validando: ${gift.title}...`);
            
            const isValid = await validateImage(gift.imageUrl);
            
            if (isValid) {
                // Adiciona à lista de validados
                validatedGifts.push(gift);
                gifts.push(gift);
                
                // Renderiza o item imediatamente
                renderSingleGift(gift);
                
                console.log(`✅ ${gift.title} - Imagem válida, adicionado à lista`);
                
                // Reordena todos os itens após adicionar novo
                setTimeout(() => reorderAllGifts(), 100);
            } else {
                console.warn(`❌ ${gift.title} - Imagem inválida, ignorado`);
            }
            
            // Atualiza estado da página
            updateEmptyState();
        }, delay);
        
    } catch (error) {
        console.error('Erro ao validar presente:', gift.title, error);
    }
}

/**
 * Renderiza um único presente na página
 */
function renderSingleGift(gift) {
    // Verifica se já existe na página
    const existingCard = giftsGrid.querySelector(`[data-gift-id="${generateUniqueId(gift.title)}"]`);
    if (existingCard) {
        console.log('Item já existe na página:', gift.title);
        return;
    }
    
    const giftCard = createGiftCard(gift);
    
    // Define atributos para identificação e ordenação
    giftCard.setAttribute('data-gift-id', generateUniqueId(gift.title));
    giftCard.setAttribute('data-order', gift.order);
    
    // Adiciona ao final inicialmente (será reordenado depois)
    giftsGrid.appendChild(giftCard);
    
    // Animação de entrada
    giftCard.style.opacity = '0';
    giftCard.style.transform = 'translateY(30px) scale(0.95)';
    giftCard.style.transition = 'all 0.4s ease';
    
    // Trigger da animação
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            giftCard.style.opacity = '1';
            giftCard.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    console.log(`🎁 Renderizado: ${gift.title} (ordem: ${gift.order})`);
}

/**
 * Reordena todos os presentes baseado na coluna "Ordem"
 */
function reorderAllGifts() {
    const cards = Array.from(giftsGrid.children);
    
    // Ordena os cards pela ordem definida
    cards.sort((a, b) => {
        const orderA = parseInt(a.getAttribute('data-order')) || 999;
        const orderB = parseInt(b.getAttribute('data-order')) || 999;
        return orderA - orderB;
    });
    
    // Remove e re-adiciona na ordem correta com animação suave
    cards.forEach((card, index) => {
        card.style.transition = 'all 0.3s ease';
        giftsGrid.appendChild(card);
    });
    
    console.log('🔄 Lista reordenada');
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
 * Gera ID único baseado no título do produto
 */
function generateUniqueId(title) {
    // Remove acentos e caracteres especiais, converte para minúsculo
    const cleanTitle = title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    // Adiciona hash simples do título para garantir unicidade
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        const char = title.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    return `gift-${cleanTitle}-${Math.abs(hash)}`;
}

/**
 * Valida se uma imagem pode ser carregada
 */
function validateImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
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
 * Atualiza o estado de carregamento
 */
function updateLoadingState(message) {
    const loadingText = loadingOverlay?.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = message;
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
 * Renderiza a lista de presentes (apenas visualização)
 */
function renderGifts() {
    giftsGrid.innerHTML = '';
    
    gifts.forEach(gift => {
        const giftCard = createGiftCard(gift);
        // Define ID único para identificação
        giftCard.setAttribute('data-gift-id', generateUniqueId(gift.title));
        giftCard.setAttribute('data-order', gift.order);
        giftsGrid.appendChild(giftCard);
    });
}

/**
 * Renderiza presentes de forma progressiva para melhor performance
 */
function renderGiftsProgressively(giftsList) {
    // Verifica duplicatas - coleta IDs dos presentes já renderizados
    const existingGiftIds = new Set();
    const existingCards = giftsGrid.querySelectorAll('.gift-card');
    existingCards.forEach(card => {
        const giftId = card.getAttribute('data-gift-id');
        if (giftId) {
            existingGiftIds.add(giftId);
        }
    });
    
    // Filtra apenas presentes novos (não duplicados)
    const newGifts = giftsList.filter(gift => {
        const giftId = generateUniqueId(gift.title);
        return !existingGiftIds.has(giftId);
    });
    
    if (newGifts.length === 0) {
        console.log('Nenhum presente novo para renderizar');
        return;
    }
    
    // Renderiza em lotes pequenos para não bloquear a UI
    const batchSize = 3; // 3 itens por vez
    let currentIndex = 0;
    
    function renderBatch() {
        const endIndex = Math.min(currentIndex + batchSize, newGifts.length);
        
        for (let i = currentIndex; i < endIndex; i++) {
            const gift = newGifts[i];
            const giftCard = createGiftCard(gift);
            
            // Define ID único para identificação
            giftCard.setAttribute('data-gift-id', generateUniqueId(gift.title));
            
            // Insere o card na posição correta baseada na ordem
            insertGiftCardInOrder(giftCard, gift.order);
            
            // Adiciona com animação suave
            giftCard.style.opacity = '0';
            giftCard.style.transform = 'translateY(20px)';
            
            // Anima entrada após um pequeno delay
            setTimeout(() => {
                giftCard.style.transition = 'all 0.3s ease';
                giftCard.style.opacity = '1';
                giftCard.style.transform = 'translateY(0)';
            }, i * 100); // Delay escalonado
        }
        
        currentIndex = endIndex;
        
        // Continue renderizando se há mais itens
        if (currentIndex < newGifts.length) {
            setTimeout(renderBatch, 200); // Pequena pausa entre lotes
        }
    }
    
    // Inicia renderização progressiva
    renderBatch();
}

/**
 * Insere um card de presente na posição correta baseada na ordem
 */
function insertGiftCardInOrder(giftCard, order) {
    const existingCards = Array.from(giftsGrid.children);
    
    // Se não há cards existentes, simplesmente adiciona
    if (existingCards.length === 0) {
        giftsGrid.appendChild(giftCard);
        return;
    }
    
    // Encontra a posição correta para inserir baseada na ordem
    let insertPosition = existingCards.length; // Por padrão, adiciona no final
    
    for (let i = 0; i < existingCards.length; i++) {
        const existingCard = existingCards[i];
        const existingOrder = existingCard.getAttribute('data-order');
        
        // Se o card existente tem ordem maior, insere antes dele
        if (existingOrder && parseInt(existingOrder) > order) {
            insertPosition = i;
            break;
        }
    }
    
    // Define a ordem no card para futuras comparações
    giftCard.setAttribute('data-order', order);
    
    // Insere na posição correta
    if (insertPosition >= existingCards.length) {
        giftsGrid.appendChild(giftCard);
    } else {
        giftsGrid.insertBefore(giftCard, existingCards[insertPosition]);
    }
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
            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjAgMTAwTDE2MCA4MEwxNjAgMTIwTDEyMCAxMDBaIiBmaWxsPSIjQ0NDIi8+PC9zdmc+'"
            loading="lazy"
        >
        <div class="gift-content">
            <h3 class="gift-title">${escapeHtml(gift.title)}</h3>
            <div class="gift-actions">
                <a 
                    href="${escapeHtml(gift.productUrl)}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="btn-link btn-link-public"
                    title="Ver produto"
                >
                    Ver Presente
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
    const emptyStateTitle = emptyState.querySelector('h3');
    const emptyStateText = emptyState.querySelector('p');
    
    if (gifts.length === 0) {
        emptyState.classList.remove('hidden');
        giftsGrid.style.display = 'none';
        
        // Atualiza mensagem para indicar carregamento/validação
        emptyStateTitle.textContent = 'Lista sendo preparada com carinho';
        emptyStateText.textContent = 'Estamos carregando e validando as imagens dos produtos. Só exibimos presentes com fotos válidas para garantir a melhor experiência!';
    } else {
        emptyState.classList.add('hidden');
        giftsGrid.style.display = 'grid';
    }
}

/**
 * Atualiza o indicador de sincronização
 */
function updateSyncIndicator(success) {
    if (syncIndicator) {
        const dot = syncIndicator.querySelector('.sync-dot');
        const text = syncIndicator.querySelector('.sync-text');
        
        if (success) {
            dot.style.backgroundColor = '#10b981';
            text.textContent = 'Lista atualizada automaticamente';
        } else {
            dot.style.backgroundColor = '#ef4444';
            text.textContent = 'Erro na sincronização';
        }
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
                const parsedGifts = await parseCSVToGifts(csvText);
                
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
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
} else if (window.location.protocol === 'file:') {
    console.log('Service Worker não pode ser registrado em protocolo file://. Use um servidor HTTP para funcionalidade PWA completa.');
}
