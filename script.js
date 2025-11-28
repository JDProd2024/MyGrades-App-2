// Configuration des matières par série
const configMatieres = {
    // COLLÈGE - Exemple de configuration
    college: {
        matieres: [
            {nom: "Maths", coef: 6},
            {nom: "Anglais", coef: 2},
            {nom: "Histoire-Géo", coef: 2},
            {nom: "Français", coef: 2},
            {nom: "SVT", coef: 3},
            {nom: "EPS", coef: 2}
        ],
        technique: []
    },
    // SCIENCES AVEC PC
    collegePC: {
        matieres: [
            {nom: "Maths", coef: 6},
            {nom: "PC", coef: 6},
            {nom: "Anglais", coef: 2},
            {nom: "Histoire-Géo", coef: 2},
            {nom: "Français", coef: 2},
            {nom: "SVT", coef: 3},
            {nom: "EPS", coef: 2}
        ],
        technique: []
    },
    // SÉRIE LITTÉRAIRE (A)
    litteraire: {
        matieres: [
            {nom: "Maths", coef: 4},
            {nom: "PC", coef: 4},
            {nom: "Anglais", coef: 4},
            {nom: "Allemand", coef: 3},
            {nom: "Histoire-Géo", coef: 4},
            {nom: "Français", coef: 5},
            {nom: "SVT", coef: 2},
            {nom: "EPS", coef: 2},
            {nom: "Philosophie", coef: 4}
        ],
        technique: []
    },
    // SÉRIE SCIENTIFIQUE (C, D)
    scientifique: {
        matieres: [
            {nom: "Maths", coef: 6},
            {nom: "PC", coef: 6},
            {nom: "Anglais", coef: 2},
            {nom: "Histoire-Géo", coef: 2},
            {nom: "Français", coef: 2},
            {nom: "SVT", coef: 3},
            {nom: "EPS", coef: 2},
            {nom: "Philosophie", coef: 2}
        ],
        technique: []
    },
    // SÉRIE TECHNIQUE (C', D')
    technique: {
        matieres: [
            {nom: "Maths", coef: 6},
            {nom: "PC", coef: 6},
            {nom: "Anglais", coef: 2},
            {nom: "Histoire-Géo", coef: 2},
            {nom: "Français", coef: 2},
            {nom: "SVT", coef: 3},
            {nom: "EPS", coef: 2},
            {nom: "Philosophie", coef: 2}
        ],
        technique: [
            {nom: "SLB", coef: 2},
            {nom: "SEI", coef: 2},
            {nom: "TI", coef: 2},
            {nom: "Gestion", coef: 2},
            {nom: "Droit", coef: 1}
        ]
    }
};

// Fonction pour déterminer la configuration des matières selon la classe
function getConfigForClasse(classe) {
    if (['6e', '5e'].includes(classe)) return configMatieres.college;
    if (['4e', '3e'].includes(classe)) return configMatieres.collegePC;
    if (['2nde-A', '1ere-A', 'Tle-A'].includes(classe)) return configMatieres.litteraire;
    if (['2nde-C', '1ere-D', 'Tle-D'].includes(classe)) return configMatieres.scientifique;
    if (['2nde-C-prime', '1ere-D-prime'].includes(classe)) return configMatieres.technique;
    return configMatieres.college; // Configuration par défaut
}

// Variables d'état global
let dispenseEPS = false;
let avecTechnique = true; // Par défaut à Oui pour le premier affichage
let studentData = {nom: '', prenom: '', classe: ''};
let currentConfig = null;

// =================================================================
// GESTION DU DÉMARRAGE ET DES ONGLETS
// =================================================================

// SPLASH SCREEN (Affichage de l'application après le splash)
window.addEventListener('load', function() {
    // Vérifier si la fonction est déjà définie avant de l'appeler
    if (typeof generateMatiereCards === 'function') {
        generateMatiereCards();
    }
    
    // Simuler le temps de chargement
    setTimeout(() => {
        const splash = document.getElementById('splash');
        const app = document.getElementById('app');
        if (splash && app) {
            splash.classList.add('hide');
            setTimeout(() => {
                app.classList.add('show');
            }, 500);
        }
    }, 2000);
});

// GESTION DES ONGLETS
function switchTab(tabName) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content .tab-content').forEach(t => t.classList.remove('active'));
    
    if (tabName === 'config') {
        document.querySelector('.tabs button:nth-child(1)').classList.add('active');
        document.getElementById('config-tab').classList.add('active');
    } else if (tabName === 'notes') {
        document.querySelector('.tabs button:nth-child(2)').classList.add('active');
        document.getElementById('notes-tab').classList.add('active');
    } else if (tabName === 'results') {
        document.querySelector('.tabs button:nth-child(3)').classList.add('active');
        document.getElementById('results-tab').classList.add('active');
        document.getElementById('results').classList.add('show'); // Afficher la carte résultat
    }
    
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// =================================================================
// GESTION DE LA CONFIGURATION (TAB 1)
// =================================================================

// Événements pour la dispense d'EPS
document.getElementById('btnNonDispense')?.addEventListener('click', function() {
    dispenseEPS = false;
    this.classList.add('active');
    document.getElementById('btnOuiDispense').classList.remove('active');
});

document.getElementById('btnOuiDispense')?.addEventListener('click', function() {
    dispenseEPS = true;
    this.classList.add('active');
    document.getElementById('btnNonDispense').classList.remove('active');
});

// Événements pour le choix des matières techniques
document.getElementById('btnNonTechnique')?.addEventListener('click', function() {
    avecTechnique = false;
    this.classList.add('active');
    document.getElementById('btnOuiTechnique').classList.remove('active');
});

document.getElementById('btnOuiTechnique')?.addEventListener('click', function() {
    avecTechnique = true;
    this.classList.add('active');
    document.getElementById('btnNonTechnique').classList.remove('active');
});

// Validation de la configuration
function validerConfig() {
    const nom = document.getElementById('nom')?.value.trim();
    const prenom = document.getElementById('prenom')?.value.trim();
    const classe = document.getElementById('classe')?.value;
    
    if (!nom || !prenom || !classe) {
        alert('Veuillez remplir votre nom, prénom et choisir une classe.');
        return;
    }
    
    studentData = {nom, prenom, classe};
    currentConfig = getConfigForClasse(classe);
    
    // Logique pour masquer/afficher le choix des matières techniques
    const isTechniqueClasse = ['2nde-C-prime', '1ere-D-prime'].includes(classe);
    const techChoiceCard = document.querySelector('.dispense-card:nth-child(2)');

    if (techChoiceCard) {
        if (isTechniqueClasse) {
            avecTechnique = true;
            techChoiceCard.style.display = 'none';
        } else {
            // Afficher le choix si ce n'est ni une classe technique, ni une classe sans option technique (selon votre logique)
             techChoiceCard.style.display = 'block';
        }
    }
    
    generateMatiereCards();
    switchTab('notes');
}

// =================================================================
// GESTION DES CARTES DE NOTES (TAB 2)
// =================================================================

// Modèle pour créer la carte d'une matière
function createMatiereCard(matiere, index, isGeneral) {
    const id = (isGeneral ? 'gen' : 'tech') + index;
    const isEPS = matiere.nom === "EPS";
    const isDispense = isEPS && dispenseEPS;
    
    return `
        <div class="matiere-card ${isDispense ? 'dispense' : ''}" id="card-${id}">
            <div class="matiere-header">
                <span class="matiere-name">${matiere.nom}</span>
                <span class="coef-badge">coef ${matiere.coef}</span>
            </div>
            ${isDispense ? '<p style="text-align:center; color:#888;">DISPENSÉ</p>' : `
            <div class="notes-grid">
                <div class="note-input-group">
                    <label class="note-label">1ER DEVOIR</label>
                    <input type="number" id="${id}-d1" min="0" max="20" step="0.5" placeholder="--">
                </div>
                <div class="note-input-group">
                    <label class="note-label">2E DEVOIR</label>
                    <input type="number" id="${id}-d2" min="0" max="20" step="0.5" placeholder="--">
                </div>
                <div class="note-input-group">
                    <label class="note-label">COMPOSITION</label>
                    <input type="number" id="${id}-compo" min="0" max="20" step="0.5" placeholder="--">
                </div>
            </div>
            <div class="devoir3-section">
                <div class="devoir3-label">3E DEVOIR ?</div>
                <div class="small-btns">
                    <button class="small-btn active" onclick="toggle3eDevoir('${id}', false)">Non</button>
                    <button class="small-btn" onclick="toggle3eDevoir('${id}', true)">Oui</button>
                </div>
                <div class="devoir3-input" id="${id}-d3-container">
                    <input type="number" id="${id}-d3" min="0" max="20" step="0.5" placeholder="Note du 3e devoir">
                </div>
            </div>
            `}
        </div>
    `;
}

// Gère l'affichage du champ de saisie du 3e devoir
function toggle3eDevoir(id, hasDevoir3) {
    const card = document.getElementById('card-' + id);
    const btns = card.querySelectorAll('.small-btn');
    const d3Container = document.getElementById(id + '-d3-container');
    
    if (!card || !d3Container) return;

    btns.forEach(btn => btn.classList.remove('active'));
    if (hasDevoir3) {
        btns[1].classList.add('active');
        d3Container.classList.add('show');
    } else {
        btns[0].classList.add('active');
        d3Container.classList.remove('show');
        document.getElementById(id + '-d3').value = ''; // Réinitialiser la valeur
    }
}

// Génère toutes les cartes de matières
function generateMatiereCards() {
    // Si aucune configuration n'a été validée (au premier chargement), utilisez une config par défaut
    if (!currentConfig) {
        currentConfig = configMatieres.college;
    }
    
    const generalContainer = document.getElementById('matieres-generales');
    const techContainer = document.getElementById('matieres-techniques');
    const techHeader = document.getElementById('tech-header');
    
    if (!generalContainer || !techContainer || !techHeader) return; // Sécurité
    
    generalContainer.innerHTML = 
        currentConfig.matieres.map((m, i) => createMatiereCard(m, i, true)).join('');
    
    // Afficher les matières techniques si la classe en a ET si le choix est "Oui"
    if (currentConfig.technique.length > 0 && avecTechnique) {
        techHeader.style.display = 'flex';
        techContainer.innerHTML = 
            currentConfig.technique.map((m, i) => createMatiereCard(m, i, false)).join('');
    } else {
        techHeader.style.display = 'none';
        techContainer.innerHTML = '';
    }
}

// =================================================================
// LOGIQUE DE CALCUL (TAB 3)
// =================================================================

// Calcule la note finale d'une seule matière
function calculerNoteMatiereAvecFormule(id) {
    // Assurez-vous que l'élément existe avant d'essayer de lire sa valeur
    const d1 = parseFloat(document.getElementById(id + '-d1')?.value);
    const d2 = parseFloat(document.getElementById(id + '-d2')?.value);
    const compo = parseFloat(document.getElementById(id + '-compo')?.value);
    
    // Récupérer la note du 3e devoir si le champ est affiché et rempli
    const d3Input = document.getElementById(id + '-d3');
    const d3 = (d3Input && d3Input.closest('.devoir3-input')?.classList.contains('show') && d3Input.value) 
               ? parseFloat(d3Input.value) 
               : null;
    
    // Si les notes de base (d1, d2, compo) sont manquantes, on ne peut pas calculer
    if (isNaN(d1) || isNaN(d2) || isNaN(compo)) {
        return null;
    }
    
    let moyenneDevoirs;
    if (d3 !== null && !isNaN(d3)) {
        moyenneDevoirs = (d1 + d2 + d3) / 3;
    } else {
        moyenneDevoirs = (d1 + d2) / 2;
    }
    
    // Formule finale: (Moyenne Devoirs + Composition) / 2
    let noteFinale = (moyenneDevoirs + compo) / 2;
    
    // Limiter la note à 20
    return Math.min(20, noteFinale);
}

// Fonction principale de calcul
function calculerMoyenne() {
    if (!currentConfig) {
        alert("Veuillez d'abord configurer votre classe !");
        return;
    }
    
    let sommeGen = 0, coefGen = 0;
    let sommeTech = 0, coefTech = 0;
    
    // Calcul des matières générales
    currentConfig.matieres.forEach((matiere, index) => {
        const id = 'gen' + index;
        if (matiere.nom === "EPS" && dispenseEPS) return;
        
        const note = calculerNoteMatiereAvecFormule(id);
        if (note !== null) {
            sommeGen += note * matiere.coef;
            coefGen += matiere.coef;
        }
    });
    
    // Calcul des matières techniques
    if (currentConfig.technique.length > 0 && avecTechnique) {
        currentConfig.technique.forEach((matiere, index) => {
            const id = 'tech' + index;
            const note = calculerNoteMatiereAvecFormule(id);
            if (note !== null) {
                sommeTech += note * matiere.coef;
                coefTech += matiere.coef;
            }
        });
    }

    const totalSomme = sommeGen + sommeTech;
    const totalCoef = coefGen + coefTech;
    
    if (totalCoef === 0) {
        alert("Veuillez saisir au moins une note dans les matières non dispensées.");
        return;
    }

    // Calcul des moyennes
    const moyenneGen = coefGen > 0 ? sommeGen / coefGen : 0;
    const moyenneTech = coefTech > 0 ? sommeTech / coefTech : 0;
    const moyenneFin = totalSomme / totalCoef;
    
    // Affichage des résultats
    afficherResultats(moyenneGen, moyenneTech, moyenneFin, coefTech);
}

// Affiche les résultats et l'appréciation
function afficherResultats(moyenneGen, moyenneTech, moyenneFin, coefTech) {
    document.getElementById('studentInfo').textContent = `${studentData.prenom} ${studentData.nom}`;
    document.getElementById('classeInfo').textContent = studentData.classe;
    
    document.getElementById('moyenneGenerale').textContent = moyenneGen.toFixed(2) + '/20';
    
    if (coefTech > 0) {
        document.getElementById('moyenneTechRow').style.display = 'flex';
        document.getElementById('moyenneTechnique').textContent = moyenneTech.toFixed(2) + '/20';
    } else {
        document.getElementById('moyenneTechRow').style.display = 'none';
    }
    
    document.getElementById('moyenneFinale').textContent = moyenneFin.toFixed(2);
    
    const appreciationDiv = document.getElementById('appreciation');
    if (moyenneFin >= 16) {
        appreciationDiv.textContent = '🎉 Excellent ! Félicitations !';
        appreciationDiv.className = 'appreciation excellent';
    } else if (moyenneFin >= 14) {
        appreciationDiv.textContent = '👏 Très bien ! Continuez ainsi !';
        appreciationDiv.className = 'appreciation tresbien';
    } else if (moyenneFin >= 12) {
        appreciationDiv.textContent = '👍 Bien ! Bon travail !';
        appreciationDiv.className = 'appreciation bien';
    } else if (moyenneFin >= 10) {
        appreciationDiv.textContent = '✅ Assez bien, vous êtes admis';
        appreciationDiv.className = 'appreciation assezbien';
    } else {
        appreciationDiv.textContent = '💪 Peut mieux faire, courage !';
        appreciationDiv.className = 'appreciation peuxmieux';
    }
    
    switchTab('results');
}

// Fonction d'impression
function imprimerResultats() {
    window.print();
}

// Initialisation au chargement de la page (pour générer les cartes par défaut)
generateMatiereCards();
