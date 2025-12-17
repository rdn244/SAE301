// assets/booking.js

import './styles/booking.scss';

document.addEventListener('DOMContentLoaded', () => {
    // --- SÉLECTION DES ÉLÉMENTS ---
    const steps = document.querySelectorAll('.form-step');
    const progressItems = document.querySelectorAll('.progressbar li');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('bookingForm');
    const navButtonsContainer = document.querySelector('.nav-buttons');
    const successView = document.getElementById('successView');

    // NOUVEAU : Sélection pour les créneaux dynamiques
    const serviceInputs = document.querySelectorAll('input[name="service"]');
    const slotsGrid = document.querySelector('.slots-grid');

    let currentStep = 0;

    // --- CONFIGURATION DES CRÉNEAUX ---
    const slotsConfig = {
        'audit': ['09:00', '14:00'], // 3H : Matin ou Après-midi
        'shopping': ['09:00', '11:00', '14:00', '16:00'], // 2H : Créneaux espacés
        'event': ['À définir ensemble'],
        'all_inclusive': ['Journée Complète (09:30)'] // Journée entière
    };

    // --- INITIALISATION ---
    updateUI();

    // Si un service est déjà coché au chargement (ex: retour arrière), on charge ses créneaux
    const checkedService = document.querySelector('input[name="service"]:checked');
    if(checkedService) {
        updateSlots(checkedService.value);
    } else {
        // Par défaut, on demande de choisir un service
        slotsGrid.innerHTML = '<p style="font-size:0.8rem; color:#888;">Veuillez d\'abord sélectionner un service.</p>';
    }

    // --- ÉCOUTEUR SUR LES SERVICES ---
    serviceInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            updateSlots(e.target.value);
        });
    });

    // --- FONCTION DE GÉNÉRATION DES CRÉNEAUX ---
    function updateSlots(serviceValue) {
        // 1. On vide la grille actuelle
        slotsGrid.innerHTML = '';

        // 2. On récupère la liste des horaires pour ce service
        const hours = slotsConfig[serviceValue] || [];

        // 3. On crée les boutons HTML pour chaque horaire
        if (hours.length > 0) {
            hours.forEach(time => {
                // Création du label
                const label = document.createElement('label');
                label.className = 'slot-btn';

                // Création de l'input radio
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'time';
                input.value = time;
                input.required = true;

                // Création du span visuel
                const span = document.createElement('span');
                span.textContent = time;

                // Assemblage
                label.appendChild(input);
                label.appendChild(span);
                slotsGrid.appendChild(label);
            });
        } else {
            slotsGrid.innerHTML = '<p>Aucun créneau disponible pour ce service.</p>';
        }
    }


    // --- NAVIGATION (SUIVANT / RETOUR) ---
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateUI();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
    });

    // --- SOUMISSION ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            form.style.display = 'none';
            document.querySelector('.steps-container').style.display = 'none';
            navButtonsContainer.style.display = 'none';

            const name = document.getElementById('firstname').value;
            if(document.getElementById('conf-name')) {
                document.getElementById('conf-name').innerText = name;
            }

            successView.style.display = 'block';
            window.scrollTo(0, 0);
        }
    });

    // --- UI & VALIDATION ---
    function updateUI() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        progressItems.forEach((item, index) => {
            item.classList.remove('active', 'completed');
            if (index === currentStep) item.classList.add('active');
            else if (index < currentStep) item.classList.add('completed');
        });

        if (currentStep === 0) prevBtn.classList.add('hidden');
        else prevBtn.classList.remove('hidden');

        if (currentStep === steps.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
            fillRecap();
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    function fillRecap() {
        const firstname = document.getElementById('firstname').value || '';
        const lastname = document.getElementById('lastname').value || '';
        const email = document.getElementById('email').value || '...';
        const message = document.getElementById('message').value || 'Aucune précision';

        // Date Formatée
        const dateRaw = document.getElementById('date').value;
        let dateFormatted = '...';
        if (dateRaw) {
            const dateObj = new Date(dateRaw);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let dateStr = dateObj.toLocaleDateString('fr-FR', options);
            dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
        }

        // Heure (Dynamique)
        const timeInput = document.querySelector('input[name="time"]:checked');
        const time = timeInput ? timeInput.value : '...';

        // Service
        const serviceRadio = document.querySelector('input[name="service"]:checked');
        let serviceName = "Non sélectionné";
        if (serviceRadio) {
            const titleEl = serviceRadio.nextElementSibling.querySelector('.radio-title');
            if (titleEl) serviceName = titleEl.innerText;
        }

        // Budget
        const budgetRaw = document.getElementById('budget').value;
        let budgetFormatted = 'Non spécifié';
        if (budgetRaw) {
            budgetFormatted = new Intl.NumberFormat('fr-FR', {
                style: 'currency', currency: 'EUR', minimumFractionDigits: 0
            }).format(budgetRaw);
        }

        if(document.getElementById('recap-name')) document.getElementById('recap-name').innerText = `${firstname} ${lastname}`;
        if(document.getElementById('recap-email')) document.getElementById('recap-email').innerText = email;
        if(document.getElementById('recap-service')) document.getElementById('recap-service').innerText = serviceName;
        if(document.getElementById('recap-date')) document.getElementById('recap-date').innerText = dateFormatted;
        if(document.getElementById('recap-time')) document.getElementById('recap-time').innerText = time;
        if(document.getElementById('recap-budget')) document.getElementById('recap-budget').innerText = budgetFormatted;
        if(document.getElementById('recap-message')) document.getElementById('recap-message').innerText = message;
    }

    function validateStep(stepIndex) {
        const currentStepEl = steps[stepIndex];
        const inputs = currentStepEl.querySelectorAll('input, select, textarea');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
                input.closest('.input-group')?.classList.add('error');
            } else {
                input.closest('.input-group')?.classList.remove('error');
            }
        });
        return isValid;
    }
});
