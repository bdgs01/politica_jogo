/**
 * REPÚBLICA DIGITAL - SIMULADOR POLÍTICO AVANÇADO
 * Script principal do jogo para execução local
 * Inclui: IA adaptativa, salvamento, exportação PDF, sistema de crises
 */

class RepublicaDigital {
    constructor() {
        // Sistema de IA e inteligência avançada
        this.aiSystem = {
            adaptiveDifficulty: 1.0,
            playerBehaviorPattern: { 
                aggressive: 0, 
                conservative: 0, 
                populist: 0, 
                progressive: 0 
            },
            economicCycle: 'stable',
            politicalCrisis: 0,
            internationalTensions: 0
        };
        
        // Política realista
        this.realPolitics = {
            congressApproval: 45,
            mediaHostility: 30,
            economicPressure: 25,
            militaryLoyalty: 80,
            internationalStanding: 60
        };

        // Histórico detalhado
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

    // === INICIALIZAÇÃO ===
    init() {
        Object.values(this.timers || {}).forEach(timer => clearInterval(timer));
        
        this.player = this.getInitialPlayerState();
        this.gameState = 'setup';
        this.timers = { campaign: null, government: null };
        
        this.setupEventListeners();
        this.resetUI();
        this.updateUI();
        this.showScreen('setup');
        this.startAutoSave();
    }

    getInitialPlayerState() {
        return {
            name: '', 
            ideology: '', 
            term: 1, 
            maxTerms: 2,
            startTime: Date.now(),
            stats: {
                days: 90, 
                funds: 40, 
                support: 0, 
                approval: 30,
                coalitions: 1, 
                mediaPresence: 15, 
                debateScore: 0, 
                polls: 25,
                months: 48, 
                economy: 45, 
                social: 40, 
                security: 55, 
                international: 40, 
                environment: 35, 
                democracy: 70,
                popularity: 45, 
                impeachmentRisk: 25, 
                gdp: 100, 
                population: 215
            }
        };
    }

    initPhilosophyTexts() {
        return {
            esquerda: "O Estado deve garantir igualdade social e redistribuição de renda para construir uma sociedade mais justa.",
            centro: "O equilíbrio entre liberdade individual e justiça social é essencial para uma democracia estável.",
            direita: "A livre iniciativa e o mercado são os melhores mecanismos para gerar prosperidade e desenvolvimento."
        };
    }

    // === SISTEMA DE IA AVANÇADA ===
    updateAI() {
        const recentActions = this.gameHistory.actions.slice(-8);
        this.aiSystem.playerBehaviorPattern = {
            aggressive: recentActions.filter(a => a.type === 'aggressive').length,
            conservative: recentActions.filter(a => a.type === 'conservative').length,
            populist: recentActions.filter(a => a.type === 'populist').length,
            progressive: recentActions.filter(a => a.type === 'progressive').length
        };

        // Ciclo econômico dinâmico
        if (Math.random() < 0.15) {
            const cycles = ['recession', 'stable', 'growth'];
            this.aiSystem.economicCycle = cycles[Math.floor(Math.random() * cycles.length)];
        }

        // Ajuste de dificuldade adaptiva
        const performance = this.calculateOverallPerformance();
        if (performance > 75) {
            this.aiSystem.adaptiveDifficulty = Math.min(1.8, this.aiSystem.adaptiveDifficulty + 0.1);
        } else if (performance < 30) {
            this.aiSystem.adaptiveDifficulty = Math.max(0.6, this.aiSystem.adaptiveDifficulty - 0.1);
        }

        // Pressões políticas realistas
        this.realPolitics.congressApproval += (Math.random() - 0.5) * 8;
        this.realPolitics.mediaHostility += (Math.random() - 0.5) * 6;
        this.realPolitics.economicPressure += (Math.random() - 0.5) * 5;

        // Limites realistas
        Object.keys(this.realPolitics).forEach(key => {
            this.realPolitics[key] = Math.max(0, Math.min(100, this.realPolitics[key]));
        });
    }

    calculateOverallPerformance() {
        if (this.gameState === 'campaign') {
            return (this.player.stats.support + this.player.stats.approval) / 2;
        } else {
            const govStats = ['economy', 'social', 'security', 'international', 'environment'];
            return govStats.reduce((sum, stat) => sum + this.player.stats[stat], 0) / govStats.length;
        }
    }

    generateIntelligentCrisis() {
        const pattern = this.aiSystem.playerBehaviorPattern;
        const difficulty = this.aiSystem.adaptiveDifficulty;
        
        const crises = {
            aggressive: [
                {
                    title: "Tensão Diplomática Internacional",
                    description: "Suas políticas agressivas geraram conflito com aliados históricos. Embaixadores são chamados de volta.",
                    choices: [
                        { text: "Manter linha dura", effects: { international: -12, popularity: 8, security: 5 } },
                        { text: "Buscar reconciliação", effects: { international: 8, popularity: -5, democracy: 3 } }
                    ]
                }
            ],
            conservative: [
                {
                    title: "Pressão por Reformas Sociais",
                    description: "Movimentos sociais exigem mudanças mais rápidas. Manifestações crescem nas grandes cidades.",
                    choices: [
                        { text: "Acelerar reformas", effects: { social: 12, economy: -8, popularity: 5 } },
                        { text: "Manter gradualismo", effects: { social: -8, democracy: 8, popularity: -3 } }
                    ]
                }
            ],
            populist: [
                {
                    title: "Alerta Fiscal do FMI",
                    description: "Organismos internacionais alertam sobre gastos excessivos e risco de crise fiscal.",
                    choices: [
                        { text: "Cortar gastos públicos", effects: { economy: 15, social: -20, popularity: -18 } },
                        { text: "Ignorar pressões externas", effects: { economy: -10, popularity: 8, international: -12 } }
                    ]
                }
            ],
            progressive: [
                {
                    title: "Resistência do Setor Privado",
                    description: "Empresários organizam campanha contra políticas ambientais. Ameaçam demissões em massa.",
                    choices: [
                        { text: "Recuar nas políticas", effects: { environment: -15, economy: 10, popularity: -8 } },
                        { text: "Enfrentar pressão empresarial", effects: { environment: 10, economy: -12, democracy: 5 } }
                    ]
                }
            ]
        };

        const dominantPattern = Object.keys(pattern).reduce((a, b) => 
            pattern[a] > pattern[b] ? a : b
        );

        const availableEvents = crises[dominantPattern] || crises.conservative;
        const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        
        // Ajusta intensidade baseada na dificuldade
        if (event && event.choices) {
            event.choices.forEach(choice => {
                Object.keys(choice.effects).forEach(stat => {
                    choice.effects[stat] = Math.round(choice.effects[stat] * difficulty);
                });
            });
        }

        return event;
    }

    // === EVENT LISTENERS ===
    setupEventListeners() {
        const nameInput = document.getElementById('candidate-name');
        const startBtn = document.getElementById('start-game');
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

        ideologyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                ideologyBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.player.ideology = btn.dataset.ideology;
                this.showPhilosophyPreview();
                this.checkSetupComplete();
            });
        });

        // Event listeners para botões de controle
        document.addEventListener('click', (e) => {
            if (e.target.id === 'save-btn') this.manualSave();
            if (e.target.id === 'load-btn') this.loadGame();
            if (e.target.id === 'export-btn') this.exportToPDF();
        });
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
            preview.style.display = 'block';
        }
    }

    resetUI() {
        const nameInput = document.getElementById('candidate-name');
        const ideologyBtns = document.querySelectorAll('.ideology-btn');
        const preview = document.getElementById('philosophy-preview');
        const startBtn = document.getElementById('start-game');

        if (nameInput) nameInput.value = '';
        ideologyBtns.forEach(b => b.classList.remove('selected'));
        if (preview) preview.style.display = 'none';
        if (startBtn) startBtn.disabled = true;
    }

    // === CAMPANHA ===
    startCampaign() {
        this.gameState = 'campaign';
        this.showScreen('campaign');
        this.setupCampaignActions();
        this.startCampaignTimer();
        this.updateUI();
    }

    setupCampaignActions() {
        const economicModifier = this.aiSystem.economicCycle === 'recession' ? 1.4 : 
                               this.aiSystem.economicCycle === 'growth' ? 0.8 : 1.0;
        
        const actions = [
            { 
                id: 'social_media', 
                title: '📱 Campanha Digital Intensiva', 
                description: 'Estratégia massiva em redes sociais com influenciadores digitais e marketing direcionado.',
                costs: { funds: Math.round(10 * economicModifier), days: 4 }, 
                effects: { support: 12, mediaPresence: 18, approval: 6, polls: 8 },
                type: 'populist'
            },
            { 
                id: 'traditional_coalitions', 
                title: '🤝 Articulação Política Ampla',
                description: 'Negociação com partidos, governadores e lideranças para formar coligação forte.',
                costs: { funds: Math.round(22 * economicModifier), days: 9 }, 
                effects: { coalitions: 4, support: 20, approval: 12, polls: 10 },
                type: 'conservative'
            },
            { 
                id: 'grassroots_mobilization', 
                title: '🚶 Mobilização de Base',
                description: 'Campanha porta a porta com militantes, sindicatos e movimentos sociais organizados.',
                costs: { funds: Math.round(7 * economicModifier), days: 11 }, 
                effects: { support: 28, coalitions: 2, approval: 15, polls: 12 },
                type: 'populist'
            },
            { 
                id: 'media_blitz', 
                title: '📺 Ofensiva Midiática',
                description: 'Saturação em TV, rádio e jornais com propaganda em horário nobre.',
                costs: { funds: Math.round(28 * economicModifier), days: 6 }, 
                effects: { approval: 25, mediaPresence: 30, polls: 18, support: 8 },
                type: 'conservative'
            },
            { 
                id: 'debate_preparation', 
                title: '🎙️ Preparação para Debates',
                description: 'Treinamento intensivo com especialistas em comunicação e estratégia.',
                costs: { funds: Math.round(14 * economicModifier), days: 7 }, 
                effects: { debateScore: 35, approval: 18, mediaPresence: 12, polls: 15 },
                type: 'conservative'
            },
            { 
                id: 'negative_campaign', 
                title: '⚔️ Campanha de Oposição',
                description: 'Ataques estratégicos aos adversários e exposição de escândalos.',
                costs: { funds: Math.round(16 * economicModifier), days: 5 }, 
                effects: { support: 15, approval: -6, mediaPresence: 20, polls: 12 },
                type: 'aggressive'
            },
            { 
                id: 'populist_rallies', 
                title: '🔥 Comícios Populistas',
                description: 'Grandes eventos emocionais apelando diretamente ao povo.',
                costs: { funds: Math.round(9 * economicModifier), days: 6 }, 
                effects: { support: 25, approval: 12, polls: 10, coalitions: -1 },
                type: 'populist'
            },
            { 
                id: 'economic_proposals', 
                title: '📊 Plano Econômico Detalhado',
                description: 'Proposta técnica com economistas renomados e projeções detalhadas.',
                costs: { funds: Math.round(16 * economicModifier), days: 8 }, 
                effects: { approval: 22, polls: 20, support: 6, coalitions: 1 },
                type: 'conservative'
            }
        ];

        this.renderActions('campaign-actions', actions, this.executeCampaignAction.bind(this));
    }

    executeCampaignAction(action) {
        if (!this.canAffordAction(action.costs)) {
            this.showNotification("❌ Recursos insuficientes!");
            return;
        }

        this.applyCosts(action.costs);
        this.applyEffects(action.effects);
        
        this.gameHistory.actions.push({
            type: action.type,
            timestamp: Date.now(),
            action: action.id,
            state: 'campaign',
            description: action.title
        });

        this.updateAI();
        this.updateUI();
        this.setupCampaignActions();
        
        // Eventos de crise
        if (Math.random() < 0.35) {
            this.triggerCampaignCrisis();
        }

        this.checkSkipAvailability();
    }

    startCampaignTimer() {
        this.timers.campaign = setInterval(() => {
            if (this.gameState !== 'campaign') {
                clearInterval(this.timers.campaign);
                return;
            }
            
            this.player.stats.days--;
            
            // Flutuação natural nas pesquisas
            this.player.stats.polls += (Math.random() - 0.5) * 3;
            this.player.stats.polls = Math.max(0, Math.min(100, this.player.stats.polls));
            
            if (this.player.stats.days <= 0) {
                this.endCampaign();
            }
            
            this.updateUI();
            this.checkSkipAvailability();
        }, 1500);
    }

    checkSkipAvailability() {
        const skipBtn = document.getElementById('skip-campaign');
        if (skipBtn) {
            const canSkip = (this.player.stats.funds <= 5 && this.player.stats.days > 0) || 
                           this.player.stats.days <= 8;
            skipBtn.style.display = canSkip ? 'block' : 'none';
            if (canSkip) {
                skipBtn.onclick = () => this.skipToElection();
            }
        }
    }

    skipToElection() {
        clearInterval(this.timers.campaign);
        this.player.stats.days = 0;
        this.endCampaign();
    }

    triggerCampaignCrisis() {
        const crises = [
            {
                title: "Vazamento de Conversas Privadas",
                description: "Áudios comprometedores vazam na imprensa. Oposição explora o caso intensamente.",
                choices: [
                    { text: "Pedir desculpas públicas", effects: { approval: -6, polls: -4 } },
                    { text: "Alegar montagem", effects: { approval: -10, support: 6 } },
                    { text: "Ignorar polêmica", effects: { approval: -14, polls: -10 } }
                ]
            },
            {
                title: "Escândalo de Financiamento",
                description: "Principal doador é preso por lavagem de dinheiro. Mídia questiona origem dos recursos.",
                choices: [
                    { text: "Romper imediatamente", effects: { funds: -18, approval: 4, coalitions: -1 } },
                    { text: "Defender inocência", effects: { approval: -18, support: 10 } },
                    { text: "Distanciar-se gradualmente", effects: { approval: -10, funds: -10 } }
                ]
            },
            {
                title: "Crise de Segurança Nacional",
                description: "Atentado terrorista abala o país. População busca liderança experiente.",
                choices: [
                    { text: "Propor medidas drásticas", effects: { support: 18, approval: 12, polls: 15 } },
                    { text: "Criticar governo atual", effects: { support: 10, approval: -4 } },
                    { text: "Pedir união nacional", effects: { approval: 8, coalitions: 1 } }
                ]
            }
        ];

        const crisis = crises[Math.floor(Math.random() * crises.length)];
        this.showCrisisModal(crisis);
    }

    endCampaign() {
        clearInterval(this.timers.campaign);
        
        // Cálculo complexo do resultado eleitoral
        const baseScore = (this.player.stats.support * 0.35) + 
                         (this.player.stats.approval * 0.25) + 
                         (this.player.stats.debateScore * 0.15) + 
                         (this.player.stats.mediaPresence * 0.10) + 
                         (this.player.stats.polls * 0.15);
        
        // Modificadores por contexto econômico
        const economicModifier = this.aiSystem.economicCycle === 'recession' ? -10 : 
                               this.aiSystem.economicCycle === 'growth' ? 6 : 0;
        
        const finalScore = Math.max(0, Math.round(baseScore + economicModifier));
        this.gameHistory.performance.electionScore = finalScore;
        
        // Limiar de vitória ajustável por dificuldade
        const victoryThreshold = 58 + (this.aiSystem.adaptiveDifficulty * 5);
        
        if (finalScore >= victoryThreshold) {
            this.showModal(
                "🎉 VITÓRIA ELEITORAL!", 
                `Parabéns, Presidente ${this.player.name}! Com ${finalScore}% dos votos válidos, você conquistou uma vitória histórica. Agora os verdadeiros desafios começam.`, 
                [{ text: "Assumir a Presidência", callback: () => this.startGovernment() }]
            );
        } else {
            this.gameHistory.performance.gameEnded = 'electoral_defeat';
            this.showModal(
                "❌ DERROTA ELEITORAL", 
                `Você obteve ${finalScore}% dos votos válidos, insuficiente para a vitória (necessários ${Math.round(victoryThreshold)}%). A democracia seguirá seu curso.`, 
                [
                    { text: "Exportar Relatório", callback: () => this.exportToPDF() },
                    { text: "Nova Campanha", callback: () => this.init() }
                ]
            );
        }
    }

    // === GOVERNO ===
    startGovernment() {
        this.gameState = 'government';
        this.showScreen('government');
        this.setupGovernmentActions();
        this.startGovernmentTimer();
        this.updateUI();

        // Herança da campanha
        const campaignImpact = this.player.stats.approval / 12;
        this.realPolitics.congressApproval += campaignImpact;
        this.realPolitics.mediaHostility = Math.max(20, this.realPolitics.mediaHostility - campaignImpact / 2);
    }

    setupGovernmentActions() {
        const congressFactor = Math.max(0.3, this.realPolitics.congressApproval / 100);
        
        const actions = [
            { 
                id: 'tax_reform', 
                title: '💰 Reforma Tributária Estrutural',
                description: 'Reformulação completa do sistema tributário com simplificação e progressividade.',
                costs: { months: Math.round(10 / congressFactor) }, 
                effects: { economy: 18, social: -6, democracy: -4, popularity: -8 },
                type: 'conservative',
                difficulty: 'extreme'
            },
            { 
                id: 'universal_income', 
                title: '👥 Programa de Renda Universal',
                description: 'Renda básica para todos os brasileiros financiada por taxação de grandes fortunas.',
                costs: { months: Math.round(9 / congressFactor) }, 
                effects: { social: 30, economy: -12, democracy: 6, popularity: 18, gdp: -4 },
                type: 'progressive',
                difficulty: 'extreme'
            },
            { 
                id: 'security_operation', 
                title: '🚔 Operação Nacional de Segurança',
                description: 'Forças federais contra organizações criminosas em todo território nacional.',
                costs: { months: 5 }, 
                effects: { security: 22, democracy: -10, social: -6, popularity: 12 },
                type: 'aggressive',
                difficulty: 'hard'
            },
            { 
                id: 'environmental_protection', 
                title: '🌱 Proteção Ambiental Radical',
                description: 'Programa massivo de proteção com militarização da Amazônia.',
                costs: { months: 7 }, 
                effects: { environment: 35, economy: -18, international: 20, popularity: -12, gdp: -6 },
                type: 'progressive',
                difficulty: 'extreme'
            },
            { 
                id: 'diplomatic_offensive', 
                title: '🌍 Ofensiva Diplomática',
                description: 'Reposicionamento geopolítico com novos blocos econômicos e parcerias.',
                costs: { months: 4 }, 
                effects: { international: 25, economy: 6, security: -3, democracy: 2 },
                type: 'conservative',
                difficulty: 'hard'
            },
            { 
                id: 'constitutional_reform', 
                title: '📜 Reforma Constitucional',
                description: 'Mudanças estruturais na Constituição para ampliar poderes presidenciais.',
                costs: { months: 14 }, 
                effects: { democracy: -22, economy: 12, security: 8, popularity: -18 },
                type: 'aggressive',
                difficulty: 'extreme'
            },
            { 
                id: 'infrastructure_program', 
                title: '🏗️ Mega Programa de Infraestrutura',
                description: 'Investimento trilionário em ferrovias, portos e cidades inteligentes.',
                costs: { months: 16 }, 
                effects: { economy: 22, social: 12, environment: -10, popularity: 15, gdp: 10 },
                type: 'populist',
                difficulty: 'hard'
            },
            { 
                id: 'education_revolution', 
                title: '🎓 Revolução da Educação',
                description: 'Transformação do ensino público com tecnologia e tempo integral.',
                costs: { months: 11 }, 
                effects: { social: 25, economy: 8, democracy: 10, popularity: 10, gdp: 4 },
                type: 'progressive',
                difficulty: 'hard'
            }
        ];

        this.renderActions('government-actions', actions, this.executeGovernmentAction.bind(this));
    }

    executeGovernmentAction(action) {
        if (!this.canAffordAction(action.costs)) {
            this.showNotification("❌ Tempo insuficiente para esta política!");
            return;
        }

        this.applyCosts(action.costs);
        this.applyEffects(action.effects);
        
        this.gameHistory.actions.push({
            type: action.type,
            timestamp: Date.now(),
            action: action.id,
            state: 'government',
            description: action.title,
            difficulty: action.difficulty
        });

        // Impacto político realista
        this.realPolitics.congressApproval += (Math.random() - 0.5) * 8;
        this.realPolitics.mediaHostility += (Math.random() - 0.5) * 6;

        this.calculateGovernmentMetrics();
        this.updateAI();
        this.updateUI();
        this.setupGovernmentActions();
        
        // Crises frequentes no governo
        if (Math.random() < 0.4) {
            this.triggerGovernmentCrisis();
        }

        this.checkGovernmentSkip();
    }

    checkGovernmentSkip() {
        const skipBtn = document.getElementById('skip-government');
        if (skipBtn) {
            const canSkip = this.player.stats.months <= 6;
            skipBtn.style.display = canSkip ? 'block' : 'none';
            if (canSkip) {
                skipBtn.onclick = () => this.skipToEndTerm();
            }
        }
    }

    skipToEndTerm() {
        clearInterval(this.timers.government);
        this.player.stats.months = 0;
        this.endTerm();
    }

    startGovernmentTimer() {
        this.timers.government = setInterval(() => {
            if (this.gameState !== 'government') {
                clearInterval(this.timers.government);
                return;
            }
            
            this.player.stats.months--;
            
            // Degradação natural baseada no contexto
            const degradationFactor = this.aiSystem.adaptiveDifficulty;
            const economicCycleFactor = this.aiSystem.economicCycle === 'recession' ? 1.4 : 
                                       this.aiSystem.economicCycle === 'growth' ? 0.7 : 1.0;
            
            ['economy', 'social', 'security', 'international', 'environment'].forEach(stat => {
                const decay = Math.random() * 1.8 * degradationFactor * economicCycleFactor;
                this.player.stats[stat] = Math.max(0, this.player.stats[stat] - decay);
            });

            // Erosão democrática gradual
            this.player.stats.democracy -= Math.random() * 0.4;
            this.player.stats.democracy = Math.max(15, this.player.stats.democracy);

            this.calculateGovernmentMetrics();
            this.updateUI();
            this.checkGovernmentSkip();
            
            if (this.player.stats.months <= 0) {
                this.endTerm();
            }
        }, 2200);
    }

    calculateGovernmentMetrics() {
        const { economy, social, security, environment, democracy } = this.player.stats;
        
        // Fórmula complexa de popularidade
        const performanceWeight = (economy * 0.25) + (social * 0.25) + (security * 0.20) + (environment * 0.15) + (democracy * 0.15);
        const congressWeight = (this.realPolitics.congressApproval / 100) * 25;
        const mediaWeight = ((100 - this.realPolitics.mediaHostility) / 100) * 15;
        
        this.player.stats.popularity = Math.round(
            (performanceWeight * 0.5) + congressWeight + mediaWeight + (this.player.stats.popularity * 0.3)
        );
        this.player.stats.popularity = Math.max(0, Math.min(100, this.player.stats.popularity));

        // Cálculo sofisticado do risco de impeachment
        const democraticHealth = democracy;
        const popularSupport = this.player.stats.popularity;
        const congressSupport = this.realPolitics.congressApproval;
        const mediaSupport = 100 - this.realPolitics.mediaHostility;
        
        this.player.stats.impeachmentRisk = Math.max(0, Math.min(100, 
            100 - ((democraticHealth * 0.3) + (popularSupport * 0.3) + (congressSupport * 0.25) + (mediaSupport * 0.15))
        ));

        // Triggers automáticos
        if (this.player.stats.impeachmentRisk >= 82 && this.player.stats.popularity <= 18) {
            this.triggerImpeachment();
        }

        if (this.player.stats.economy <= 18 && Math.random() < 0.25) {
            this.triggerEconomicCollapse();
        }

        if (this.player.stats.democracy <= 25 && Math.random() < 0.18) {
            this.triggerConstitutionalCrisis();
        }
    }

    triggerGovernmentCrisis() {
        const crisis = this.generateIntelligentCrisis();
        this.showCrisisModal(crisis);
    }

    triggerImpeachment() {
        clearInterval(this.timers.government);
        this.gameHistory.performance.gameEnded = 'impeachment';
        
        this.showModal(
            "⚖️ IMPEACHMENT APROVADO", 
            `O Congresso Nacional aprovou seu impeachment. Você foi afastado definitivamente da Presidência por ${this.player.stats.impeachmentRisk > 90 ? 'crimes de responsabilidade' : 'perda total de governabilidade'}.`, 
            [
                { text: "Analisar Causas (PDF)", callback: () => this.exportToPDF() },
                { text: "Nova Tentativa", callback: () => this.init() }
            ]
        );
    }

    triggerEconomicCollapse() {
        clearInterval(this.timers.government);
        this.gameHistory.performance.gameEnded = 'economic_collapse';
        
        this.showModal(
            "📉 COLAPSO ECONÔMICO", 
            "A economia brasileira entrou em colapso total. Hiperinflação, desemprego em massa e caos social forçaram sua renúncia.", 
            [
                { text: "Relatório da Catástrofe", callback: () => this.exportToPDF() },
                { text: "Recomeçar", callback: () => this.init() }
            ]
        );
    }

    triggerConstitutionalCrisis() {
        clearInterval(this.timers.government);
        this.gameHistory.performance.gameEnded = 'constitutional_crisis';
        
        this.showModal(
            "📜 CRISE CONSTITUCIONAL", 
            "Suas ações minaram as instituições democráticas. STF e Congresso uniram forças para restaurar a ordem constitucional.", 
            [
                { text: "Análise Institucional", callback: () => this.exportToPDF() },
                { text: "Nova Simulação", callback: () => this.init() }
            ]
        );
    }

    endTerm() {
        clearInterval(this.timers.government);
        
        this.gameHistory.performance.finalPopularity = this.player.stats.popularity;
        this.gameHistory.performance.completedTerms = this.player.term;
        
        if (this.player.term >= this.player.maxTerms) {
            this.gameHistory.performance.gameEnded = 'completed_max_terms';
            this.showModal(
                "🏛️ LEGADO PRESIDENCIAL", 
                `Você completou ${this.player.maxTerms} mandatos constitucionais. Seu legado está definido pelas reformas e ações implementadas.`, 
                [
                    { text: "Relatório Final", callback: () => this.exportToPDF() },
                    { text: "Nova Era", callback: () => this.init() }
                ]
            );
        } else if (this.player.stats.popularity >= 58 && this.realPolitics.congressApproval >= 45) {
            this.showModal(
                "🗳️ OPORTUNIDADE DE REELEIÇÃO", 
                `Com ${Math.round(this.player.stats.popularity)}% de aprovação e ${Math.round(this.realPolitics.congressApproval)}% de apoio no Congresso, sua reeleição é viável.`, 
                [
                    { text: "Disputar Reeleição", callback: () => this.startReelection() },
                    { text: "Retirar-se da Política", callback: () => this.showFinalResults() }
                ]
            );
        } else {
            this.gameHistory.performance.gameEnded = 'term_completed_low_approval';
            this.showModal(
                "📊 FIM DE MANDATO", 
                `Com ${Math.round(this.player.stats.popularity)}% de aprovação, sua reeleição é politicamente inviável.`, 
                [
                    { text: "Balanço Final", callback: () => this.exportToPDF() },
                    { text: "Novo Desafio", callback: () => this.init() }
                ]
            );
        }
    }

    startReelection() {
        this.player.term++;
        this.player.stats.days = 90;
        this.player.stats.funds = Math.max(25, Math.round(this.player.stats.popularity * 0.6));
        this.player.stats.support = Math.round(this.player.stats.popularity * 0.35);
        this.player.stats.approval = Math.round(this.player.stats.popularity * 0.75);
        this.player.stats.polls = Math.round(this.player.stats.popularity * 0.8);
        this.player.stats.months = 48;
        
        // Reset para nova campanha
        this.player.stats.coalitions = 1;
        this.player.stats.mediaPresence = 18;
        this.player.stats.debateScore = 0;
        
        this.startCampaign();
    }

    showFinalResults() {
        const govStats = ['economy', 'social', 'security', 'international', 'environment'];
        const avgPerf = govStats.reduce((sum, stat) => sum + this.player.stats[stat], 0) / govStats.length;
        
        let evaluation = "Governo Problemático 📉";
        if (avgPerf >= 75) evaluation = "Presidente Excepcional 🏆";
        else if (avgPerf >= 60) evaluation = "Presidente Competente 🌟";
        else if (avgPerf >= 45) evaluation = "Presidente Regular 👍";
        else if (avgPerf >= 30) evaluation = "Presidente Fraco 😐";

        this.gameHistory.performance.finalEvaluation = evaluation;
        this.gameHistory.performance.avgPerformance = Math.round(avgPerf);

        this.showModal(
            "📊 LEGADO PRESIDENCIAL", 
            `<strong>${evaluation}</strong><br><br>
             Performance Média: ${Math.round(avgPerf)}%<br>
             Mandatos: ${this.player.term}<br>
             Aprovação Final: ${Math.round(this.player.stats.popularity)}%<br>
             Tempo Total: ${this.formatPlayTime()}`, 
            [
                { text: "Relatório Completo", callback: () => this.exportToPDF() },
                { text: "Nova Simulação", callback: () => this.init() }
            ]
        );
    }

    formatPlayTime() {
        const totalMs = Date.now() - this.player.startTime;
        const hours = Math.floor(totalMs / 3600000);
        const minutes = Math.floor((totalMs % 3600000) / 60000);
        
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }

    // === SISTEMA DE SALVAMENTO ===
    startAutoSave() {
        setInterval(() => {
            if (this.gameState !== 'setup') {
                this.autoSave();
            }
        }, 45000); // Auto-save silencioso a cada 45 segundos
    }

    autoSave() {
        const saveData = {
            player: this.player,
            gameState: this.gameState,
            gameHistory: this.gameHistory,
            aiSystem: this.aiSystem,
            realPolitics: this.realPolitics,
            saveTime: Date.now()
        };
        
        try {
            localStorage.setItem('republicaDigital_save', JSON.stringify(saveData));
        } catch(e) {
            console.error("Erro no auto-save:", e);
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

            this.showScreen(this.gameState);
            this.updateUI();
            
            if (this.gameState === 'campaign') {
                this.setupCampaignActions();
                this.startCampaignTimer();
            } else if (this.gameState === 'government') {
                this.setupGovernmentActions();
                this.startGovernmentTimer();
            }
            
            this.showNotification("📁 Jogo carregado!");
        } catch(e) {
            console.error("Erro ao carregar:", e);
            this.showNotification("❌ Erro ao carregar jogo!");
        }
    }

    // === EXPORTAÇÃO PDF ROBUSTA ===
    exportToPDF() {
        // Implementação de PDF sem dependências externas
        this.generateSimplePDF();
    }

    generateSimplePDF() {
        try {
            // Verifica se jsPDF está disponível
            if (typeof window.jsPDF !== 'undefined') {
                this.generateAdvancedPDF();
            } else {
                this.generateTextReport();
            }
        } catch (error) {
            console.error('Erro na exportação:', error);
            this.generateTextReport();
        }
    }

    generateAdvancedPDF() {
        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF();
        
        let yPos = 20;
        const margin = 20;
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setTextColor(44, 62, 80);
        doc.text('REPÚBLICA DIGITAL', 105, yPos, { align: 'center' });
        
        yPos += 10;
        doc.setFontSize(14);
        doc.setTextColor(52, 152, 219);
        doc.text('Relatório de Performance Política', 105, yPos, { align: 'center' });
        
        yPos += 20;
        doc.setDrawColor(44, 62, 80);
        doc.line(margin, yPos, 190, yPos);
        
        // Dados do jogador
        yPos += 15;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Candidato: ${this.player.name}`, margin, yPos);
        yPos += 6;
        doc.text(`Ideologia: ${this.player.ideology.toUpperCase()}`, margin, yPos);
        yPos += 6;
        doc.text(`Mandatos: ${this.player.term}/${this.player.maxTerms}`, margin, yPos);
        yPos += 6;
        doc.text(`Tempo de Jogo: ${this.formatPlayTime()}`, margin, yPos);
        
        // Resultados eleitorais
        if (this.gameHistory.performance.electionScore) {
            yPos += 15;
            doc.setFontSize(14);
            doc.text('DESEMPENHO ELEITORAL', margin, yPos);
            yPos += 8;
            doc.setFontSize(12);
            doc.text(`Resultado: ${this.gameHistory.performance.electionScore}%`, margin, yPos);
        }
        
        // Estatísticas de governo
        if (this.gameState === 'government' || this.gameHistory.performance.completedTerms) {
            yPos += 15;
            doc.setFontSize(14);
            doc.text('ÍNDICES DE GOVERNO', margin, yPos);
            yPos += 8;
            doc.setFontSize(12);
            
            const govStats = [
                { label: 'Economia', value: this.player.stats.economy },
                { label: 'Social', value: this.player.stats.social },
                { label: 'Segurança', value: this.player.stats.security },
                { label: 'Internacional', value: this.player.stats.international },
                { label: 'Ambiente', value: this.player.stats.environment },
                { label: 'Democracia', value: this.player.stats.democracy }
            ];
            
            govStats.forEach(stat => {
                doc.text(`${stat.label}: ${Math.round(stat.value)}%`, margin, yPos);
                yPos += 6;
            });
            
            yPos += 8;
            doc.text(`Aprovação Final: ${Math.round(this.player.stats.popularity)}%`, margin, yPos);
            yPos += 6;
            doc.text(`Risco de Impeachment: ${Math.round(this.player.stats.impeachmentRisk)}%`, margin, yPos);
        }
        
        // Principais ações
        if (this.gameHistory.actions.length > 0) {
            yPos += 15;
            if (yPos > 250) { doc.addPage(); yPos = 20; }
            
            doc.setFontSize(14);
            doc.text('PRINCIPAIS DECISÕES', margin, yPos);
            yPos += 8;
            doc.setFontSize(10);
            
            this.gameHistory.actions.slice(-8).forEach(action => {
                if (yPos > 270) { doc.addPage(); yPos = 20; }
                const date = new Date(action.timestamp).toLocaleDateString('pt-BR');
                doc.text(`${date} - ${action.description}`, margin, yPos);
                yPos += 5;
            });
        }
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('República Digital - Simulador Político', 105, 285, { align: 'center' });
        doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 105, 290, { align: 'center' });
        
        // Download
        const fileName = `Relatorio_${this.player.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
        doc.save(fileName);
        
        this.showNotification("✅ PDF exportado!");
    }

    generateTextReport() {
        // Fallback: relatório em texto
        let report = `REPÚBLICA DIGITAL - RELATÓRIO DE PERFORMANCE\n`;
        report += `===========================================\n\n`;
        report += `Candidato: ${this.player.name}\n`;
        report += `Ideologia: ${this.player.ideology}\n`;
        report += `Mandatos: ${this.player.term}/${this.player.maxTerms}\n`;
        report += `Tempo de Jogo: ${this.formatPlayTime()}\n\n`;
        
        if (this.gameHistory.performance.electionScore) {
            report += `RESULTADO ELEITORAL: ${this.gameHistory.performance.electionScore}%\n\n`;
        }
        
        report += `ESTATÍSTICAS FINAIS:\n`;
        report += `Economia: ${Math.round(this.player.stats.economy)}%\n`;
        report += `Social: ${Math.round(this.player.stats.social)}%\n`;
        report += `Segurança: ${Math.round(this.player.stats.security)}%\n`;
        report += `Internacional: ${Math.round(this.player.stats.international)}%\n`;
        report += `Ambiente: ${Math.round(this.player.stats.environment)}%\n`;
        report += `Democracia: ${Math.round(this.player.stats.democracy)}%\n`;
        report += `Aprovação: ${Math.round(this.player.stats.popularity)}%\n\n`;
        
        report += `PRINCIPAIS AÇÕES:\n`;
        this.gameHistory.actions.slice(-5).forEach(action => {
            const date = new Date(action.timestamp).toLocaleDateString('pt-BR');
            report += `${date} - ${action.description}\n`;
        });
        
        // Download como arquivo de texto
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Relatorio_${this.player.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification("📄 Relatório exportado!");
    }

    // === FUNÇÕES DE UI ===
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
                actionDiv.addEventListener('click', () => {
                    callback(action);
                    container.scrollTop = 0;
                });
            }

            const costsText = Object.entries(action.costs)
                .map(([k, v]) => `${this.getResourceSymbol(k)}${v}`)
                .join(' ');
            
            const effectsHTML = Object.entries(action.effects)
                .map(([k, v]) => `<span class="effect ${v > 0 ? 'positive' : 'negative'}">${v > 0 ? '+' : ''}${v} ${this.getStatName(k)}</span>`)
                .join('');

            const difficultyBadge = action.difficulty ? 
                `<div style="background: ${action.difficulty === 'extreme' ? 'var(--danger)' : 'var(--warning)'}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; margin-left: 8px;">${action.difficulty.toUpperCase()}</div>` : '';

            actionDiv.innerHTML = `
                <div class="action-title">
                    <span>${action.title}</span>
                    <div style="display: flex; align-items: center;">
                        <span class="action-cost">${costsText}</span>
                        ${difficultyBadge}
                    </div>
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
                modal.classList.remove('active');
                if (choice.callback) choice.callback();
            };
            modalChoices.appendChild(btn);
        });
        
        modal.classList.add('active');
    }

    showCrisisModal(crisis) {
        this.showModal(
            crisis.title, 
            crisis.description, 
            crisis.choices.map(choice => ({
                text: choice.text,
                callback: () => {
                    this.applyEffects(choice.effects);
                    this.gameHistory.events.push({
                        event: crisis.title,
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
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    updateUI() {
        const { stats } = this.player;
        const safeSet = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        // Header
        const termDisplay = document.getElementById('term-display');
        if (termDisplay) {
            termDisplay.textContent = this.gameState === 'government' ? `${this.player.term}º Mandato` : '';
        }

        // Atualização das barras de recursos
        safeSet('days-left', Math.max(0, stats.days));
        safeSet('funds', Math.max(0, stats.funds));
        safeSet('support', Math.max(0, Math.round(stats.support)));
        safeSet('polls', Math.max(0, Math.round(stats.polls || 0)));

        // Stats de campanha
        const campaignStatsEl = document.getElementById('campaign-stats');
        if (campaignStatsEl) {
            campaignStatsEl.innerHTML = `
                <div class="stat-item"><div class="stat-value">${Math.round(stats.approval)}</div><div class="stat-label">Aprovação</div></div>
                <div class="stat-item"><div class="stat-value">${stats.coalitions}</div><div class="stat-label">Coligações</div></div>
                <div class="stat-item"><div class="stat-value">${Math.round(stats.mediaPresence)}</div><div class="stat-label">Mídia</div></div>
                <div class="stat-item"><div class="stat-value">${Math.round(stats.debateScore)}</div><div class="stat-label">Debates</div></div>
            `;
        }

        // Stats de governo
        safeSet('months-left', Math.max(0, stats.months));
        safeSet('gdp', Math.max(0, Math.round(stats.gdp)));
        safeSet('population', '215M');
        
        const governmentStatsEl = document.getElementById('government-stats');
        if (governmentStatsEl) {
            governmentStatsEl.innerHTML = `
                <div class="stat-item"><div class="stat-value">${Math.round(stats.economy)}</div><div class="stat-label">Economia</div></div>
                <div class="stat-item"><div class="stat-value">${Math.round(stats.social)}</div><div class="stat-label">Social</div></div>
                <div class="stat-item"><div class="stat-value">${Math.round(stats.security)}</div><div class="stat-label">Segurança</div></div>
                <div class="stat-item"><div class="stat-value">${Math.round(stats.international)}</div><div class="stat-label">Internacional</div></div>
                <div class="stat-item"><div class="stat-value">${Math.round(stats.environment)}</div><div class="stat-label">Ambiente</div></div>
                <div class="stat-item"><div class="stat-value">${Math.round(stats.democracy)}</div><div class="stat-label">Democracia</div></div>
            `;
        }
        
        // Barras de progresso
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

    // === FUNÇÕES AUXILIARES ===
    applyCosts(costs) {
        Object.entries(costs).forEach(([resource, cost]) => {
            this.player.stats[resource] = Math.max(0, this.player.stats[resource] - cost);
        });
    }

    applyEffects(effects) {
        Object.entries(effects).forEach(([stat, value]) => {
            if (this.player.stats.hasOwnProperty(stat)) {
                this.player.stats[stat] = Math.max(0, Math.min(100, this.player.stats[stat] + value));
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
            polls: 'Pesquisas', gdp: 'PIB', population: 'População'
        };
        return names[stat] || stat;
    }
}

// Inicialização do jogo
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new RepublicaDigital();
});
