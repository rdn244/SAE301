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

    // 2. Gérer le clic sur "Ajouter +"
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

            // Effet visuel "En cours..."
            const originalText = this.innerText;
            this.innerText = "Ajout...";
            this.style.backgroundColor = "#121212";
            this.style.color = "#fff";

            // Appel AJAX vers Symfony
            fetch(`${urlId}`, { method: 'POST' })
                .then(res => {
                    // Si le serveur renvoie une erreur (500 ou 404), on lève une exception
                    if (!res.ok) {
                        throw new Error(`Erreur serveur : ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    console.log("✅ Réponse serveur :", data);

                    if(data.status === 'success') {
                        // Mettre à jour le badge
                        updateBadge(data.totalQuantity);

                        // Message de succès
                        this.innerText = "Ajouté !";

                        // Remettre le bouton normal après 2 secondes
                        setTimeout(() => {
                            this.innerText = originalText;
                            this.style.backgroundColor = "transparent";
                            this.style.color = "#121212";
                        }, 2000);
                    }
                })
                .catch(error => {
                    console.error("❌ ERREUR AJAX :", error);
                    // Feedback visuel d'erreur pour l'utilisateur
                    this.innerText = "Erreur";
                    this.style.backgroundColor = "red";
                    this.style.borderColor = "red";
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
