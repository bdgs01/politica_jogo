// República Digital - Versão FUNCIONAL DEFINITIVA
class RepublicaDigital {
    constructor() {
        this.player = this.getInitialPlayerState();
        this.gameState = 'setup';
        this.phaseCounters = { campaignActions: 0, governmentActions: 0 };
        this.gameHistory = { actions: [], performance: {} };
        
        this.init();
    }

    getInitialPlayerState() {
        return {
            name: '', 
            ideology: '', 
            term: 1,
            startTime: Date.now(),
            stats: {
                funds: 100, support: 25, approval: 45, coalitions: 2,
                mediaPresence: 30, debateScore: 0, polls: 40,
                economy: 50, social: 50, security: 50, 
                international: 50, environment: 50, democracy: 70,
                popularity: 50, impeachmentRisk: 20, governmentFunds: 200
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.resetUI();
        this.updateUI();
        this.showScreen('setup');
    }

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

        if (startBtn) startBtn.addEventListener('click', () => this.startCampaign());
        if (loadBtn) loadBtn.addEventListener('click', () => this.loadGame());

        ideologyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                ideologyBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.player.ideology = btn.dataset.ideology;
                this.checkSetupComplete();
            });
        });

        // Controles do header
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

    resetUI() {
        const nameInput = document.getElementById('candidate-name');
        const ideologyBtns = document.querySelectorAll('.ideology-btn');
        const startBtn = document.getElementById('start-game');

        if (nameInput) nameInput.value = '';
        ideologyBtns.forEach(b => b.classList.remove('selected'));
        if (startBtn) startBtn.disabled = true;
    }

    // === CAMPANHA ===
    startCampaign() {
        this.gameState = 'campaign';
        this.phaseCounters.campaignActions = 0;
        this.showScreen('campaign');
        this.setupCampaignActions();
        this.addResultButton('campaign');
        this.updateUI();
    }

    setupCampaignActions() {
        const actions = [
            { 
                id: 'digital', title: '📱 Campanha Digital', 
                costs: { funds: 25 }, 
                effects: { support: 15, mediaPresence: 20, approval: 10 }
            },
            { 
                id: 'alliances', title: '🤝 Alianças Políticas', 
                costs: { funds: 35 }, 
                effects: { coalitions: 2, support: 18, approval: 8 }
            },
            { 
                id: 'grassroots', title: '🚶 Campanha de Base', 
                costs: { funds: 20 }, 
                effects: { support: 25, approval: 12 }
            },
            { 
                id: 'media', title: '📺 Estratégia Midiática', 
                costs: { funds: 40 }, 
                effects: { approval: 20, mediaPresence: 25 }
            },
            { 
                id: 'debates', title: '🎙️ Preparação Debates', 
                costs: { funds: 30 }, 
                effects: { debateScore: 30, approval: 15 }
            },
            { 
                id: 'rallies', title: '🔥 Comícios Populares', 
                costs: { funds: 15 }, 
                effects: { support: 20, approval: 10 }
            }
        ];

        this.renderActions('campaign-actions', actions, this.executeCampaignAction.bind(this));
    }

    executeCampaignAction(action) {
        if (!this.canAffordAction(action.costs)) {
            this.processElectionResult();
            return;
        }

        this.applyCosts(action.costs);
        this.applyEffects(action.effects);
        this.phaseCounters.campaignActions++;
        
        this.gameHistory.actions.push({
            action: action.id,
            timestamp: Date.now()
        });

        this.updateUI();
        
        if (this.phaseCounters.campaignActions >= 4) {
            this.processElectionResult();
        } else {
            this.setupCampaignActions();
        }
    }

    addResultButton(phase) {
        setTimeout(() => {
            const container = document.getElementById(`${phase}-actions`);
            if (container) {
                const resultBtn = document.createElement('button');
                resultBtn.className = 'btn';
                resultBtn.style.background = '#e74c3c';
                resultBtn.style.marginTop = '20px';
                
                if (phase === 'campaign') {
                    resultBtn.textContent = '🗳️ VER RESULTADO DA ELEIÇÃO';
                    resultBtn.onclick = () => this.processElectionResult();
                } else {
                    resultBtn.textContent = '📊 VER RESULTADO DO MANDATO';
                    resultBtn.onclick = () => this.processGovernmentResult();
                }
                
                container.appendChild(resultBtn);
            }
        }, 1000);
    }

    processElectionResult() {
        const score = (this.player.stats.support * 0.4) + 
                     (this.player.stats.approval * 0.3) + 
                     (this.player.stats.mediaPresence * 0.2) + 
                     (this.player.stats.debateScore * 0.1);
        
        const finalScore = Math.round(score);
        this.gameHistory.performance.electionScore = finalScore;
        
        if (finalScore >= 55) {
            this.showModal(
                "🎉 ELEITO!", 
                `Você conquistou ${finalScore}% dos votos e foi eleito!`, 
                [{ text: "Assumir Presidência", callback: () => this.startGovernment() }]
            );
        } else {
            this.showModal(
                "❌ DERROTADO", 
                `Você obteve ${finalScore}% dos votos. Não foi suficiente.`, 
                [{ text: "Nova Tentativa", callback: () => this.init() }]
            );
        }
    }

    // === GOVERNO ===
    startGovernment() {
        this.gameState = 'government';
        this.phaseCounters.governmentActions = 0;
        this.player.stats.funds = this.player.stats.governmentFunds;
        this.showScreen('government');
        this.setupGovernmentActions();
        this.addResultButton('government');
        this.updateUI();
    }

    setupGovernmentActions() {
        const actions = [
            { 
                id: 'economy', title: '💰 Política Econômica', 
                costs: { funds: 40 }, 
                effects: { economy: 15, popularity: 5 }
            },
            { 
                id: 'social', title: '👥 Programas Sociais', 
                costs: { funds: 50 }, 
                effects: { social: 20, popularity: 10 }
            },
            { 
                id: 'security', title: '🚔 Segurança Pública', 
                costs: { funds: 35 }, 
                effects: { security: 18, popularity: 8 }
            },
            { 
                id: 'environment', title: '🌱 Meio Ambiente', 
                costs: { funds: 45 }, 
                effects: { environment: 20, international: 10 }
            },
            { 
                id: 'infrastructure', title: '🏗️ Infraestrutura', 
                costs: { funds: 60 }, 
                effects: { economy: 15, social: 10, popularity: 12 }
            },
            { 
                id: 'education', title: '🎓 Educação', 
                costs: { funds: 40 }, 
                effects: { social: 18, democracy: 10 }
            }
        ];

        this.renderActions('government-actions', actions, this.executeGovernmentAction.bind(this));
    }

    executeGovernmentAction(action) {
        if (!this.canAffordAction(action.costs)) {
            this.processGovernmentResult();
            return;
        }

        this.applyCosts(action.costs);
        this.applyEffects(action.effects);
        this.phaseCounters.governmentActions++;
        
        this.calculatePopularity();
        this.updateUI();
        
        if (this.phaseCounters.governmentActions >= 6) {
            this.processGovernmentResult();
        } else {
            this.setupGovernmentActions();
        }
    }

    calculatePopularity() {
        const avg = (this.player.stats.economy + this.player.stats.social + 
                    this.player.stats.security + this.player.stats.environment) / 4;
        this.player.stats.popularity = Math.round(avg * 0.7 + this.player.stats.popularity * 0.3);
        this.player.stats.impeachmentRisk = Math.max(0, 100 - this.player.stats.popularity);
    }

    processGovernmentResult() {
        this.player.term++;
        
        if (this.player.stats.popularity >= 50) {
            this.showModal(
                "🗳️ REELEIÇÃO POSSÍVEL", 
                `Com ${this.player.stats.popularity}% de aprovação, você pode tentar a reeleição.`, 
                [
                    { text: "Disputar Reeleição", callback: () => this.startReelectionCampaign() },
                    { text: "Encerrar Carreira", callback: () => this.showFinalResults() }
                ]
            );
        } else if (this.player.stats.impeachmentRisk >= 80) {
            this.showModal(
                "⚖️ IMPEACHMENT", 
                "Você sofreu impeachment devido à baixa aprovação.", 
                [{ text: "Nova Tentativa", callback: () => this.init() }]
            );
        } else {
            this.showModal(
                "📊 FIM DE MANDATO", 
                `Mandato concluído com ${this.player.stats.popularity}% de aprovação.`, 
                [{ text: "Nova Simulação", callback: () => this.init() }]
            );
        }
    }

    startReelectionCampaign() {
        this.player.stats.funds = Math.max(60, this.player.stats.popularity);
        this.player.stats.support = Math.round(this.player.stats.popularity * 0.5);
        this.player.stats.approval = Math.round(this.player.stats.popularity * 0.8);
        this.startCampaign();
    }

    showFinalResults() {
        const avg = (this.player.stats.economy + this.player.stats.social + 
                    this.player.stats.security + this.player.stats.environment) / 4;
        
        let evaluation = "Regular";
        if (avg >= 70) evaluation = "Excepcional 🏆";
        else if (avg >= 55) evaluation = "Bom 👍";
        
        this.showModal(
            "🏛️ LEGADO FINAL", 
            `Mandatos: ${this.player.term - 1}<br>Avaliação: ${evaluation}<br>Aprovação: ${this.player.stats.popularity}%`, 
            [{ text: "Nova Era", callback: () => this.init() }]
        );
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
                .map(([k, v]) => `💰${v}`)
                .join(' ');
            
            const effectsHTML = Object.entries(action.effects)
                .map(([k, v]) => `<span class="effect positive">+${v} ${k}</span>`)
                .join('');

            actionDiv.innerHTML = `
                <div class="action-title">
                    <span>${action.title}</span>
                    <span class="action-cost">${costsText}</span>
                </div>
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
        modalBody.innerHTML = content;
        modalChoices.innerHTML = '';

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

    updateUI() {
        const { stats } = this.player;
        const safeSet = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        safeSet('funds', stats.funds);
        safeSet('support', Math.round(stats.support));

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
                    <div class="stat-value">${Math.round(stats.debateScore)}</div>
                    <div class="stat-label">Debates</div>
                </div>
            `;
        }

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
                    <div class="stat-value">${Math.round(stats.environment)}</div>
                    <div class="stat-label">Ambiente</div>
                </div>
            `;
        }
        
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

    applyCosts(costs) {
        Object.entries(costs).forEach(([resource, cost]) => {
            this.player.stats[resource] -= cost;
        });
    }

    applyEffects(effects) {
        Object.entries(effects).forEach(([stat, value]) => {
            if (this.player.stats[stat] !== undefined) {
                this.player.stats[stat] = Math.max(0, Math.min(100, this.player.stats[stat] + value));
            }
        });
    }

    canAffordAction(costs) {
        return Object.entries(costs).every(([resource, cost]) => 
            this.player.stats[resource] >= cost
        );
    }

    // === SAVE/LOAD/EXPORT ===
    manualSave() {
        localStorage.setItem('republicaDigital_save', JSON.stringify(this.player));
    }

    loadGame() {
        const saved = localStorage.getItem('republicaDigital_save');
        if (saved) {
            this.player = JSON.parse(saved);
            this.updateUI();
        }
    }

    exportToPDF() {
        const report = `RELATÓRIO REPÚBLICA DIGITAL\n\nNome: ${this.player.name}\nMandatos: ${this.player.term}\nAprovação: ${this.player.stats.popularity}%`;
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_${this.player.name}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Inicialização
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new RepublicaDigital();
});
