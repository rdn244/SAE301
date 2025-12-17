<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ShopController extends AbstractController
{
    // On simule 9 produits pour remplir la grille comme sur la maquette
    private array $fakeProducts = [
        ['title' => 'Jae Namaz', 'price' => '99€'],
        ['title' => 'Dates', 'price' => '99€'],
        ['title' => 'Miswak', 'price' => '99€'],
        ['title' => 'Jae Namaz', 'price' => '99€'],
        ['title' => 'Dates', 'price' => '99€'],
        ['title' => 'Miswak', 'price' => '99€'],
        ['title' => 'Jae Namaz', 'price' => '99€'],
        ['title' => 'Dates', 'price' => '99€'],
        ['title' => 'Miswak', 'price' => '99€'],
    ];

    #[Route('/collection', name: 'app_collection')]
    public function collection(): Response
    {
        return $this->render('shop/collection.html.twig', [
            'products' => $this->fakeProducts
        ]);
    }

    #[Route('/favoris', name: 'app_favorites')]
    public function favorites(): Response
    {
        // Pour l'instant, on affiche la même liste, mais la vue sera légèrement différente (cœurs pleins)
        return $this->render('shop/favorites.html.twig', [
            'products' => $this->fakeProducts
        ]);
    }
}
