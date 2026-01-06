<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ShopController extends AbstractController
{
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

    #[Route('/collection', name: 'app_collection')]
    public function collection(): Response
    {
        return $this->render('shop/collection.html.twig', [
            'products' => $this->products
        ]);
    }

    #[Route('/favoris', name: 'app_favorites')]
    public function favorites(): Response
    {
        return $this->render('shop/favorites.html.twig', [
            'products' => $this->products
        ]);
    }
}
