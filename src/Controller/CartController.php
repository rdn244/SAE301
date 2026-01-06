<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class CartController extends AbstractController
{
    // On remet la liste ici pour pouvoir retrouver les infos (titre, image, prix)
    private array $products = [
        ['id' => 1, 'title' => 'Costume Dior - Homme', 'price' => '7 200 €', 'image' => 'collections1.jpg'],
        ['id' => 2, 'title' => 'Sac Louis Vuitton - Homme', 'price' => '1 950 €', 'image' => 'collections2.jpg'],
        ['id' => 3, 'title' => 'Dior B30 - Homme', 'price' => '930 €', 'image' => 'collections3.jpg'],
        ['id' => 4, 'title' => 'Manteau Gucci - Femme', 'price' => '2 500 €', 'image' => 'collections4.jpg'],
        ['id' => 5, 'title' => 'Sac Longchamp - Femme', 'price' => '950 €', 'image' => 'collections6.jpg'],
        ['id' => 6, 'title' => 'Robe Maison Margiela - Femme', 'price' => '6 000 €', 'image' => 'collections7.jpg'],
        ['id' => 7, 'title' => 'Collection Blue Night - Lv skate', 'price' => '1 080 €', 'image' => 'collections8.jpg'],
        ['id' => 8, 'title' => 'Collection Blue Night - Rolex', 'price' => '27 685 €', 'image' => 'collections9.jpg'],
        ['id' => 9, 'title' => 'Collection Blue Night - Ralph Lauren', 'price' => '800 €', 'image' => 'collections10.jpg'],
    ];

    // --- PAGE PANIER ---
    #[Route('/panier', name: 'cart_index')]
    public function index(RequestStack $requestStack): Response
    {
        $session = $requestStack->getSession();
        $cart = $session->get('cart', []);

        $cartData = [];
        $total = 0;

        foreach ($cart as $id => $quantity) {
            // On cherche le produit dans notre liste par son ID
            $product = null;
            foreach ($this->products as $p) {
                if ($p['id'] == $id) {
                    $product = $p;
                    break;
                }
            }

            // Si on a trouvé le produit, on l'ajoute à la liste d'affichage
            if ($product) {
                // On nettoie le prix (ex: "7 200 €" -> 7200) pour le calcul
                $cleanPrice = (float) str_replace([' ', '€'], '', $product['price']);

                $cartData[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'subtotal' => $cleanPrice * $quantity
                ];
                $total += $cleanPrice * $quantity;
            }
        }

        return $this->render('cart/index.html.twig', [
            'items' => $cartData,
            'total' => $total
        ]);
    }

    // --- SUPPRIMER UN ARTICLE ---
    #[Route('/cart/remove/{id}', name: 'cart_remove')]
    public function remove(int $id, RequestStack $requestStack): Response
    {
        $session = $requestStack->getSession();
        $cart = $session->get('cart', []);

        if (!empty($cart[$id])) {
            unset($cart[$id]); // On retire l'article
        }

        $session->set('cart', $cart);

        return $this->redirectToRoute('cart_index');
    }

    // --- AJAX : AJOUTER (Déjà fait) ---
    #[Route('/cart/add/{id}', name: 'cart_add', methods: ['POST'])]
    public function add(int $id, RequestStack $requestStack): JsonResponse
    {
        $session = $requestStack->getSession();
        $cart = $session->get('cart', []);

        if (!empty($cart[$id])) {
            $cart[$id]++;
        } else {
            $cart[$id] = 1;
        }

        $session->set('cart', $cart);

        return $this->json([
            'status' => 'success',
            'totalQuantity' => array_sum($cart)
        ]);
    }

    // --- AJAX : COMPTEUR (Déjà fait) ---
    #[Route('/cart/count', name: 'cart_count', methods: ['GET'])]
    public function count(RequestStack $requestStack): JsonResponse
    {
        $session = $requestStack->getSession();
        $cart = $session->get('cart', []);

        return $this->json([
            'totalQuantity' => array_sum($cart)
        ]);
    }
    // --- AUGMENTER LA QUANTITÉ (Depuis le panier) ---
    #[Route('/cart/increase/{id}', name: 'cart_increase')]
    public function increase(int $id, RequestStack $requestStack): Response
    {
        $session = $requestStack->getSession();
        $cart = $session->get('cart', []);

        if (!empty($cart[$id])) {
            $cart[$id]++; // On ajoute 1
        } else {
            $cart[$id] = 1;
        }

        $session->set('cart', $cart);

        // On reste sur la page panier
        return $this->redirectToRoute('cart_index');
    }

    // --- DIMINUER LA QUANTITÉ ---
    #[Route('/cart/decrease/{id}', name: 'cart_decrease')]
    public function decrease(int $id, RequestStack $requestStack): Response
    {
        $session = $requestStack->getSession();
        $cart = $session->get('cart', []);

        if (!empty($cart[$id])) {
            if ($cart[$id] > 1) {
                $cart[$id]--; // On enlève 1
            } else {
                unset($cart[$id]); // Si c'est 1, on supprime carrément l'article
            }
        }

        $session->set('cart', $cart);

        return $this->redirectToRoute('cart_index');
    }
    // --- PAGE DE PAIEMENT (CHECKOUT) ---
    #[Route('/checkout', name: 'cart_checkout')]
    public function checkout(RequestStack $requestStack): Response
    {
        $session = $requestStack->getSession();
        $cart = $session->get('cart', []);

        // Si le panier est vide, on redirige vers la boutique
        if (empty($cart)) {
            return $this->redirectToRoute('app_collection');
        }

        // On recalcule le total pour l'afficher (optionnel, mais sympa)
        $total = 0;
        foreach ($cart as $id => $quantity) {
            foreach ($this->products as $p) {
                if ($p['id'] == $id) {
                    $cleanPrice = (float) str_replace([' ', '€'], '', $p['price']);
                    $total += $cleanPrice * $quantity;
                }
            }
        }

        return $this->render('cart/checkout.html.twig', [
            'total' => $total
        ]);
    }

    // --- VALIDATION DU PAIEMENT (FICTIF) ---
    #[Route('/checkout/success', name: 'cart_checkout_success')]
    public function checkoutSuccess(RequestStack $requestStack): Response
    {
        $session = $requestStack->getSession();

        // ON VIDE LE PANIER (C'est payé !)
        $session->remove('cart');

        return $this->render('cart/success.html.twig');
    }
}
