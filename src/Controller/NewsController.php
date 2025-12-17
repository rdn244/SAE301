<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class NewsController extends AbstractController
{
    // On simule une base de données ici
    private array $articles = [
        'zyad-brahimi' => [
            'title' => "Zyad Brahimi : L'Élégance d'un Ballon d'Or",
            'subtitle' => "Retour sur une soirée historique où le style a rencontré la légende.",
            'date' => "30 OCTOBRE 2024",
            'category' => "CÉRÉMONIE",
            'image' => "zyad.jpg", // Assure-toi que l'image est bien dans public/img/
            'content' => "
                <p>La soirée du Théâtre du Châtelet restera gravée dans les mémoires. Non seulement pour le sacre sportif de Zyad Brahimi, mais pour l'empreinte stylistique qu'il a laissée ce soir-là. Opale Paris a eu l'immense privilège d'orchestrer cette apparition.</p>

                <h3>Une Vision Sur-Mesure</h3>
                <p>Lorsque Zyad nous a contactés, le brief était clair : il ne voulait pas ressembler à un footballeur en costume, mais à une icône intemporelle. Nous avons travaillé sur une silhouette 'Sharp & Timeless'. Le choix s'est porté sur un smoking noir profond en laine froide et mohair, revers en satin de soie, coupé au millimètre près.</p>

                <h3>Les Détails qui Changent Tout</h3>
                <p>Ce qui différencie une tenue correcte d'une tenue légendaire, ce sont les détails invisibles. La chemise à plastron piqué, les boutons de manchette en onyx discrets, et surtout, le tombé du pantalon sur le soulier verni. Rien n'a été laissé au hasard.</p>

                <p>« Opale a compris qui j'étais avant même que je ne le dise. Je me sentais puissant sur scène », nous a confié Zyad après la cérémonie. C'est là toute notre mission : faire du vêtement une armure de confiance.</p>
            "
        ],
        'cassy-bernard' => [
            'title' => "Grammy Awards : L'Éclat de Cassy Bernard",
            'subtitle' => "Quand l'électro rencontre la Haute Couture sur le tapis rouge de Los Angeles.",
            'date' => "05 FÉVRIER 2025",
            'category' => "RED CARPET",
            'image' => "cassy.jpg",
            'content' => "
                <p>Los Angeles, Crypto.com Arena. Les flashs crépitent. Au milieu des stars de la pop mondiale, Cassy Bernard détonne. La DJ et productrice française, habituée des clubs underground de Berlin, devait marquer son entrée dans la cour des grands aux États-Unis.</p>

                <h3>L'Hybride Luxe-Underground</h3>
                <p>Le défi pour Opale Paris était de conserver l'ADN radical de Cassy tout en respectant les codes glamour des Grammys. Nous avons opté pour une pièce d'archive d'une Grande Maison, retravaillée pour l'occasion : une structure architecturale rigide adoucie par une traîne fluide.</p>

                <h3>Une Logistique de Précision</h3>
                <p>Habiller une star à l'autre bout du monde demande une précision militaire. Essayages express à Paris entre deux dates de tournée, transport sécurisé de la pièce, et habillage en loge 30 minutes avant le Red Carpet. Notre équipe 'Stylisme Événement' a géré chaque imprévu pour que Cassy n'ait qu'à se soucier de sa musique.</p>

                <p>Le résultat ? Elle a été citée dans le Top 10 des 'Best Dressed' par Vogue US dès le lendemain. Une victoire pour elle, et une fierté pour Opale.</p>
            "
        ]
    ];

    #[Route('/actualites', name: 'app_news')]
    public function index(): Response
    {
        return $this->render('news/index.html.twig');
    }

    #[Route('/actualites/{slug}', name: 'app_news_show')]
    public function show(string $slug): Response
    {
        if (!isset($this->articles[$slug])) {
            throw $this->createNotFoundException("Cet article n'existe pas.");
        }

        return $this->render('news/show.html.twig', [
            'article' => $this->articles[$slug]
        ]);
    }
}
