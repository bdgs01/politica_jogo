// República Digital - Script Balanceado com Sistema de Ações
// Tempo apenas para contagem, ações limitadas por fase

class RepublicaDigital {
    constructor() {
        // Sistema de IA equilibrado
        this.aiSystem = {
            adaptiveDifficulty: 1.0, // Dificuldade mediana
            playerBehaviorPattern: { 
                aggressive: 0, 
                conservative: 0, 
                populist: 0, 
                progressive: 0 
            },
            economicCycle: 'stable',
            politicalCrisis: 0
        };
        
        // Política realista mediana
        this.realPolitics = {
            congressApproval: 50,
            mediaHostility: 30,
            economicPressure: 25,
            militaryLoyalty: 75,
            internationalStanding: 60
        };

        // Sistema de contadores
        this.phaseLimits = {
            campaign: 4,    // 4 ações por campanha
            government: 6   // 6 ações por mandato
        };

        this.phaseCounters = {
            campaignActions: 0,
            governmentActions: 0
        };

        this.gameHistory = {
            actions: [],
            events: [],
            decisions: [],
            performance: {},
            crises: []
        };

        this.philosophyTexts = this.initPhilosophyTexts();
        this.init();
    }

    init() {
        // Limpa timers antigos
        Object.values(this.timers || {}).forEach(timer => clearInterval(timer));
        
        this.player = this.getInitialPlayerState();
        this.gameState = 'setup';
        this.timers = { playTime: null }; // Apenas timer de tempo de jogo
        
        // Reset contadores
        this.phaseCounters.campaignActions = 0;
        this.phaseCounters.governmentActions = 0;
        
        this.setupEventListeners();
        this.resetUI();
        this.updateUI();
        this.showScreen('setup');
        this.startPlayTimeCounter();
        this.startAutoSave();
    }

    getInitialPlayerState() {
        return {
            name: '', 
            ideology: '', 
            term: 1, 
            maxTerms: 999, // Mandatos ilimitados
            startTime: Date.now(),
            playTime: 0, // Tempo de jogo em segundos
            stats: {
                // Stats de campanha balanceados
                funds: 100,      // Dinheiro suficiente
                support: 25,     // Apoio inicial
                approval: 45,    // Aprovação inicial
                coalitions: 2,   // Coligações
                mediaPresence: 30,
                debateScore: 0, 
                polls: 40,
                
                // Stats de governo balanceados
                economy: 50,
                social: 50,
                security: 50,
                international: 50,
                environment: 50,
                democracy: 70,
                popularity: 50,
                impeachmentRisk: 20,
                gdp: 100,
                governmentFunds: 200 // Fundos separados para governo
            }
        };
    }

    initPhilosophyTexts() {
        return {
            esquerda: "Foco na justiça social, redistribuição de renda e direitos dos trabalhadores.",
            centro: "Equilíbrio entre liberdade econômica e justiça social, priorizando o diálogo.",
            direita: "Defesa do livre mercado, iniciativa privada e redução do Estado na economia."
        };
    }

    // === CONTADOR DE TEMPO DE JOGO ===
    startPlayTimeCounter() {
        this.timers.playTime = setInterval(() => {
            this.player.playTime++;
            this.updatePlayTimeDisplay();
        }, 1000); // Incrementa a cada segundo
    }

    updatePlayTimeDisplay() {
        const hours = Math.floor(this.player.playTime / 3600);
        const minutes = Math.floor((this.player.playTime % 3600) / 60);
        const seconds = this.player.playTime % 60;
        
        const timeStr = hours > 0 
            ? `${hours}h ${minutes}m ${seconds}s`
            : `${minutes}m ${seconds}s`;
            
        // Atualiza display se existir
        const timeDisplay = document.getElementById('play-time-display');
        if (timeDisplay) {
            timeDisplay.textContent = `Tempo: ${timeStr}`;
        }
    }

    // === SISTEMA DE IA INTELIGENTE ===
    updateAI() {
        const recentActions = this.gameHistory.actions.slice(-6);
        
        // Analisa padrão comportamental
        this.aiSystem.playerBehaviorPattern = {
            aggressive: recentActions.filter(a => a.type === 'aggressive').length,
            conservative: recentActions.filter(a => a.type === 'conservative').length,
            populist: recentActions.filter(a => a.type === 'populist').length,
            progressive: recentActions.filter(a => a.type === 'progressive').length
        };

        // Ajusta contexto político baseado nas ações
        const dominantStyle = Object.keys(this.aiSystem.playerBehaviorPattern)
            .reduce((a, b) => this.aiSystem.playerBehaviorPattern[a] > this.aiSystem.playerBehaviorPattern[b] ? a : b);

        // Reações do ambiente político
        switch(dominantStyle) {
            case 'aggressive':
                this.realPolitics.mediaHostility += 2;
                this.realPolitics.congressApproval -= 1;
                break;
            case 'conservative':
                this.realPolitics.congressApproval += 1;
                this.realPolitics.economicPressure -= 1;
                break;
            case 'populist':
                this.realPolitics.mediaHostility += 1;
                this.player.stats.popularity += 1;
                break;
            case 'progressive':
                this.realPolitics.internationalStanding += 1;
                break;
        }

        // Mantém valores realistas
        Object.keys(this.realPolitics).forEach(key => {
            this.realPolitics[key] = Math.max(10, Math.min(90, this.realPolitics[key]));
        });
    }

    // === EVENT LISTENERS ===
    setupEventListeners() {
        const nameInput = document.getElementById('candidate-name');
        const startBtn = document.getElementById('start-game');
        const loadBtn = document.getElementById('load-game');
        const ideologyBtns = document.querySelectorAll('.ideology-btn');

        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.player.name = e.target.value.trim();
                this.checkSetupComplete();
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startCampaign());
        }

        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.loadGame());
        }

        ideologyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                ideologyBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.player.ideology = btn.dataset.ideology;
                this.showPhilosophyPreview();
                this.checkSetupComplete();
            });
        });

        // Controles do header
        const saveBtn = document.getElementById('save-btn');
        const loadHeaderBtn = document.getElementById('load-btn');
        const exportBtn = document.getElementById('export-btn');

        if (saveBtn) saveBtn.addEventListener('click', () => this.manualSave());
        if (loadHeaderBtn) loadHeaderBtn.addEventListener('click', () => this.loadGame());
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportToPDF());
    }

    checkSetupComplete() {
        const startBtn = document.getElementById('start-game');
        if (startBtn) {
            startBtn.disabled = !this.player.name || !this.player.ideology;
        }
    }

    showPhilosophyPreview() {
        const preview = document.getElementById('philosophy-preview');
        if (preview && this.philosophyTexts[this.player.ideology]) {
            preview.textContent = this.philosophyTexts[this.player.ideology];
            preview.hidden = false;
        }
    }

    resetUI() {
        const nameInput = document.getElementById('candidate-name');
        const ideologyBtns = document.querySelectorAll('.ideology-btn');
        const preview = document.getElementById('philosophy-preview');
        const startBtn = document.getElementById('start-game');

        if (nameInput) nameInput.value = '';
        ideologyBtns.forEach(b => b.classList.remove('selected'));
        if (preview) preview.hidden = true;
        if (startBtn) startBtn.disabled = true;
    }

    // === CAMPANHA COM LIMITE DE AÇÕES ===
    startCampaign() {
        this.gameState = 'campaign';
        this.phaseCounters.campaignActions = 0;
        this.showScreen('campaign');
        this.setupCampaignActions();
        this.updateUI();
        this.updateActionCounter();
    }

    setupCampaignActions() {
        const actions = [
            { 
                id: 'digital_campaign', 
                title: '📱 Campanha Digital', 
                description: 'Estratégia massiva em redes sociais e plataformas digitais.',
                costs: { funds: 25 },
                effects: { support: 15, mediaPresence: 20, approval: 10, polls: 12 },
                type: 'populist'
            },
            { 
                id: 'political_alliances', 
                title: '🤝 Alianças Políticas', 
                description: 'Articulação com partidos e lideranças regionais.',
                costs: { funds: 35 },
                effects: { coalitions: 2, support: 18, approval: 8, polls: 10 },
                type: 'conservative'
            },
            { 
                id: 'grassroots_campaign', 
                title: '🚶 Campanha de Base', 
                description: 'Mobilização direta com eleitores em comunidades.',
                costs: { funds: 20 },
                effects: { support: 25, approval: 12, polls: 15, coalitions: 1 },
                type: 'populist'
            },
            { 
                id: 'media_strategy', 
                title: '📺 Estratégia Midiática', 
                description: 'Presença estratégica em TV, rádio e jornais.',
                costs: { funds: 40 },
                effects: { approval: 20, mediaPresence: 25, polls: 18, support: 8 },
                type: 'conservative'
            },
            { 
                id: 'debate_preparation', 
                title: '🎙️ Preparação para Debates', 
                description: 'Treinamento intensivo com especialistas em comunicação.',
                costs: { funds: 30 },
                effects: { debateScore: 30, approval: 15, mediaPresence: 15, polls: 12 },
                type: 'conservative'
            },
            { 
                id: 'opposition_research', 
                title: '⚔️ Pesquisa Opositiva', 
                description: 'Investigação e exposição de fraquezas dos adversários.',
                costs: { funds: 25 },
                effects: { support: 18, approval: -5, mediaPresence: 15, polls: 10 },
                type: 'aggressive'
            },
            { 
                id: 'popular_rallies', 
                title: '🔥 Comícios Populares', 
                description: 'Grandes eventos para energizar a base eleitoral.',
                costs: { funds: 15 },
                effects: { support: 20, approval: 10, polls: 8 },
                type: 'populist'
            },
            { 
                id: 'policy_platform', 
                title: '📊 Plataforma Política', 
                description: 'Apresentação detalhada de propostas de governo.',
                costs: { funds: 20 },
                effects: { approval: 18, polls: 15, support: 10, coalitions: 1 },
                type: 'conservative'
            }
        ];

        this.renderActions('campaign-actions', actions, this.executeCampaignAction.bind(this));
    }

    executeCampaignAction(action) {
        if (!this.canAffordAction(action.costs)) {
            this.showNotification("Fundos insuficientes!");
            return;
        }

        if (this.phaseCounters.campaignActions >= this.phaseLimits.campaign) {
            this.showNotification("Limite de ações da campanha atingido!");
            return;
        }

        this.applyCosts(action.costs);
        this.applyEffects(action.effects);
        this.phaseCounters.campaignActions++;
        
        this.gameHistory.actions.push({
            type: action.type,
            timestamp: Date.now(),
            action: action.id,
            state: 'campaign',
            description: action.title
        });

        this.updateAI();
        this.updateUI();
        this.updateActionCounter();
        
        // Verifica se atingiu limite
        if (this.phaseCounters.campaignActions >= this.phaseLimits.campaign) {
            this.processCampaignResult();
        } else {
            this.setupCampaignActions();
            
            // Evento ocasional
            if (Math.random() < 0.3) {
                this.triggerCampaignEvent();
            }
        }
    }

    updateActionCounter() {
        let message = '';
        if (this.gameState === 'campaign') {
            const remaining = this.phaseLimits.campaign - this.phaseCounters.campaignActions;
            message = `Ações restantes na campanha: ${remaining}`;
        } else if (this.gameState === 'government') {
            const remaining = this.phaseLimits.government - this.phaseCounters.governmentActions;
            message = `Ações restantes no mandato: ${remaining}`;
        }
        
        // Adiciona contador ao display
        const counterDisplay = document.getElementById('action-counter');
        if (counterDisplay) {
            counterDisplay.textContent = message;
        } else {
            // Cria display se não existir
            const resourcesBar = document.querySelector('.resources-bar');
            if (resourcesBar && message) {
                const counter = document.createElement('span');
                counter.id = 'action-counter';
                counter.style.fontWeight = 'bold';
                counter.style.color = '#f39c12';
                counter.textContent = message;
                resourcesBar.appendChild(counter);
            }
        }
    }

    processCampaignResult() {
        // Cálculo do resultado eleitoral
        const baseScore = (this.player.stats.support * 0.3) + 
                        (this.player.stats.approval * 0.25) + 
                        (this.player.stats.debateScore * 0.15) + 
                        (this.player.stats.mediaPresence * 0.15) + 
                        (this.player.stats.polls * 0.15);
        
        const ideologyBonus = this.getIdeologyBonus();
        const finalScore = Math.max(0, Math.round(baseScore + ideologyBonus));
        
        this.gameHistory.performance.electionScore = finalScore;
        
        // Resultado da eleição (necessário 60% para vencer)
        if (finalScore >= 60) {
            this.showModal(
                "🎉 VITÓRIA ELEITORAL!", 
                `Parabéns, Presidente ${this.player.name}! Você conquistou ${finalScore}% dos votos e foi eleito para o ${this.getOrdinal(this.player.term)} mandato.`, 
                [{ text: "Assumir a Presidência", callback: () => this.startGovernment() }]
            );
        } else {
            if (this.player.term === 1) {
                this.gameHistory.performance.gameEnded = 'electoral_defeat';
                this.showModal(
                    "📊 DERROTA ELEITORAL", 
                    `Você obteve ${finalScore}% dos votos, insuficiente para a vitória. A jornada política termina aqui.`, 
                    [
                        { text: "Nova Campanha", callback: () => this.init() },
                        { text: "Ver Relatório", callback: () => this.exportToPDF() }
                    ]
                );
            } else {
                this.gameHistory.performance.gameEnded = 'reelection_failed';
                this.showModal(
                    "📉 REELEIÇÃO FRACASSADA", 
                    `Você obteve ${finalScore}% dos votos e não conseguiu se reeleger. Seu mandato anterior será seu legado.`, 
                    [
                        { text: "Ver Legado", callback: () => this.exportToPDF() },
                        { text: "Nova Era", callback: () => this.init() }
                    ]
                );
            }
        }
    }

    getIdeologyBonus() {
        // Bônus baseado na ideologia e contexto
        const economicCycle = this.aiSystem.economicCycle;
        const ideology = this.player.ideology;
        
        if (economicCycle === 'recession') {
            return ideology === 'esquerda' ? 5 : ideology === 'centro' ? 3 : 0;
        } else if (economicCycle === 'growth') {
            return ideology === 'direita' ? 5 : ideology === 'centro' ? 3 : 0;
        }
        return ideology === 'centro' ? 3 : 0; // Centro sempre tem pequeno bônus
    }

    getOrdinal(number) {
        if (number === 1) return 'primeiro';
        if (number === 2) return 'segundo';
        if (number === 3) return 'terceiro';
        return `${number}º`;
    }

    // === GOVERNO COM LIMITE DE AÇÕES ===
    startGovernment() {
        this.gameState = 'government';
        this.phaseCounters.governmentActions = 0;
        
        // Restaura fundos do governo
        this.player.stats.funds = this.player.stats.governmentFunds;
        
        this.showScreen('government');
        this.setupGovernmentActions();
        this.updateUI();
        this.updateActionCounter();
    }

    setupGovernmentActions() {
        const actions = [
            { 
                id: 'economic_reform', 
                title: '💰 Reforma Econômica', 
                description: 'Implementar mudanças estruturais na economia.',
                costs: { funds: 40 },
                effects: { 
                    economy: 15, 
                    social: -5, 
                    popularity: -3,
                    governmentFunds: 50 // Gera receita futura
                },
                type: 'conservative'
            },
            { 
                id: 'social_programs', 
                title: '👥 Programas Sociais', 
                description: 'Expandir assistência social e programas de inclusão.',
                costs: { funds: 50 },
                effects: { 
                    social: 20, 
                    economy: -8, 
                    popularity: 12,
                    democracy: 5
                },
                type: 'progressive'
            },
            { 
                id: 'security_operation', 
                title: '🚔 Operação de Segurança', 
                description: 'Reforçar segurança pública e combate ao crime.',
                costs: { funds: 35 },
                effects: { 
                    security: 18, 
                    democracy: -8, 
                    popularity: 8
                },
                type: 'aggressive'
            },
            { 
                id: 'environmental_policy', 
                title: '🌱 Política Ambiental', 
                description: 'Implementar medidas de proteção ambiental.',
                costs: { funds: 45 },
                effects: { 
                    environment: 20, 
                    economy: -10, 
                    international: 15,
                    popularity: -5
                },
                type: 'progressive'
            },
            { 
                id: 'infrastructure', 
                title: '🏗️ Infraestrutura', 
                description: 'Investir em obras e modernização.',
                costs: { funds: 60 },
                effects: { 
                    economy: 15, 
                    social: 10, 
                    popularity: 12,
                    governmentFunds: 30
                },
                type: 'populist'
            },
            { 
                id: 'education_reform', 
                title: '🎓 Reforma Educacional', 
                description: 'Modernizar sistema educacional público.',
                costs: { funds: 40 },
                effects: { 
                    social: 18, 
                    economy: 8, 
                    democracy: 10,
                    popularity: 6
                },
                type: 'progressive'
            },
            { 
                id: 'foreign_relations', 
                title: '🌍 Relações Exteriores', 
                description: 'Fortalecer posição internacional.',
                costs: { funds: 25 },
                effects: { 
                    international: 18, 
                    economy: 5, 
                    democracy: 3
                },
                type: 'conservative'
            },
            { 
                id: 'anti_corruption', 
                title: '⚖️ Combate à Corrupção', 
                description: 'Fortalecer instituições e transparência.',
                costs: { funds: 30 },
                effects: { 
                    democracy: 15, 
                    popularity: 10, 
                    economy: 5
                },
                type: 'conservative'
            }
        ];

        this.renderActions('government-actions', actions, this.executeGovernmentAction.bind(this));
    }

    executeGovernmentAction(action) {
        if (!this.canAffordAction(action.costs)) {
            this.showNotification("Fundos do governo insuficientes!");
            return;
        }

        if (this.phaseCounters.governmentActions >= this.phaseLimits.government) {
            this.showNotification("Limite de ações do mandato atingido!");
            return;
        }

        this.applyCosts(action.costs);
        this.applyEffects(action.effects);
        this.phaseCounters.governmentActions++;
        
        this.gameHistory.actions.push({
            type: action.type,
            timestamp: Date.now(),
            action: action.id,
            state: 'government',
            description: action.title
        });

        this.calculateGovernmentMetrics();
        this.updateAI();
        this.updateUI();
        this.updateActionCounter();
        
        // Verifica se atingiu limite
        if (this.phaseCounters.governmentActions >= this.phaseLimits.government) {
            this.processGovernmentResult();
        } else {
            this.setupGovernmentActions();
            
            // Evento ocasional
            if (Math.random() < 0.25) {
                this.triggerGovernmentEvent();
            }
        }
    }

    calculateGovernmentMetrics() {
        const { economy, social, security, environment, democracy } = this.player.stats;
        
        // Cálculo inteligente da popularidade
        const performanceWeight = (economy * 0.25) + (social * 0.25) + (security * 0.20) + (environment * 0.15) + (democracy * 0.15);
        const congressImpact = (this.realPolitics.congressApproval - 50) * 0.2;
        const mediaImpact = (50 - this.realPolitics.mediaHostility) * 0.15;
        
        this.player.stats.popularity = Math.round(
            (performanceWeight * 0.6) + congressImpact + mediaImpact + (this.player.stats.popularity * 0.4)
        );
        this.player.stats.popularity = Math.max(0, Math.min(100, this.player.stats.popularity));

        // Cálculo do risco de impeachment
        this.player.stats.impeachmentRisk = Math.max(0, Math.min(100, 
            100 - ((democracy * 0.4) + (this.player.stats.popularity * 0.4) + (this.realPolitics.congressApproval * 0.2))
        ));

        // Verificações de fim de jogo por crise
        if (this.player.stats.impeachmentRisk >= 90 && this.player.stats.popularity <= 15) {
            this.triggerImpeachment();
        } else if (this.player.stats.economy <= 15 && this.player.stats.social <= 15) {
            this.triggerEconomicCrisis();
        }
    }

    processGovernmentResult() {
        // Fim do mandato - determina se pode tentar reeleição
        this.player.term++;
        
        if (this.player.stats.popularity >= 55 && this.realPolitics.congressApproval >= 45) {
            this.showModal(
                "🗳️ OPORTUNIDADE DE REELEIÇÃO", 
                `Com ${Math.round(this.player.stats.popularity)}% de aprovação, você pode tentar a reeleição para o ${this.getOrdinal(this.player.term)} mandato.`, 
                [
                    { text: "Disputar Reeleição", callback: () => this.startReelectionCampaign() },
                    { text: "Encerrar Carreira", callback: () => this.showFinalResults() }
                ]
            );
        } else {
            this.showModal(
                "📊 FIM DE MANDATO", 
                `Seu mandato terminou com ${Math.round(this.player.stats.popularity)}% de aprovação. Condições insuficientes para reeleição.`, 
                [
                    { text: "Ver Legado", callback: () => this.showFinalResults() },
                    { text: "Nova Simulação", callback: () => this.init() }
                ]
            );
        }
    }

    startReelectionCampaign() {
        // Herda parte da performance anterior
        this.player.stats.funds = Math.max(60, Math.round(this.player.stats.popularity * 0.8));
        this.player.stats.support = Math.round(this.player.stats.popularity * 0.4);
        this.player.stats.approval = Math.round(this.player.stats.popularity * 0.7);
        this.player.stats.polls = Math.round(this.player.stats.popularity * 0.6);
        
        // Mantém vantagens
        this.player.stats.mediaPresence = 35;
        this.player.stats.debateScore = 15; // Experiência anterior
        
        this.startCampaign();
    }

    // === EVENTOS INTELIGENTES ===
    triggerCampaignEvent() {
        const events = [
            {
                title: "Debate Televisivo",
                description: "Oportunidade de participar de debate em rede nacional.",
                choices: [
                    { text: "Participar ativamente", effects: { debateScore: 15, mediaPresence: 10 } },
                    { text: "Participar cautelosamente", effects: { debateScore: 8, approval: 5 } },
                    { text: "Declinar educadamente", effects: { approval: -3, support: 3 } }
                ]
            },
            {
                title: "Apoio de Celebridade",
                description: "Uma celebridade influente oferece apoio público.",
                choices: [
                    { text: "Aceitar apoio", effects: { mediaPresence: 12, support: 8, funds: -5 } },
                    { text: "Agradecer sem compromisso", effects: { approval: 3 } },
                    { text: "Recusar apoio", effects: { approval: 5, mediaPresence: -3 } }
                ]
            }
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        this.showEventModal(event);
    }

    triggerGovernmentEvent() {
        const events = [
            {
                title: "Crise Econômica Regional",
                description: "Uma região específica enfrenta dificuldades econômicas.",
                choices: [
                    { text: "Enviar auxílio federal", effects: { economy: -5, social: 10, popularity: 8, funds: -20 } },
                    { text: "Propor parcerias privadas", effects: { economy: 5, social: 3, funds: -10 } },
                    { text: "Aguardar recuperação natural", effects: { economy: -3, popularity: -5 } }
                ]
            },
            {
                title: "Tensão Internacional",
                description: "Surgem atritos diplomáticos com país vizinho.",
                choices: [
                    { text: "Buscar mediação", effects: { international: 8, democracy: 5, funds: -15 } },
                    { text: "Manter posição firme", effects: { security: 8, international: -3, popularity: 5 } },
                    { text: "Fazer concessões", effects: { international: 5, popularity: -8, economy: 3 } }
                ]
            }
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        this.showEventModal(event);
    }

    triggerImpeachment() {
        this.gameHistory.performance.gameEnded = 'impeachment';
        this.showModal(
            "⚖️ IMPEACHMENT", 
            "O processo de impeachment foi aprovado. Seu mandato chegou ao fim prematuramente.", 
            [
                { text: "Ver Análise", callback: () => this.exportToPDF() },
                { text: "Nova Tentativa", callback: () => this.init() }
            ]
        );
    }

    triggerEconomicCrisis() {
        this.gameHistory.performance.gameEnded = 'economic_crisis';
        this.showModal(
            "📉 CRISE ECONÔMICA SEVERA", 
            "A situação econômica e social forçou mudanças no governo.", 
            [
                { text: "Analisar Causas", callback: () => this.exportToPDF() },
                { text: "Recomeçar", callback: () => this.init() }
            ]
        );
    }

    showFinalResults() {
        const govStats = ['economy', 'social', 'security', 'international', 'environment'];
        const avgPerf = govStats.reduce((sum, stat) => sum + this.player.stats[stat], 0) / govStats.length;
        
        let evaluation = "Presidente Regular";
        if (avgPerf >= 75) evaluation = "Presidente Excepcional 🏆";
        else if (avgPerf >= 60) evaluation = "Presidente Competente 👍";
        else if (avgPerf >= 45) evaluation = "Presidente Mediano 😐";
        else evaluation = "Presidente com Dificuldades 📉";

        this.gameHistory.performance.finalEvaluation = evaluation;
        this.gameHistory.performance.avgPerformance = Math.round(avgPerf);
        this.gameHistory.performance.totalTerms = this.player.term - 1;

        this.showModal(
            "🏛️ LEGADO PRESIDENCIAL", 
            `<strong>${evaluation}</strong><br><br>
             Mandatos Exercidos: ${this.player.term - 1}<br>
             Performance Média: ${Math.round(avgPerf)}%<br>
             Aprovação Final: ${Math.round(this.player.stats.popularity)}%<br>
             Tempo de Jogo: ${this.formatPlayTime()}`, 
            [
                { text: "Exportar Relatório Completo", callback: () => this.exportToPDF() },
                { text: "Nova Era Política", callback: () => this.init() }
            ]
        );
    }

    formatPlayTime() {
        const hours = Math.floor(this.player.playTime / 3600);
        const minutes = Math.floor((this.player.playTime % 3600) / 60);
        const seconds = this.player.playTime % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else {
            return `${minutes}m ${seconds}s`;
        }
    }

    // === SISTEMA DE EXPORTAÇÃO ===
    exportToPDF() {
        const reportContent = this.generateDetailedReport();
        this.downloadTextReport(reportContent);
    }

    generateDetailedReport() {
        const report = [];
        report.push("═══════════════════════════════════════");
        report.push("    REPÚBLICA DIGITAL - RELATÓRIO OFICIAL");
        report.push("═══════════════════════════════════════");
        report.push("");
        report.push("DADOS DO POLÍTICO:");
        report.push(`• Nome: ${this.player.name}`);
        report.push(`• Ideologia: ${this.player.ideology.toUpperCase()}`);
        report.push(`• Mandatos Exercidos: ${this.player.term - 1}`);
        report.push(`• Tempo de Jogo: ${this.formatPlayTime()}`);
        report.push("");
        
        if (this.gameHistory.performance.electionScore) {
            report.push("DESEMPENHO ELEITORAL:");
            report.push(`• Último Resultado: ${this.gameHistory.performance.electionScore}%`);
            report.push("");
        }
        
        report.push("ESTATÍSTICAS FINAIS:");
        report.push(`• Economia: ${Math.round(this.player.stats.economy)}%`);
        report.push(`• Social: ${Math.round(this.player.stats.social)}%`);
        report.push(`• Segurança: ${Math.round(this.player.stats.security)}%`);
        report.push(`• Internacional: ${Math.round(this.player.stats.international)}%`);
        report.push(`• Ambiente: ${Math.round(this.player.stats.environment)}%`);
        report.push(`• Democracia: ${Math.round(this.player.stats.democracy)}%`);
        report.push(`• Popularidade: ${Math.round(this.player.stats.popularity)}%`);
        report.push("");
        
        report.push("CONTEXTO POLÍTICO:");
        report.push(`• Aprovação no Congresso: ${Math.round(this.realPolitics.congressApproval)}%`);
        report.push(`• Hostilidade da Mídia: ${Math.round(this.realPolitics.mediaHostility)}%`);
        report.push(`• Pressão Econômica: ${Math.round(this.realPolitics.economicPressure)}%`);
        report.push("");
        
        if (this.gameHistory.performance.finalEvaluation) {
            report.push(`AVALIAÇÃO FINAL: ${this.gameHistory.performance.finalEvaluation}`);
            report.push("");
        }
        
        report.push("PRINCIPAIS DECISÕES:");
        this.gameHistory.actions.slice(-10).forEach((action, index) => {
            const date = new Date(action.timestamp).toLocaleDateString('pt-BR');
            report.push(`${index + 1}. ${action.description} (${date})`);
        });
        
        report.push("");
        report.push(`Relatório gerado em: ${new Date().toLocaleString('pt-BR')}`);
        report.push("═══════════════════════════════════════");
        
        return report.join('\n');
    }

    downloadTextReport(content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Relatorio_${this.player.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification("📄 Relatório exportado!");
    }

    // === SALVAMENTO ===
    startAutoSave() {
        setInterval(() => {
            if (this.gameState !== 'setup') {
                this.autoSave();
            }
        }, 45000);
    }

    autoSave() {
        const saveData = {
            player: this.player,
            gameState: this.gameState,
            gameHistory: this.gameHistory,
            aiSystem: this.aiSystem,
            realPolitics: this.realPolitics,
            phaseCounters: this.phaseCounters,
            saveTime: Date.now()
        };
        
        try {
            localStorage.setItem('republicaDigital_save', JSON.stringify(saveData));
        } catch(e) {
            console.warn("Erro no auto-save:", e);
        }
    }

    manualSave() {
        this.autoSave();
        this.showNotification("💾 Jogo salvo!");
    }

    loadGame() {
        try {
            const savedData = localStorage.getItem('republicaDigital_save');
            if (!savedData) {
                this.showNotification("📁 Nenhum jogo salvo encontrado!");
                return;
            }

            const saveData = JSON.parse(savedData);
            this.player = saveData.player || this.getInitialPlayerState();
            this.gameState = saveData.gameState || 'setup';
            this.gameHistory = saveData.gameHistory || { actions: [], events: [], decisions: [], performance: {} };
            this.aiSystem = saveData.aiSystem || this.aiSystem;
            this.realPolitics = saveData.realPolitics || this.realPolitics;
            this.phaseCounters = saveData.phaseCounters || { campaignActions: 0, governmentActions: 0 };

            this.showScreen(this.gameState);
            
            if (this.gameState === 'campaign') {
                this.setupCampaignActions();
            } else if (this.gameState === 'government') {
                this.setupGovernmentActions();
            }
            
            this.updateUI();
            this.updateActionCounter();
            this.showNotification("📁 Jogo carregado!");
        } catch(e) {
            this.showNotification("❌ Erro ao carregar jogo!");
        }
    }

    // === UI FUNCTIONS ===
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add('active');
    }

    renderActions(containerId, actions, callback) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        actions.forEach(action => {
            const canAfford = this.canAffordAction(action.costs);
            const actionDiv = document.createElement('div');
            actionDiv.className = `action-card ${!canAfford ? 'disabled' : ''}`;
            
            if (canAfford) {
                actionDiv.addEventListener('click', () => callback(action));
            }

            const costsText = Object.entries(action.costs)
                .map(([k, v]) => `${this.getResourceSymbol(k)}${v}`)
                .join(' ');
            
            const effectsHTML = Object.entries(action.effects)
                .map(([k, v]) => `<span class="effect ${v > 0 ? 'positive' : 'negative'}">${v > 0 ? '+' : ''}${v} ${this.getStatName(k)}</span>`)
                .join('');

            actionDiv.innerHTML = `
                <div class="action-title">
                    <span>${action.title}</span>
                    <span class="action-cost">${costsText}</span>
                </div>
                <div class="action-description">${action.description}</div>
                <div class="action-effects">${effectsHTML}</div>
            `;
            
            container.appendChild(actionDiv);
        });
    }

    showModal(title, content, choices = []) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalChoices = document.getElementById('modal-choices');
        
        if (!modal) return;
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content.replace(/\n/g, '<br>');
        modalChoices.innerHTML = '';

        if (choices.length === 0) {
            choices.push({ text: "OK", callback: () => {} });
        }

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = choice.text;
            btn.onclick = () => {
                modal.hidden = true;
                if (choice.callback) choice.callback();
            };
            modalChoices.appendChild(btn);
        });
        
        modal.hidden = false;
    }

    showEventModal(event) {
        this.showModal(
            event.title, 
            event.description, 
            event.choices.map(choice => ({
                text: choice.text,
                callback: () => {
                    this.applyEffects(choice.effects);
                    this.gameHistory.events.push({
                        event: event.title,
                        choice: choice.text,
                        timestamp: Date.now()
                    });
                    this.updateUI();
                }
            }))
        );
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3498db;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    updateUI() {
        const { stats } = this.player;
        const safeSet = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        // Atualiza tempo de jogo
        this.updatePlayTimeDisplay();

        // Header
        const termDisplay = document.getElementById('term-display');
        if (termDisplay) {
            termDisplay.textContent = this.gameState === 'government' ? `${this.player.term - 1}º Mandato` : '';
        }

        // Campaign stats
        safeSet('funds', Math.max(0, stats.funds));
        safeSet('support', Math.max(0, Math.round(stats.support)));

        const campaignStatsEl = document.getElementById('campaign-stats');
        if (campaignStatsEl && this.gameState === 'campaign') {
            campaignStatsEl.innerHTML = `
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.approval)}</div>
                    <div class="stat-label">Aprovação</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.coalitions}</div>
                    <div class="stat-label">Coligações</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.mediaPresence)}</div>
                    <div class="stat-label">Mídia</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.polls)}</div>
                    <div class="stat-label">Pesquisas</div>
                </div>
            `;
        }

        // Government stats
        const governmentStatsEl = document.getElementById('government-stats');
        if (governmentStatsEl && this.gameState === 'government') {
            governmentStatsEl.innerHTML = `
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.economy)}</div>
                    <div class="stat-label">Economia</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.social)}</div>
                    <div class="stat-label">Social</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.security)}</div>
                    <div class="stat-label">Segurança</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.international)}</div>
                    <div class="stat-label">Internacional</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.environment)}</div>
                    <div class="stat-label">Ambiente</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.democracy)}</div>
                    <div class="stat-label">Democracia</div>
                </div>
            `;
        }
        
        // Progress bars
        safeSet('popularity-percent', `${Math.round(stats.popularity)}%`);
        const popularityBar = document.getElementById('popularity-bar');
        if (popularityBar) {
            popularityBar.style.width = `${Math.max(0, Math.min(100, stats.popularity))}%`;
        }
        
        safeSet('impeachment-percent', `${Math.round(stats.impeachmentRisk)}%`);
        const impeachmentBar = document.getElementById('impeachment-bar');
        if (impeachmentBar) {
            impeachmentBar.style.width = `${Math.max(0, Math.min(100, stats.impeachmentRisk))}%`;
        }
    }

    // === HELPER FUNCTIONS ===
    applyCosts(costs) {
        Object.entries(costs).forEach(([resource, cost]) => {
            this.player.stats[resource] = Math.max(0, this.player.stats[resource] - cost);
        });
    }

    applyEffects(effects) {
        Object.entries(effects).forEach(([stat, value]) => {
            if (this.player.stats.hasOwnProperty(stat)) {
                if (['funds', 'coalitions', 'governmentFunds'].includes(stat)) {
                    this.player.stats[stat] += value;
                } else {
                    this.player.stats[stat] = Math.max(0, Math.min(100, this.player.stats[stat] + value));
                }
            }
        });
    }

    canAffordAction(costs) {
        return Object.entries(costs).every(([resource, cost]) => 
            this.player.stats[resource] >= cost
        );
    }

    getResourceSymbol(resource) {
        const symbols = { funds: '💰', days: '⏰', months: '🗓️' };
        return symbols[resource] || '';
    }

    getStatName(stat) {
        const names = {
            support: 'Apoio', approval: 'Aprovação', mediaPresence: 'Mídia',
            debateScore: 'Debate', coalitions: 'Coligações', economy: 'Economia',
            social: 'Social', security: 'Segurança', international: 'Internacional',
            environment: 'Ambiente', democracy: 'Democracia', popularity: 'Popularidade',
            polls: 'Pesquisas', gdp: 'PIB', governmentFunds: 'Tesouro'
        };
        return names[stat] || stat;
    }
}

// Inicialização
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new RepublicaDigital();
});
