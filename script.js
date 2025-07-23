// República Digital - Script Principal
// Versão balanceada para melhor experiência de jogo

class RepublicaDigital {
    constructor() {
        // Sistema de IA mais equilibrado
        this.aiSystem = {
            adaptiveDifficulty: 0.8, // Reduzido de 1.2 para 0.8
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
        
        // Política realista mais favorável
        this.realPolitics = {
            congressApproval: 55, // Aumentado de 45 para 55
            mediaHostility: 25,   // Reduzido de 30 para 25
            economicPressure: 20, // Reduzido de 25 para 20
            militaryLoyalty: 85,  // Aumentado de 80 para 85
            internationalStanding: 65 // Aumentado de 60 para 65
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
                // Stats de campanha mais generosos
                days: 90, 
                funds: 60,        // Aumentado de 35 para 60
                support: 15,      // Aumentado de 0 para 15
                approval: 40,     // Aumentado de 25 para 40
                coalitions: 2,    // Aumentado de 1 para 2
                mediaPresence: 25, // Aumentado de 15 para 25
                debateScore: 0, 
                polls: 35,        // Aumentado de 25 para 35
                
                // Stats de governo equilibrados
                months: 48, 
                economy: 55,      // Aumentado de 45 para 55
                social: 50,       // Aumentado de 40 para 50
                security: 60,     // Aumentado de 55 para 60
                international: 50, // Aumentado de 40 para 50
                environment: 45,  // Aumentado de 35 para 45
                democracy: 75,    // Mantido em 75
                popularity: 55,   // Aumentado de 45 para 55
                impeachmentRisk: 15, // Reduzido de 25 para 15
                gdp: 100, 
                population: 215
            }
        };
    }

    initPhilosophyTexts() {
        return {
            esquerda: "Marx analisou as contradições do sistema capitalista e propôs a luta de classes como motor da história.",
            centro: "Rawls desenvolveu o conceito de véu da ignorância para fundamentar uma sociedade justa.",
            direita: "Smith estabeleceu os fundamentos do liberalismo econômico, defendendo a mão invisível do mercado."
        };
    }

    // === SISTEMA DE IA MAIS EQUILIBRADO ===
    updateAI() {
        const recentActions = this.gameHistory.actions.slice(-8);
        this.aiSystem.playerBehaviorPattern = {
            aggressive: recentActions.filter(a => a.type === 'aggressive').length,
            conservative: recentActions.filter(a => a.type === 'conservative').length,
            populist: recentActions.filter(a => a.type === 'populist').length,
            progressive: recentActions.filter(a => a.type === 'progressive').length
        };

        // Ciclo econômico mais estável
        if (Math.random() < 0.05) { // Reduzido de 0.1 para 0.05
            const cycles = ['recession', 'stable', 'growth'];
            this.aiSystem.economicCycle = cycles[Math.floor(Math.random() * cycles.length)];
        }

        // Mudanças políticas mais graduais
        this.realPolitics.congressApproval += (Math.random() * 6 - 3); // Reduzido de 10-5 para 6-3
        this.realPolitics.mediaHostility += (Math.random() * 4 - 2);   // Reduzido de 8-4 para 4-2
        this.realPolitics.economicPressure += (Math.random() * 3 - 1.5); // Reduzido de 6-3 para 3-1.5

        // Garantir limites
        this.realPolitics.congressApproval = Math.max(30, Math.min(90, this.realPolitics.congressApproval));
        this.realPolitics.mediaHostility = Math.max(10, Math.min(80, this.realPolitics.mediaHostility));
        this.realPolitics.economicPressure = Math.max(5, Math.min(70, this.realPolitics.economicPressure));
    }

    generateIntelligentCrisis() {
        // Crises menos severas e mais manejáveis
        const crises = [
            {
                title: "Questão sobre Gastos Públicos",
                description: "Debate no Congresso sobre o orçamento para programas sociais.",
                difficulty: 'normal', // Reduzido de 'hard'
                choices: [
                    { 
                        text: "Defender aumento dos gastos", 
                        effects: { democracy: 5, popularity: 8, economy: -5 } // Efeitos mais suaves
                    },
                    { 
                        text: "Propor cortes moderados", 
                        effects: { economy: 8, popularity: -3, social: -3 }
                    },
                    { 
                        text: "Buscar meio-termo", 
                        effects: { democracy: 3, economy: 2, popularity: -1 }
                    }
                ]
            },
            {
                title: "Tensão Regional Menor",
                description: "Desentendimento diplomático com país vizinho sobre questões comerciais.",
                difficulty: 'normal',
                choices: [
                    { 
                        text: "Negociar acordo comercial", 
                        effects: { international: 10, economy: 5, security: -2 }
                    },
                    { 
                        text: "Manter posição firme", 
                        effects: { security: 8, international: -3, popularity: 3 }
                    },
                    { 
                        text: "Buscar mediação internacional", 
                        effects: { international: 5, democracy: 3, security: 2 }
                    }
                ]
            },
            {
                title: "Debate sobre Meio Ambiente",
                description: "ONGs pressionam por políticas ambientais mais rigorosas.",
                difficulty: 'normal',
                choices: [
                    { 
                        text: "Aprovar novas leis ambientais", 
                        effects: { environment: 15, international: 8, economy: -5 }
                    },
                    { 
                        text: "Propor regulamentação gradual", 
                        effects: { environment: 8, economy: 2, popularity: 3 }
                    },
                    { 
                        text: "Focar em incentivos econômicos", 
                        effects: { economy: 5, environment: 5, democracy: 2 }
                    }
                ]
            }
        ];

        return crises[Math.floor(Math.random() * crises.length)];
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

    // === CAMPANHA BALANCEADA ===
    startCampaign() {
        this.gameState = 'campaign';
        this.showScreen('campaign');
        this.setupCampaignActions();
        this.startCampaignTimer();
        this.updateUI();
    }

    setupCampaignActions() {
        // Modificador econômico mais suave
        const economicModifier = this.aiSystem.economicCycle === 'recession' ? 1.2 : 
                               this.aiSystem.economicCycle === 'growth' ? 0.9 : 1.0;
        
        const actions = [
            { 
                id: 'social_media', 
                title: '📱 Campanha Digital', 
                description: 'Estratégia em redes sociais e plataformas digitais.',
                costs: { funds: Math.round(8 * economicModifier), days: 3 }, // Reduzido de 4 para 3 dias
                effects: { support: 18, mediaPresence: 25, approval: 8, polls: 10 }, // Efeitos aumentados
                type: 'populist'
            },
            { 
                id: 'traditional_coalitions', 
                title: '🤝 Articulação Política', 
                description: 'Negociações com partidos e lideranças regionais.',
                costs: { funds: Math.round(18 * economicModifier), days: 7 }, // Reduzido de 25 fundos e 10 dias
                effects: { coalitions: 3, support: 20, approval: 12, polls: 8 }, // Efeitos aumentados
                type: 'conservative'
            },
            { 
                id: 'ground_campaign', 
                title: '🚶 Campanha de Base', 
                description: 'Mobilização direta com eleitores e comunidades.',
                costs: { funds: Math.round(6 * economicModifier), days: 8 }, // Reduzido custos
                effects: { support: 25, coalitions: 2, approval: 15, polls: 12 }, // Efeitos aumentados
                type: 'populist'
            },
            { 
                id: 'media_campaign', 
                title: '📺 Campanha na Mídia', 
                description: 'Presença massiva em TV, rádio e jornais.',
                costs: { funds: Math.round(22 * economicModifier), days: 5 }, // Reduzido de 30 fundos
                effects: { approval: 25, mediaPresence: 30, polls: 18, support: 8 }, // Efeitos aumentados
                type: 'conservative'
            },
            { 
                id: 'debates', 
                title: '🎙️ Preparação para Debates', 
                description: 'Treinamento intensivo com especialistas.',
                costs: { funds: Math.round(12 * economicModifier), days: 6 }, // Reduzido custos
                effects: { debateScore: 35, approval: 18, mediaPresence: 12, polls: 15 }, // Efeitos aumentados
                type: 'conservative'
            },
            { 
                id: 'negative_campaign', 
                title: '⚔️ Campanha de Oposição', 
                description: 'Estratégia focada em criticar adversários.',
                costs: { funds: Math.round(15 * economicModifier), days: 4 }, // Reduzido custos
                effects: { support: 15, approval: -3, mediaPresence: 20, polls: 12 }, // Penalidade menor
                type: 'aggressive'
            },
            { 
                id: 'populist_rally', 
                title: '🔥 Comícios Populares', 
                description: 'Grandes eventos para mobilizar a base eleitoral.',
                costs: { funds: Math.round(8 * economicModifier), days: 5 }, // Reduzido custos
                effects: { support: 22, approval: 12, polls: 10, coalitions: 1 }, // Sem penalidade
                type: 'populist'
            },
            { 
                id: 'policy_platform', 
                title: '📊 Plataforma de Propostas', 
                description: 'Apresentação detalhada do plano de governo.',
                costs: { funds: Math.round(10 * economicModifier), days: 6 }, // Reduzido custos
                effects: { approval: 20, polls: 16, support: 10, coalitions: 1 }, // Efeitos aumentados
                type: 'conservative'
            }
        ];

        this.renderActions('campaign-actions', actions, this.executeCampaignAction.bind(this));
    }

    executeCampaignAction(action) {
        if (!this.canAffordAction(action.costs)) {
            this.showNotification("Recursos insuficientes!");
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
        
        // Eventos menos frequentes
        if (Math.random() < 0.2) { // Reduzido de 0.4 para 0.2
            this.triggerCampaignCrisis();
        }
    }

    startCampaignTimer() {
        this.timers.campaign = setInterval(() => {
            if (this.gameState !== 'campaign') {
                clearInterval(this.timers.campaign);
                return;
            }
            
            this.player.stats.days--;
            
            // Flutuação menor nas pesquisas
            this.player.stats.polls += Math.random() * 2 - 1; // Reduzido de 4-2 para 2-1
            this.player.stats.polls = Math.max(0, Math.min(100, this.player.stats.polls));
            
            if (this.player.stats.days <= 0) {
                this.endCampaign();
            }
            
            this.updateUI();
        }, 2000); // Mais lento: 2 segundos por dia
    }

    triggerCampaignCrisis() {
        const crises = [
            {
                title: "Debate sobre Propostas",
                description: "Adversários questionam viabilidade do seu plano econômico.",
                choices: [
                    { text: "Defender com dados técnicos", effects: { approval: 8, polls: 5 } },
                    { text: "Simplificar explicação", effects: { approval: 5, support: 8 } },
                    { text: "Contra-atacar adversários", effects: { approval: -2, support: 10 } }
                ]
            },
            {
                title: "Questão sobre Alianças",
                description: "Surgem dúvidas sobre seus apoios políticos.",
                choices: [
                    { text: "Reafirmar alianças", effects: { coalitions: 1, approval: 3 } },
                    { text: "Demonstrar independência", effects: { approval: 8, coalitions: -1 } },
                    { text: "Buscar novos apoios", effects: { support: 12, funds: -5 } }
                ]
            },
            {
                title: "Oportunidade de Mídia",
                description: "Grande veículo oferece entrevista em horário nobre.",
                choices: [
                    { text: "Aceitar imediatamente", effects: { mediaPresence: 15, approval: 8 } },
                    { text: "Negociar melhores condições", effects: { mediaPresence: 10, approval: 12 } },
                    { text: "Declinar respeitosamente", effects: { approval: 3, support: 5 } }
                ]
            }
        ];

        const crisis = crises[Math.floor(Math.random() * crises.length)];
        this.showCrisisModal(crisis);
    }

    endCampaign() {
        clearInterval(this.timers.campaign);
        
        // Cálculo mais generoso para vitória
        const baseScore = (this.player.stats.support * 0.3) + 
                        (this.player.stats.approval * 0.25) + 
                        (this.player.stats.debateScore * 0.15) + 
                        (this.player.stats.mediaPresence * 0.15) + 
                        (this.player.stats.polls * 0.15);
        
        const economicModifier = this.aiSystem.economicCycle === 'recession' ? -5 : 
                               this.aiSystem.economicCycle === 'growth' ? 3 : 0;
        
        const finalScore = Math.max(0, Math.round(baseScore + economicModifier));
        this.gameHistory.performance.electionScore = finalScore;
        
        // Vitória mais fácil: apenas 55% necessário (era 65%)
        if (finalScore >= 55) {
            this.showModal(
                "🎉 VITÓRIA ELEITORAL!", 
                `Parabéns, Presidente ${this.player.name}! Com ${finalScore}% dos votos, você conquistou uma vitória expressiva.`, 
                [{ text: "Assumir a Presidência", callback: () => this.startGovernment() }]
            );
        } else {
            this.gameHistory.performance.gameEnded = 'electoral_defeat';
            this.showModal(
                "📊 RESULTADO ELEITORAL", 
                `Você obteve ${finalScore}% dos votos. Embora não tenha vencido desta vez, foi uma campanha respeitável.`, 
                [
                    { text: "Nova Campanha", callback: () => this.init() },
                    { text: "Ver Relatório", callback: () => this.exportToPDF() }
                ]
            );
        }
    }

    // === GOVERNO MAIS EQUILIBRADO ===
    startGovernment() {
        this.gameState = 'government';
        this.showScreen('government');
        this.setupGovernmentActions();
        this.startGovernmentTimer();
        this.updateUI();

        // Bônus por vitória eleitoral
        const campaignImpact = this.player.stats.approval / 8; // Reduzido de /10 para /8
        this.realPolitics.congressApproval += campaignImpact;
        this.realPolitics.mediaHostility -= campaignImpact / 2;
    }

    setupGovernmentActions() {
        const congressFactor = Math.max(0.7, this.realPolitics.congressApproval / 100); // Piso maior
        
        const actions = [
            { 
                id: 'economic_policy', 
                title: '💰 Política Econômica', 
                description: 'Implementar reformas para estimular crescimento.',
                costs: { months: Math.round(4 / congressFactor) }, // Reduzido de 12 para 4
                effects: { 
                    economy: 15, 
                    social: -3,    // Reduzido de -8 para -3
                    democracy: -2, // Reduzido de -5 para -2
                    popularity: -3 // Reduzido de -10 para -3
                },
                type: 'conservative',
                difficulty: 'normal' // Reduzido de 'extreme'
            },
            { 
                id: 'social_programs', 
                title: '👥 Programas Sociais', 
                description: 'Expandir programas de assistência e educação.',
                costs: { months: Math.round(5 / congressFactor) }, // Reduzido de 10 para 5
                effects: { 
                    social: 20,    // Reduzido de 35 para 20
                    economy: -8,   // Reduzido de -15 para -8
                    democracy: 5,
                    popularity: 12, // Reduzido de 20 para 12
                    gdp: -2        // Reduzido de -5 para -2
                },
                type: 'progressive',
                difficulty: 'normal' // Reduzido de 'extreme'
            },
            { 
                id: 'security_measures', 
                title: '🚔 Segurança Pública', 
                description: 'Reforçar policiamento e combate ao crime.',
                costs: { months: 3 }, // Reduzido de 6 para 3
                effects: { 
                    security: 18,  // Reduzido de 25 para 18
                    democracy: -5, // Reduzido de -12 para -5
                    social: -3,    // Reduzido de -8 para -3
                    popularity: 10 // Reduzido de 15 para 10
                },
                type: 'aggressive',
                difficulty: 'normal' // Reduzido de 'hard'
            },
            { 
                id: 'environmental_policy', 
                title: '🌱 Política Ambiental', 
                description: 'Implementar medidas de proteção ambiental.',
                costs: { months: 4 }, // Reduzido de 8 para 4
                effects: { 
                    environment: 25, // Reduzido de 40 para 25
                    economy: -10,    // Reduzido de -20 para -10
                    international: 15,
                    popularity: -5,  // Reduzido de -15 para -5
                    gdp: -3         // Reduzido de -8 para -3
                },
                type: 'progressive',
                difficulty: 'normal' // Reduzido de 'extreme'
            },
            { 
                id: 'foreign_relations', 
                title: '🌍 Relações Exteriores', 
                description: 'Fortalecer posição internacional do Brasil.',
                costs: { months: 3 }, // Reduzido de 5 para 3
                effects: { 
                    international: 20, // Reduzido de 30 para 20
                    economy: 5,
                    security: -2,      // Reduzido de -5 para -2
                    democracy: 2       // Reduzido de 3 para 2
                },
                type: 'conservative',
                difficulty: 'easy' // Reduzido de 'hard'
            },
            { 
                id: 'infrastructure', 
                title: '🏗️ Infraestrutura', 
                description: 'Investir em obras e modernização do país.',
                costs: { months: 6 }, // Reduzido de 18 para 6
                effects: { 
                    economy: 18,    // Reduzido de 25 para 18
                    social: 10,     // Reduzido de 15 para 10
                    environment: -5, // Reduzido de -12 para -5
                    popularity: 12,  // Reduzido de 18 para 12
                    gdp: 8          // Reduzido de 12 para 8
                },
                type: 'populist',
                difficulty: 'normal' // Reduzido de 'hard'
            },
            { 
                id: 'education_reform', 
                title: '🎓 Reforma Educacional', 
                description: 'Melhorar sistema educacional público.',
                costs: { months: 5 }, // Reduzido de 12 para 5
                effects: { 
                    social: 20,     // Reduzido de 30 para 20
                    economy: 8,     // Reduzido de 10 para 8
                    democracy: 8,   // Reduzido de 12 para 8
                    popularity: 8,  // Reduzido de 12 para 8
                    gdp: 3         // Reduzido de 5 para 3
                },
                type: 'progressive',
                difficulty: 'easy' // Reduzido de 'hard'
            },
            { 
                id: 'healthcare_expansion', 
                title: '🏥 Expansão da Saúde', 
                description: 'Ampliar sistema público de saúde.',
                costs: { months: 4 }, // Novo - custo moderado
                effects: { 
                    social: 18,
                    economy: -5,
                    popularity: 15,
                    democracy: 3
                },
                type: 'progressive',
                difficulty: 'easy'
            }
        ];

        this.renderActions('government-actions', actions, this.executeGovernmentAction.bind(this));
    }

    executeGovernmentAction(action) {
        if (!this.canAffordAction(action.costs)) {
            this.showNotification("Tempo insuficiente!");
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

        // Mudanças políticas mais graduais
        this.realPolitics.congressApproval += Math.random() * 6 - 3; // Reduzido
        this.realPolitics.mediaHostility += Math.random() * 4 - 2;   // Reduzido

        this.calculateGovernmentMetrics();
        this.updateAI();
        this.updateUI();
        this.setupGovernmentActions();
        
        // Crises muito menos frequentes
        if (Math.random() < 0.15) { // Reduzido de 0.35 para 0.15
            this.triggerGovernmentCrisis();
        }
    }

    startGovernmentTimer() {
        this.timers.government = setInterval(() => {
            if (this.gameState !== 'government') {
                clearInterval(this.timers.government);
                return;
            }
            
            this.player.stats.months--;
            
            // Degradação muito mais suave
            const degradationFactor = this.aiSystem.adaptiveDifficulty * 0.3; // Reduzido drasticamente
            const economicCycleFactor = this.aiSystem.economicCycle === 'recession' ? 1.2 : 
                                       this.aiSystem.economicCycle === 'growth' ? 0.8 : 1.0;
            
            ['economy', 'social', 'security', 'international', 'environment'].forEach(stat => {
                const decay = Math.random() * 0.8 * degradationFactor * economicCycleFactor; // Muito reduzido
                this.player.stats[stat] = Math.max(0, this.player.stats[stat] - decay);
            });

            // Democracia mais estável
            this.player.stats.democracy -= Math.random() * 0.2; // Reduzido de 0.5 para 0.2
            this.player.stats.democracy = Math.max(40, this.player.stats.democracy); // Piso maior

            this.calculateGovernmentMetrics();
            this.updateUI();
            
            if (this.player.stats.months <= 0) {
                this.endTerm();
            }
        }, 3000); // Mais lento: 3 segundos por mês
    }

    calculateGovernmentMetrics() {
        const { economy, social, security, environment, democracy } = this.player.stats;
        
        // Fórmula mais favorável
        const performanceWeight = (economy * 0.25) + (social * 0.25) + (security * 0.20) + (environment * 0.15) + (democracy * 0.15);
        const congressWeight = (this.realPolitics.congressApproval / 100) * 0.25; // Reduzido impacto
        const mediaWeight = ((100 - this.realPolitics.mediaHostility) / 100) * 0.15; // Reduzido impacto
        
        this.player.stats.popularity = Math.round((performanceWeight * 0.6) + (congressWeight * 100) + (mediaWeight * 100) + (this.player.stats.popularity * 0.4));
        this.player.stats.popularity = Math.max(0, Math.min(100, this.player.stats.popularity));

        // Cálculo mais benevolente do risco de impeachment
        const democraticHealth = democracy;
        const popularSupport = this.player.stats.popularity;
        const congressSupport = this.realPolitics.congressApproval;
        const mediaSupport = 100 - this.realPolitics.mediaHostility;
        
        this.player.stats.impeachmentRisk = Math.max(0, Math.min(100, 
            100 - ((democraticHealth * 0.35) + (popularSupport * 0.35) + (congressSupport * 0.20) + (mediaSupport * 0.10))
        ));

        // Impeachment muito mais raro
        if (this.player.stats.impeachmentRisk >= 95 && this.player.stats.popularity <= 10) { // Era 85 e 15
            this.triggerImpeachment();
        }

        // Crises automáticas muito mais raras
        if (this.player.stats.economy <= 10 && Math.random() < 0.1) { // Era 15 e 0.3
            this.triggerEconomicCollapse();
        }

        if (this.player.stats.democracy <= 15 && Math.random() < 0.05) { // Era 25 e 0.2
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
            "⚖️ IMPEACHMENT", 
            "O Congresso aprovou seu impeachment. Embora seja o fim deste mandato, você deixa um legado político.", 
            [
                { text: "Ver Relatório", callback: () => this.exportToPDF() },
                { text: "Nova Tentativa", callback: () => this.init() }
            ]
        );
    }

    triggerEconomicCollapse() {
        clearInterval(this.timers.government);
        this.gameHistory.performance.gameEnded = 'economic_collapse';
        
        this.showModal(
            "📉 CRISE ECONÔMICA", 
            "O país enfrenta sérias dificuldades econômicas que forçaram mudanças no governo.", 
            [
                { text: "Analisar Situação", callback: () => this.exportToPDF() },
                { text: "Recomeçar", callback: () => this.init() }
            ]
        );
    }

    triggerConstitutionalCrisis() {
        clearInterval(this.timers.government);
        this.gameHistory.performance.gameEnded = 'constitutional_crisis';
        
        this.showModal(
            "📜 CRISE INSTITUCIONAL", 
            "Tensões institucionais levaram a mudanças no governo.", 
            [
                { text: "Ver Análise", callback: () => this.exportToPDF() },
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
                "🏛️ MANDATO COMPLETO", 
                `Você completou ${this.player.maxTerms} mandatos. Seu legado político está consolidado.`, 
                [
                    { text: "Relatório Final", callback: () => this.exportToPDF() },
                    { text: "Nova Era", callback: () => this.init() }
                ]
            );
        } else if (this.player.stats.popularity >= 50 && this.realPolitics.congressApproval >= 40) { // Requisitos mais fáceis
            this.showModal(
                "🗳️ REELEIÇÃO POSSÍVEL", 
                `Com ${Math.round(this.player.stats.popularity)}% de aprovação, você pode tentar a reeleição.`, 
                [
                    { text: "Disputar Reeleição", callback: () => this.startReelection() },
                    { text: "Encerrar Mandato", callback: () => this.showFinalResults() }
                ]
            );
        } else {
            this.gameHistory.performance.gameEnded = 'term_completed';
            this.showModal(
                "📊 FIM DE MANDATO", 
                `Mandato concluído com ${Math.round(this.player.stats.popularity)}% de aprovação.`, 
                [
                    { text: "Ver Balanço", callback: () => this.exportToPDF() },
                    { text: "Novo Desafio", callback: () => this.init() }
                ]
            );
        }
    }

    startReelection() {
        this.player.term++;
        // Herança mais generosa da performance anterior
        this.player.stats.days = 90;
        this.player.stats.funds = Math.max(40, Math.round(this.player.stats.popularity * 0.8)); // Mais generoso
        this.player.stats.support = Math.round(this.player.stats.popularity * 0.5);  // Mais generoso
        this.player.stats.approval = Math.round(this.player.stats.popularity * 0.9); // Mais generoso
        this.player.stats.polls = Math.round(this.player.stats.popularity * 0.8);
        this.player.stats.months = 48;
        
        // Reset com vantagens
        this.player.stats.coalitions = 2; // Mantém coligações
        this.player.stats.mediaPresence = 30; // Maior presença inicial
        this.player.stats.debateScore = 0;
        
        this.startCampaign();
    }

    // === SISTEMA DE PDF SIMPLIFICADO ===
    exportToPDF() {
        // Implementação básica sem dependências externas
        const reportContent = this.generateTextReport();
        
        // Tenta usar a API nativa do navegador se disponível
        if (window.jsPDF) {
            this.generateAdvancedPDF();
        } else {
            // Fallback: download como texto
            this.downloadTextReport(reportContent);
        }
    }

    generateTextReport() {
        const report = [];
        report.push("=== REPÚBLICA DIGITAL - RELATÓRIO ===");
        report.push(`Candidato: ${this.player.name}`);
        report.push(`Ideologia: ${this.player.ideology}`);
        report.push(`Mandatos: ${this.player.term}`);
        report.push("");
        report.push("=== ESTATÍSTICAS FINAIS ===");
        
        Object.entries(this.player.stats).forEach(([key, value]) => {
            report.push(`${key}: ${value}`);
        });
        
        if (this.gameHistory.performance.electionScore) {
            report.push("");
            report.push(`Score Eleitoral: ${this.gameHistory.performance.electionScore}%`);
        }
        
        report.push("");
        report.push(`Gerado em: ${new Date().toLocaleString('pt-BR')}`);
        
        return report.join('\n');
    }

    downloadTextReport(content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Relatorio_${this.player.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification("Relatório baixado como arquivo de texto!");
    }

    // === SALVAMENTO SIMPLIFICADO ===
    startAutoSave() {
        setInterval(() => {
            if (this.gameState !== 'setup') {
                this.autoSave();
            }
        }, 60000); // A cada minuto
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
            console.warn("Erro no auto-save:", e);
        }
    }

    manualSave() {
        this.autoSave();
        this.showNotification("Jogo salvo!");
    }

    loadGame() {
        try {
            const savedData = localStorage.getItem('republicaDigital_save');
            if (!savedData) {
                this.showNotification("Nenhum jogo salvo encontrado!");
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
            
            this.showNotification("Jogo carregado!");
        } catch(e) {
            this.showNotification("Erro ao carregar jogo!");
        }
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
                actionDiv.addEventListener('click', () => callback(action));
            }

            const costsText = Object.entries(action.costs)
                .map(([k, v]) => `${this.getResourceSymbol(k)}${v}`)
                .join(' ');
            
            const effectsHTML = Object.entries(action.effects)
                .map(([k, v]) => `<span class="effect ${v > 0 ? 'positive' : 'negative'}">${v > 0 ? '+' : ''}${v} ${this.getStatName(k)}</span>`)
                .join('');

            const difficultyBadge = action.difficulty ? 
                `<span class="difficulty-badge ${action.difficulty}">${action.difficulty.toUpperCase()}</span>` : '';

            actionDiv.innerHTML = `
                <div class="action-title">
                    <span>${action.title}</span>
                    <span class="action-cost">${costsText}</span>
                </div>
                <div class="action-description">${action.description} ${difficultyBadge}</div>
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
        // Criar elemento de notificação simples
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
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

        // Header
        const termDisplay = document.getElementById('term-display');
        if (termDisplay) {
            termDisplay.textContent = this.gameState === 'government' ? `${this.player.term}º Mandato` : '';
        }

        // Campaign stats
        safeSet('days-left', Math.max(0, stats.days));
        safeSet('funds', Math.max(0, stats.funds));
        safeSet('support', Math.max(0, Math.round(stats.support)));

        const campaignStatsEl = document.getElementById('campaign-stats');
        if (campaignStatsEl) {
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
                    <div class="stat-value">${Math.round(stats.debateScore)}</div>
                    <div class="stat-label">Debates</div>
                </div>
            `;
        }

        // Government stats
        safeSet('months-left', Math.max(0, stats.months));
        
        const governmentStatsEl = document.getElementById('government-stats');
        if (governmentStatsEl) {
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

    // === FUNÇÕES AUXILIARES ===
    applyCosts(costs) {
        Object.entries(costs).forEach(([resource, cost]) => {
            this.player.stats[resource] = Math.max(0, this.player.stats[resource] - cost);
        });
    }

    applyEffects(effects) {
        Object.entries(effects).forEach(([stat, value]) => {
            if (this.player.stats.hasOwnProperty(stat)) {
                if (['funds', 'days', 'months', 'coalitions'].includes(stat)) {
                    // Estes podem ir abaixo de 0 ou acima de 100
                    this.player.stats[stat] += value;
                } else {
                    // Outros ficam entre 0-100
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
            polls: 'Pesquisas', gdp: 'PIB', population: 'População'
        };
        return names[stat] || stat;
    }

    showFinalResults() {
        const govStats = ['economy', 'social', 'security', 'international', 'environment'];
        const avgPerf = govStats.reduce((sum, stat) => sum + this.player.stats[stat], 0) / govStats.length;
        
        let evaluation = "Desempenho Regular";
        if (avgPerf >= 70) evaluation = "Excelente Presidente 🏆";
        else if (avgPerf >= 55) evaluation = "Bom Presidente 👍";
        else if (avgPerf >= 40) evaluation = "Presidente Mediano 😐";

        this.gameHistory.performance.finalEvaluation = evaluation;
        this.gameHistory.performance.avgPerformance = Math.round(avgPerf);

        this.showModal(
            "📊 LEGADO PRESIDENCIAL", 
            `<strong>${evaluation}</strong><br><br>
             Performance Média: ${Math.round(avgPerf)}%<br>
             Mandatos: ${this.player.term}<br>
             Aprovação Final: ${Math.round(this.player.stats.popularity)}%`, 
            [
                { text: "Exportar Relatório", callback: () => this.exportToPDF() },
                { text: "Nova Simulação", callback: () => this.init() }
            ]
        );
    }

    formatPlayTime() {
        const totalMs = Date.now() - this.player.startTime;
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }
}

// Inicialização do jogo
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new RepublicaDigital();
});

// Adicionar estilos CSS para badges de dificuldade
const style = document.createElement('style');
style.textContent = `
    .difficulty-badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        margin-left: 8px;
        font-weight: bold;
    }
    .difficulty-badge.easy {
        background: rgba(39,174,96,0.2);
        color: #27ae60;
    }
    .difficulty-badge.normal {
        background: rgba(243,156,18,0.2);
        color: #f39c12;
    }
    .difficulty-badge.hard {
        background: rgba(231,76,60,0.2);
        color: #e74c3c;
    }
    .action-card {
        transition: all 0.2s ease;
    }
    .action-card:hover:not(.disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);
