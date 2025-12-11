// assets/booking.js

// 1. IMPORT DU STYLE (Lien avec Webpack)
import './styles/booking.scss';

document.addEventListener('DOMContentLoaded', () => {
    // SÉLECTION DES ÉLÉMENTS
    const steps = document.querySelectorAll('.form-step');
    const progressItems = document.querySelectorAll('.progressbar li');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('bookingForm');
    const navButtonsContainer = document.querySelector('.nav-buttons');
    const successView = document.getElementById('successView');

    let currentStep = 0;

    // INITIALISATION
    updateUI();

    // --- GESTION DES CLICS ---

    // Bouton Suivant
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateUI();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });

    // Bouton Retour
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
    });

    // Soumission du Formulaire
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Bloque l'envoi réel pour la démo

        if (validateStep(currentStep)) {
            // Masquer tout le formulaire
            form.style.display = 'none';
            document.querySelector('.steps-container').style.display = 'none';
            navButtonsContainer.style.display = 'none';

            // Personnaliser le message de succès
            const name = document.getElementById('firstname').value;
            if(document.getElementById('conf-name')) {
                document.getElementById('conf-name').innerText = name;
            }

            // Afficher l'écran de succès
            successView.style.display = 'block';
            window.scrollTo(0, 0);
        }
    });

    // --- FONCTIONS ---

    function updateUI() {
        // Afficher la bonne étape
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Mettre à jour la barre de progression
        progressItems.forEach((item, index) => {
            item.classList.remove('active', 'completed');
            if (index === currentStep) {
                item.classList.add('active');
            } else if (index < currentStep) {
                item.classList.add('completed');
            }
        });

        // Affichage des boutons
        if (currentStep === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

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
        const date = document.getElementById('date').value || '...';
        const budget = document.getElementById('budget').value;
        const message = document.getElementById('message').value || 'Aucune précision';

        // Récupération Heure (Radio)
        const timeInput = document.querySelector('input[name="time"]:checked');
        const time = timeInput ? timeInput.value : '...';

        // Récupération Service (Radio)
        const serviceRadio = document.querySelector('input[name="service"]:checked');
        let serviceName = "Non sélectionné";
        if (serviceRadio) {
            const titleEl = serviceRadio.nextElementSibling.querySelector('.radio-title');
            if (titleEl) serviceName = titleEl.innerText;
        }

        // Injection
        if(document.getElementById('recap-name')) document.getElementById('recap-name').innerText = `${firstname} ${lastname}`;
        if(document.getElementById('recap-email')) document.getElementById('recap-email').innerText = email;
        if(document.getElementById('recap-service')) document.getElementById('recap-service').innerText = serviceName;
        if(document.getElementById('recap-date')) document.getElementById('recap-date').innerText = date;
        if(document.getElementById('recap-time')) document.getElementById('recap-time').innerText = time;
        if(document.getElementById('recap-budget')) document.getElementById('recap-budget').innerText = budget ? `${budget}€` : 'Non renseigné';
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
                input.closest('.checkbox-group')?.classList.add('error');
            } else {
                input.closest('.input-group')?.classList.remove('error');
                input.closest('.checkbox-group')?.classList.remove('error');
            }
        });
        return isValid;
    }
});
