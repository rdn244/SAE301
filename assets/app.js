//import './stimulus_bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 */
import './styles/app.css';
import './styles/home.scss';
import './styles/news.scss';
import './styles/booking.scss';
import './styles/article.scss';
import './styles/footer.scss';
import './styles/backlog.scss';
import './styles/shop.scss';
import './styles/sidebar.scss';
import './styles/cart.scss';
import './styles/checkout.scss';

console.log('🚀 app.js chargé et prêt !');

document.addEventListener('DOMContentLoaded', () => {

    const badge = document.getElementById('cart-badge');

    // Sécurité : Si le badge n'existe pas dans le HTML, on arrête pour éviter les erreurs
    if (!badge) {
        console.error("❌ ERREUR : L'élément avec id='cart-badge' est introuvable dans le HTML !");
        return;
    }

    // 1. Initialiser le badge au chargement
    fetch('/cart/count')
        .then(res => res.json())
        .then(data => {
            console.log("📦 Panier initial :", data.totalQuantity);
            updateBadge(data.totalQuantity);
        })
        .catch(error => console.error("❌ Erreur chargement panier :", error));

    // 2. Gérer le clic sur "Ajouter +" (VERSION LUXE / ICÔNES)
    const buttons = document.querySelectorAll('.btn-add-cart');
    console.log(`✅ ${buttons.length} boutons 'Ajouter' trouvés sur la page.`);

    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            const urlId = this.getAttribute('data-url');

            console.log(`👆 Clic sur produit ID : ${productId}`);

            if (!productId) {
                console.error("❌ ERREUR : Pas d'ID produit sur ce bouton !");
                return;
            }

            // A. SAUVEGARDE DE L'ÉTAT INITIAL (L'icône du sac)
            // On utilise innerHTML car c'est un SVG, pas du texte
            const originalIcon = this.innerHTML;

            // Appel AJAX vers Symfony
            fetch(`${urlId}`, { method: 'POST' })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Erreur serveur : ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    console.log("✅ Réponse serveur :", data);

                    if(data.status === 'success') {
                        // Mettre à jour le badge du header
                        updateBadge(data.totalQuantity);

                        // B. TRANSFORMATION EN COCHE DE VALIDATION (Check)
                        // On injecte le SVG "Check" à la place du sac
                        this.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        `;

                        // On ajoute la classe pour le fond noir (définie dans shop.scss)
                        this.classList.add('is-added');

                        // C. RETOUR À L'ÉTAT INITIAL APRÈS 2.5 SECONDES
                        setTimeout(() => {
                            this.innerHTML = originalIcon; // On remet le sac
                            this.classList.remove('is-added'); // On enlève le fond noir
                        }, 2500);
                    }
                })
                .catch(error => {
                    console.error("❌ ERREUR AJAX :", error);
                    // Feedback discret en cas d'erreur (bordure rouge)
                    this.style.borderColor = "red";
                    setTimeout(() => {
                        this.style.borderColor = "#121212";
                    }, 2000);
                });
        });
    });

    // Fonction pour afficher/cacher le badge
    function updateBadge(qty) {
        badge.innerText = qty;
        // Force l'affichage en flex si qty > 0
        if(qty > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
});
