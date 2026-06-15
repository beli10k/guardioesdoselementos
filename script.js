/* ============================================
   ELEMENTALLY: OS GUARDIÕES DOS CICLOS
   JavaScript - Lógica do Jogo Melhorada
   ============================================ */

// ============================================
// GUARDIÕES E SEUS BÔNUS
// ============================================

const guardians = {
    water: {
        name: 'Guardião da Água',
        type: 'Especialista em Ciclos Hidrológicos',
        icon: '💧',
        color: '#0ea5e9',
        bonuses: {
            waterEfficiency: 1.2,
            waterPurityBonus: 15,
            startingWater: 40
        },
        description: 'Domina a transformação da água entre estados físicos. Especialista em evaporação, condensação e purificação.'
    },
    oxygen: {
        name: 'Guardião do Oxigênio',
        type: 'Especialista em Fotossíntese',
        icon: '🌿',
        color: '#22c55e',
        bonuses: {
            oxygenProduction: 1.25,
            photosynthesisBonus: 20,
            startingPlants: 10
        },
        description: 'Controla a produção de oxigênio através da fotossíntese. Especialista em equilibrar plantas e criaturas.'
    },
    transformation: {
        name: 'Guardião da Transformação',
        type: 'Especialista em Reações Químicas',
        icon: '⚗️',
        color: '#a855f7',
        bonuses: {
            reactionEfficiency: 1.3,
            reactionBonus: 25,
            allReactionsUnlocked: true
        },
        description: 'Domina as reações químicas fundamentais. Especialista em fotossíntese, respiração e decomposição.'
    },
    balance: {
        name: 'Guardião do Equilíbrio',
        type: 'Especialista em Homeostase',
        icon: '⚖️',
        color: '#f59e0b',
        bonuses: {
            balanceBonus: 1.15,
            startingBalance: 50,
            phaseBonus: 30
        },
        description: 'Mantém todos os ciclos em harmonia perfeita. Especialista em equilíbrio ambiental e sustentabilidade.'
    }
};

// ============================================
// GAME STATE
// ============================================

let selectedGuardian = null;

let gameState = {
    // Guardião Selecionado
    guardianType: null,
    
    // Fase e Bioma
    currentPhase: 1,
    currentBiome: 'desert',
    
    // Jogador
    playerLevel: 1,
    score: 0,
    
    // Sistema de Vidas/Tentativas
    lives: 5,
    phaseFails: 0,
    gameOver: false,
    
    // Ciclo da Água
    waterLevel: 30,
    waterPurity: 40,
    waterState: 'liquid',
    
    // Ciclo do Oxigênio
    oxygenLevel: 40,
    co2Level: 60,
    plantCount: 5,
    creatureCount: 8,
    
    // Equilíbrio Ambiental
    environmentalBalance: 35,
    
    // Habilidades
    unlockedAbilities: ['water-state-change'],
    completedChallenges: [],
};

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa o jogo
 */
function init() {
    setupGuardianSelection();
    setupGameEventListeners();
}

/**
 * Configura o sistema de seleção de guardiões
 */
function setupGuardianSelection() {
    const guardianCards = document.querySelectorAll('.guardian-card');
    
    guardianCards.forEach(card => {
        const selectBtn = card.querySelector('.btn-select');
        selectBtn.addEventListener('click', () => {
            const guardianType = card.dataset.guardian;
            selectGuardian(guardianType);
        });
    });
}

/**
 * Seleciona um guardião e inicia o jogo
 */
function selectGuardian(guardianType) {
    selectedGuardian = guardians[guardianType];
    gameState.guardianType = guardianType;
    
    // Aplicar bônus do guardião
    applyGuardianBonuses(guardianType);
    
    // Mostrar tela do jogo
    document.getElementById('guardianSelectionScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    
    // Atualizar interface
    updateGuardianDisplay();
    updateUI();
    startGameLoop();
}

/**
 * Aplica os bônus especiais do guardião selecionado
 */
function applyGuardianBonuses(guardianType) {
    const guardian = guardians[guardianType];
    const bonuses = guardian.bonuses;
    
    switch(guardianType) {
        case 'water':
            gameState.waterLevel = bonuses.startingWater;
            break;
        case 'oxygen':
            gameState.plantCount = bonuses.startingPlants;
            gameState.oxygenLevel = Math.min(100, gameState.oxygenLevel + 10);
            break;
        case 'transformation':
            gameState.unlockedAbilities = [
                'water-state-change',
                'photosynthesis',
                'respiration',
                'decomposition',
                'neutralize'
            ];
            break;
        case 'balance':
            gameState.environmentalBalance = bonuses.startingBalance;
            break;
    }
}

/**
 * Atualiza a exibição do guardião selecionado
 */
function updateGuardianDisplay() {
    const guardianDisplay = document.getElementById('guardianDisplay');
    const guardianIcon = guardianDisplay.querySelector('.guardian-display-icon');
    const guardianName = document.getElementById('guardianName');
    const guardianType = document.getElementById('guardianType');
    
    guardianIcon.textContent = selectedGuardian.icon;
    guardianName.textContent = selectedGuardian.name;
    guardianType.textContent = selectedGuardian.type;
}

/**
 * Configura os event listeners do jogo
 */
function setupGameEventListeners() {
    // Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // Mini tabs (Ciclo da Água)
    const waterStateTabs = document.querySelectorAll('[data-water-state]');
    waterStateTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            waterStateTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            changeWaterState(tab.dataset.waterState);
        });
    });
    
    // Mini tabs (Regras)
    const rulesTabs = document.querySelectorAll('[data-rules-tab]');
    rulesTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.rulesTab;
            rulesTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.mini-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabName).classList.add('active');
        });
    });
    
    // Botões de Ação
    document.getElementById('purifyWaterBtn').addEventListener('click', purifyWater);
    document.getElementById('plantTreeBtn').addEventListener('click', plantTree);
    document.getElementById('addCreatureBtn').addEventListener('click', addCreature);
    document.getElementById('removeCreatureBtn').addEventListener('click', removeCreature);
    document.getElementById('photosynthesisBtn').addEventListener('click', performPhotosynthesis);
    document.getElementById('respirationBtn').addEventListener('click', performRespiration);
    document.getElementById('decompositionBtn').addEventListener('click', performDecomposition);
    document.getElementById('neutralizeBtn').addEventListener('click', neutralizeAcidity);
    document.getElementById('advancePhaseBtn').addEventListener('click', advancePhase);
    
    // Botão Voltar
    document.getElementById('backToSelection').addEventListener('click', backToSelection);
    
    // Botão Pular Fase
    const skipPhaseBtn = document.getElementById('skipPhaseBtn');
    if (skipPhaseBtn) {
        skipPhaseBtn.addEventListener('click', skipPhase);
    }
}

/**
 * Volta para a tela de seleção de guardião
 */
function backToSelection() {
    if (confirm('Deseja realmente voltar? Seu progresso será perdido.')) {
        selectedGuardian = null;
        gameState = {
            guardianType: null,
            currentPhase: 1,
            currentBiome: 'desert',
            playerLevel: 1,
            score: 0,
            lives: 5,
            phaseFails: 0,
            gameOver: false,
            waterLevel: 30,
            waterPurity: 40,
            waterState: 'liquid',
            oxygenLevel: 40,
            co2Level: 60,
            plantCount: 5,
            creatureCount: 8,
            environmentalBalance: 35,
            unlockedAbilities: ['water-state-change'],
            completedChallenges: [],
        };
        
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('guardianSelectionScreen').classList.add('active');
    }
}

/**
 * Troca de abas
 */
function switchTab(tabName) {
    // Remover ativa de todos os botões e conteúdos
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adicionar ativa ao selecionado
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// ============================================
// INICIALIZAÇÃO DO LOOP DO JOGO
// ============================================

let gameLoopInterval = null;

/**
 * Inicia o loop do jogo
 */
function startGameLoop() {
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    
    gameLoopInterval = setInterval(() => {
        tick();
        updateUI();
    }, 1000);
}

// ============================================
// GAME LOOP
// ============================================

/**
 * Atualiza o estado do jogo a cada tick
 */
function tick() {
    // Plantas produzem oxigênio naturalmente
    if (gameState.plantCount > 0) {
        const guardian = guardians[gameState.guardianType];
        const efficiency = guardian?.bonuses?.oxygenProduction || 1;
        const naturalOxygenProduction = gameState.plantCount * 0.5 * efficiency;
        gameState.oxygenLevel = Math.min(100, gameState.oxygenLevel + naturalOxygenProduction);
        gameState.co2Level = Math.max(0, gameState.co2Level - naturalOxygenProduction * 0.8);
    }

    // Criaturas consomem oxigênio naturalmente
    if (gameState.creatureCount > 0) {
        const naturalOxygenConsumption = gameState.creatureCount * 0.3;
        gameState.oxygenLevel = Math.max(0, gameState.oxygenLevel - naturalOxygenConsumption);
        gameState.co2Level = Math.min(100, gameState.co2Level + naturalOxygenConsumption * 0.9);
    }

    // Água evapora naturalmente
    if (gameState.waterLevel > 10) {
        gameState.waterLevel -= 0.5;
    }

    updateEnvironmentalBalance();
}

// ============================================
// CÁLCULOS
// ============================================

/**
 * Calcula o equilíbrio ambiental
 */
function updateEnvironmentalBalance() {
    const waterScore = (gameState.waterLevel + gameState.waterPurity) / 2;
    const oxygenScore = gameState.oxygenLevel;
    const co2Score = 100 - gameState.co2Level;
    const biodiversityScore = Math.min(100, (gameState.plantCount + gameState.creatureCount) * 5);

    let balance = (waterScore * 0.25 + oxygenScore * 0.25 + co2Score * 0.25 + biodiversityScore * 0.25);
    
    // Aplicar bônus do Guardião do Equilíbrio
    if (gameState.guardianType === 'balance') {
        balance *= 1.15;
    }
    
    gameState.environmentalBalance = Math.round(Math.min(100, balance));
}

/**
 * Verifica se o objetivo da fase foi alcançado
 */
function isPhaseObjectiveMet() {
    switch (gameState.currentBiome) {
        case 'desert':
            return gameState.waterLevel > 60 && gameState.waterPurity > 50;
        case 'forest':
            return gameState.oxygenLevel > 70 && gameState.co2Level < 40;
        case 'swamp':
            // FASE 3 FACILITADA: Reduzido de 70% para 60% de pureza
            return gameState.waterPurity > 60 && gameState.environmentalBalance > 50;
        case 'core':
            return gameState.environmentalBalance > 80;
        default:
            return false;
    }
}

// ============================================
// AÇÕES DO JOGO - CICLO DA ÁGUA
// ============================================

/**
 * Muda o estado da água
 */
function changeWaterState(state) {
    const oldState = gameState.waterState;
    gameState.waterState = state;
    
    const guardian = guardians[gameState.guardianType];
    const efficiency = guardian?.bonuses?.waterEfficiency || 1;

    if (oldState === 'liquid' && state === 'gas') {
        gameState.waterLevel = Math.min(100, gameState.waterLevel + 15 * efficiency);
        gameState.score += 10;
    }
    else if (oldState === 'gas' && state === 'liquid') {
        gameState.waterLevel = Math.max(0, gameState.waterLevel - 10);
        // FASE 3 FACILITADA: Neutralização mais eficiente no Pântano
        const purityBonus = (gameState.currentBiome === 'swamp') ? 25 : 20;
        gameState.waterPurity = Math.min(100, gameState.waterPurity + purityBonus * efficiency);
        gameState.score += 15;
    }
    else if (oldState === 'liquid' && state === 'solid') {
        gameState.waterPurity = Math.min(100, gameState.waterPurity + 10 * efficiency);
        gameState.score += 10;
    }
    else if (oldState === 'solid' && state === 'liquid') {
        gameState.waterPurity = Math.max(0, gameState.waterPurity - 5);
        gameState.score += 5;
    }

    updateEnvironmentalBalance();
    updateUI();
}

/**
 * Purifica a água
 */
function purifyWater() {
    const guardian = guardians[gameState.guardianType];
    const bonus = guardian?.bonuses?.waterPurityBonus || 15;
    
    gameState.waterPurity = Math.min(100, gameState.waterPurity + 20 + bonus);
    gameState.score += 40;
    updateEnvironmentalBalance();
    updateUI();
}

// ============================================
// AÇÕES DO JOGO - CICLO DO OXIGÊNIO
// ============================================

/**
 * Planta uma árvore
 */
function plantTree() {
    if (gameState.waterLevel > 20) {
        gameState.plantCount += 1;
        gameState.waterLevel -= 5;
        gameState.score += 20;
        gameState.oxygenLevel = Math.min(100, gameState.oxygenLevel + 8);
        gameState.co2Level = Math.max(0, gameState.co2Level - 10);
        updateEnvironmentalBalance();
        updateUI();
    }
}

/**
 * Adiciona uma criatura
 */
function addCreature() {
    gameState.creatureCount += 1;
    gameState.oxygenLevel = Math.max(0, gameState.oxygenLevel - 5);
    gameState.co2Level = Math.min(100, gameState.co2Level + 8);
    updateEnvironmentalBalance();
    updateUI();
}

/**
 * Remove uma criatura
 */
function removeCreature() {
    if (gameState.creatureCount > 0) {
        gameState.creatureCount -= 1;
        gameState.oxygenLevel = Math.min(100, gameState.oxygenLevel + 5);
        gameState.co2Level = Math.max(0, gameState.co2Level - 8);
        updateEnvironmentalBalance();
        updateUI();
    }
}

// ============================================
// AÇÕES DO JOGO - REAÇÕES QUÍMICAS
// ============================================

/**
 * Fotossíntese
 */
function performPhotosynthesis() {
    const guardian = guardians[gameState.guardianType];
    const efficiency = guardian?.bonuses?.reactionEfficiency || 1;
    const bonus = guardian?.bonuses?.photosynthesisBonus || 0;
    
    const co2Consumed = Math.min(15, gameState.co2Level);
    const waterConsumed = Math.min(10, gameState.waterLevel);

    if (co2Consumed > 5 && waterConsumed > 3 && gameState.plantCount > 0) {
        gameState.co2Level -= co2Consumed;
        gameState.waterLevel -= waterConsumed;
        gameState.oxygenLevel = Math.min(100, gameState.oxygenLevel + co2Consumed * 0.8 * efficiency);
        gameState.score += 30 + bonus;
        updateEnvironmentalBalance();
        updateUI();
    }
}

/**
 * Respiração Celular
 */
function performRespiration() {
    const guardian = guardians[gameState.guardianType];
    const efficiency = guardian?.bonuses?.reactionEfficiency || 1;
    const bonus = guardian?.bonuses?.reactionBonus || 0;
    
    const oxygenConsumed = Math.min(10, gameState.oxygenLevel);

    if (oxygenConsumed > 2 && gameState.creatureCount > 0) {
        gameState.oxygenLevel -= oxygenConsumed;
        gameState.co2Level = Math.min(100, gameState.co2Level + oxygenConsumed * 0.9);
        gameState.score += 10 + bonus;
        updateEnvironmentalBalance();
        updateUI();
    }
}

/**
 * Decomposição
 */
function performDecomposition() {
    const guardian = guardians[gameState.guardianType];
    const efficiency = guardian?.bonuses?.reactionEfficiency || 1;
    const bonus = guardian?.bonuses?.reactionBonus || 0;
    
    if (gameState.plantCount > 0) {
        const decomposedPlants = Math.floor(gameState.plantCount * 0.1);
        gameState.plantCount -= decomposedPlants;
        gameState.co2Level = Math.min(100, gameState.co2Level + decomposedPlants * 5);
        gameState.waterLevel = Math.min(100, gameState.waterLevel + decomposedPlants * 2);
        gameState.score += decomposedPlants * 5 + bonus;
        updateEnvironmentalBalance();
        updateUI();
    }
}

/**
 * Neutraliza a acidez
 */
function neutralizeAcidity() {
    const guardian = guardians[gameState.guardianType];
    const bonus = guardian?.bonuses?.reactionBonus || 0;
    
    // FASE 3 FACILITADA: Neutralização mais potente no Pântano
    const purityIncrease = (gameState.currentBiome === 'swamp') ? 25 : 15;
    gameState.waterPurity = Math.min(100, gameState.waterPurity + purityIncrease);
    gameState.score += 45 + bonus;
    updateEnvironmentalBalance();
    updateUI();
}

// ============================================
// PROGRESSÃO DO JOGO
// ============================================

/**
 * Avança para a próxima fase
 */
function advancePhase() {
    if (isPhaseObjectiveMet()) {
        const nextBiomes = {
            'desert': 'forest',
            'forest': 'swamp',
            'swamp': 'core',
            'core': 'desert'
        };
        
        const guardian = guardians[gameState.guardianType];
        const phaseBonus = guardian?.bonuses?.phaseBonus || 0;
        
        gameState.currentPhase += 1;
        gameState.currentBiome = nextBiomes[gameState.currentBiome];
        gameState.score += phaseBonus + 100;
        gameState.playerLevel = Math.floor(gameState.score / 100) + 1;
        
        // Verificar vitória
        if (gameState.currentPhase > 4) {
            showVictoryScreen();
        }
        
        resetPhase();
        updateUI();
    }
}

/**
 * Pula para a próxima fase (sem completar objetivos)
 */
function skipPhase() {
    const nextBiomes = {
        'desert': 'forest',
        'forest': 'swamp',
        'swamp': 'core',
        'core': 'desert'
    };
    
    if (confirm('💀 Tem certeza que deseja PULAR esta fase?\n\nVocê ganhará apenas 50 pontos.')) {
        gameState.currentPhase += 1;
        gameState.currentBiome = nextBiomes[gameState.currentBiome];
        gameState.score += 50;
        gameState.playerLevel = Math.floor(gameState.score / 100) + 1;
        
        // Verificar vitória
        if (gameState.currentPhase > 4) {
            showVictoryScreen();
        }
        
        resetPhase();
        updateUI();
    }
}

/**
 * Reseta a fase atual
 */
function resetPhase() {
    // Valores iniciais diferentes por fase
    if (gameState.currentBiome === 'swamp') {
        // FASE 3 FACILITADA: Começa com valores melhores
        gameState.waterLevel = 50;          // Aumentado de 30
        gameState.waterPurity = 50;         // Aumentado de 40
        gameState.waterState = 'liquid';
        gameState.oxygenLevel = 50;         // Aumentado de 40
        gameState.co2Level = 50;            // Reduzido de 60
        gameState.plantCount = 8;           // Aumentado de 5
        gameState.creatureCount = 5;        // Reduzido de 8
        gameState.environmentalBalance = 45; // Aumentado de 35
    } else {
        // Outras fases mantêm valores originais
        gameState.waterLevel = 30;
        gameState.waterPurity = 40;
        gameState.waterState = 'liquid';
        gameState.oxygenLevel = 40;
        gameState.co2Level = 60;
        gameState.plantCount = 5;
        gameState.creatureCount = 8;
        gameState.environmentalBalance = 35;
    }
    updateUI();
}

/**
 * Mostra a tela de vitória
 */
function showVictoryScreen() {
    clearInterval(gameLoopInterval);
    
    const victoryHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 3px solid #22c55e; border-radius: 20px; padding: 60px; text-align: center; max-width: 600px; box-shadow: 0 0 40px rgba(34, 197, 94, 0.5);">
                <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 1s infinite;">🎉</div>
                <h1 style="color: #22c55e; font-size: 48px; margin-bottom: 20px; font-weight: bold;">VITÓRIA!</h1>
                <p style="color: #cbd5e1; font-size: 24px; margin-bottom: 30px; line-height: 1.6;">
                    <strong>Parabéns, Guardião!</strong><br/>
                    Você restaurou Elementia com sucesso!
                </p>
                <div style="background: rgba(34, 197, 94, 0.1); border: 2px solid #22c55e; padding: 20px; margin-bottom: 30px; border-radius: 10px;">
                    <p style="color: #86efac; font-size: 18px; margin: 10px 0;">🏆 Estatísticas Finais:</p>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 5px 0;">Fases Completadas: <strong>4</strong></p>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 5px 0;">Pontos Totais: <strong>${gameState.score}</strong></p>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 5px 0;">Guardião: <strong>${selectedGuardian.name}</strong></p>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 5px 0;">Vidas Restantes: <strong>${gameState.lives}</strong></p>
                </div>
                <button onclick="location.reload()" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; border: none; padding: 15px 40px; font-size: 18px; font-weight: bold; border-radius: 10px; cursor: pointer; transition: all 0.3s;">
                    🔄 Jogar Novamente
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', victoryHTML);
}

// ============================================
// ATUALIZAÇÃO DA UI
// ============================================

/**
 * Atualiza toda a interface do usuário
 */
function updateUI() {
    updatePlayerInfo();
    updatePhaseStatus();
    updateEnvironmentalBalance();
    updateWaterCycle();
    updateOxygenCycle();
    updateAbilities();
    updateLivesDisplay();
    checkGameOver();
}

/**
 * Atualiza informações do jogador
 */
function updatePlayerInfo() {
    document.getElementById('playerLevel').textContent = Math.floor(gameState.score / 100) + 1;
    document.getElementById('playerScore').textContent = gameState.score;
    document.getElementById('playerPhase').textContent = gameState.currentPhase;
    
    const biomeNames = {
        'desert': 'Deserto',
        'forest': 'Floresta',
        'swamp': 'Pântano',
        'core': 'Coração de Elementia'
    };
    document.getElementById('playerBiome').textContent = biomeNames[gameState.currentBiome];
}

/**
 * Atualiza a exibição de vidas
 */
function updateLivesDisplay() {
    const livesDisplay = document.getElementById('livesDisplay');
    if (livesDisplay) {
        let livesHTML = '❤️ Vidas: ';
        for (let i = 0; i < gameState.lives; i++) {
            livesHTML += '❤️ ';
        }
        livesDisplay.textContent = livesHTML;
        
        // Mudar cor baseado em vidas restantes
        if (gameState.lives <= 1) {
            livesDisplay.style.color = '#ef4444';
            livesDisplay.style.fontWeight = 'bold';
        } else if (gameState.lives <= 2) {
            livesDisplay.style.color = '#f97316';
        } else {
            livesDisplay.style.color = '#22c55e';
        }
    }
}

/**
 * Verifica se o jogo acabou
 */
function checkGameOver() {
    if (gameState.lives <= 0 && !gameState.gameOver) {
        gameState.gameOver = true;
        showGameOverScreen();
    }
}

/**
 * Mostra a tela de game over
 */
function showGameOverScreen() {
    clearInterval(gameLoopInterval);
    
    const gameOverHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 3px solid #ef4444; border-radius: 20px; padding: 60px; text-align: center; max-width: 600px; box-shadow: 0 0 40px rgba(239, 68, 68, 0.5);">
                <div style="font-size: 80px; margin-bottom: 20px;">💀</div>
                <h1 style="color: #ef4444; font-size: 48px; margin-bottom: 20px; font-weight: bold;">GAME OVER!</h1>
                <p style="color: #cbd5e1; font-size: 24px; margin-bottom: 30px; line-height: 1.6;">
                    <strong>Você perdeu todas as suas vidas!</strong><br/>
                    Elementia não pôde ser restaurada...
                </p>
                <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; padding: 20px; margin-bottom: 30px; border-radius: 10px;">
                    <p style="color: #fca5a5; font-size: 18px; margin: 10px 0;">📊 Estatísticas Finais:</p>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 5px 0;">Fase Alcançada: <strong>${gameState.currentPhase}</strong></p>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 5px 0;">Pontos Totais: <strong>${gameState.score}</strong></p>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 5px 0;">Tentativas Falhadas: <strong>5</strong></p>
                </div>
                <button onclick="location.reload()" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; padding: 15px 40px; font-size: 18px; font-weight: bold; border-radius: 10px; cursor: pointer; transition: all 0.3s;">
                    🔄 Tentar Novamente
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', gameOverHTML);
}

/**
 * Atualiza status da fase
 */
function updatePhaseStatus() {
    const phaseDescriptions = {
        'desert': '🏜️ Você está no Deserto. Restaure o fluxo de água!',
        'forest': '🌲 Você está na Floresta. Equilibre o oxigênio e CO₂!',
        'swamp': '🌿 Você está no Pântano. Neutralize a acidez! (Fase Facilitada)',
        'core': '💎 Você está no Coração de Elementia. Alcance o equilíbrio perfeito!'
    };
    
    const phaseTips = {
        'desert': 'Foque em aumentar o nível de água. Use evaporação para criar nuvens, depois condense para criar chuva.',
        'forest': 'Plante muitas árvores para aumentar a produção de oxigênio. Use fotossíntese para acelerar o processo.',
        'swamp': '✨ FACILITADA: Neutralize 2-3 vezes para aumentar pureza. Plante 2 árvores para aumentar equilíbrio.',
        'core': 'Use todas as habilidades aprendidas para alcançar 80% de equilíbrio ambiental.'
    };
    
    document.getElementById('phaseTitle').textContent = `Fase ${gameState.currentPhase} - Equilíbrio: ${gameState.environmentalBalance}%`;
    document.getElementById('phaseDescription').textContent = phaseDescriptions[gameState.currentBiome];
    document.getElementById('phaseTip').textContent = phaseTips[gameState.currentBiome];

    const advanceBtn = document.getElementById('advancePhaseBtn');
    if (isPhaseObjectiveMet()) {
        advanceBtn.style.display = 'block';
    } else {
        advanceBtn.style.display = 'none';
    }
}

/**
 * Atualiza equilíbrio ambiental
 */
function updateEnvironmentalBalance() {
    const percent = gameState.environmentalBalance;
    document.getElementById('balancePercent').textContent = percent + '%';
    document.getElementById('balanceFill').style.width = percent + '%';
    
    let statusText = '';
    let statusClass = '';
    
    if (percent < 20) {
        statusText = '🔴 Crítico - Ecossistema em colapso!';
        statusClass = 'danger';
    } else if (percent < 40) {
        statusText = '🟠 Ruim - Ecossistema em perigo';
        statusClass = 'warning';
    } else if (percent < 60) {
        statusText = '🟡 Moderado - Ecossistema instável';
        statusClass = 'warning';
    } else if (percent < 80) {
        statusText = '🟢 Bom - Ecossistema saudável';
        statusClass = 'success';
    } else {
        statusText = '🟢 Excelente - Equilíbrio perfeito!';
        statusClass = 'success';
    }
    
    const statusBox = document.querySelector('.status-box');
    statusBox.textContent = statusText;
    statusBox.className = 'status-box ' + statusClass;
}

/**
 * Atualiza ciclo da água
 */
function updateWaterCycle() {
    document.getElementById('waterLevelPercent').textContent = Math.round(gameState.waterLevel) + '%';
    document.getElementById('waterLevelFill').style.width = gameState.waterLevel + '%';
    
    document.getElementById('waterPurityPercent').textContent = Math.round(gameState.waterPurity) + '%';
    document.getElementById('waterPurityFill').style.width = gameState.waterPurity + '%';
    
    const stateEmojis = {
        'solid': '❄️ Sólido',
        'liquid': '💧 Líquido',
        'gas': '☁️ Gasoso'
    };
    document.getElementById('waterState').textContent = stateEmojis[gameState.waterState];
}

/**
 * Atualiza ciclo do oxigênio
 */
function updateOxygenCycle() {
    document.getElementById('oxygenLevelPercent').textContent = Math.round(gameState.oxygenLevel) + '%';
    document.getElementById('oxygenLevelFill').style.width = gameState.oxygenLevel + '%';
    
    document.getElementById('co2LevelPercent').textContent = Math.round(gameState.co2Level) + '%';
    document.getElementById('co2LevelFill').style.width = gameState.co2Level + '%';
    
    document.getElementById('plantCount').textContent = gameState.plantCount;
    document.getElementById('creatureCount').textContent = gameState.creatureCount;
}

/**
 * Atualiza habilidades desbloqueadas
 */
function updateAbilities() {
    const abilitiesList = document.getElementById('abilitiesList');
    abilitiesList.innerHTML = '';
    
    const abilitiesData = {
        'water-state-change': {
            icon: '💧',
            name: 'Transformação de Água',
            desc: 'Mude o estado da água entre sólido, líquido e gasoso'
        },
        'photosynthesis': {
            icon: '🌿',
            name: 'Fotossíntese',
            desc: 'Converta CO₂ em oxigênio através das plantas'
        },
        'respiration': {
            icon: '💨',
            name: 'Respiração Celular',
            desc: 'Simule a respiração das criaturas'
        },
        'decomposition': {
            icon: '🍂',
            name: 'Decomposição',
            desc: 'Decomponha matéria orgânica'
        },
        'neutralize': {
            icon: '🔬',
            name: 'Neutralização',
            desc: 'Neutralize a acidez da água'
        }
    };
    
    gameState.unlockedAbilities.forEach(abilityId => {
        const ability = abilitiesData[abilityId];
        if (ability) {
            const abilityItem = document.createElement('div');
            abilityItem.className = 'ability-item';
            abilityItem.innerHTML = `
                <div class="ability-icon">${ability.icon}</div>
                <div class="ability-info">
                    <p class="ability-name">${ability.name}</p>
                    <p class="ability-desc">${ability.desc}</p>
                </div>
            `;
            abilitiesList.appendChild(abilityItem);
        }
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', init);
