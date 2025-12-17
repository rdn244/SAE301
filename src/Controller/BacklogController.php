<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class BacklogController extends AbstractController
{
    #[Route('/admin', name: 'app_admin_login')]
    public function login(Request $request): Response
    {
        if ($request->getSession()->get('is_admin')) {
            return $this->redirectToRoute('app_backlog');
        }

        if ($request->isMethod('POST')) {
            if ($request->request->get('password') === 'opale2025') {
                $request->getSession()->set('is_admin', true);
                return $this->redirectToRoute('app_backlog');
            }
        }

        return $this->render('backlog/login.html.twig');
    }

    #[Route('/admin/logout', name: 'app_admin_logout')]
    public function logout(Request $request): Response
    {
        $request->getSession()->remove('is_admin');
        return $this->redirectToRoute('app_admin_login');
    }

    #[Route('/backlog', name: 'app_backlog')]
    public function index(Request $request): Response
    {
        if (!$request->getSession()->get('is_admin')) {
            return $this->redirectToRoute('app_admin_login');
        }

        // DONNÉES FICTIVES (Statiques)
        $appointments = [
            1 => [
                'client' => 'Zyed Brahimi',
                'service' => 'Audit dressing',
                'time' => '9h',
                'type' => 'audit',
                'email' => 'zyed.brahimi@email.com',
                'address' => '12 Rue de la Paix, 75002 Paris',
                'stylist' => 'Chris'
            ],
            3 => [
                'client' => 'Cassy Bernard',
                'service' => 'Personnal shopping',
                'time' => '14h',
                'type' => 'shopping',
                'email' => 'cassy.b@music.com',
                'address' => '41 Bd Ney, 75018 Paris',
                'stylist' => 'Alex'
            ],
            13 => [
                'client' => 'Karim Benzema',
                'service' => 'All inclusive',
                'time' => '9h30',
                'type' => 'all_inclusive',
                'email' => 'kb9@real.com',
                'address' => 'Madrid, Espagne',
                'stylist' => 'Mike'
            ],
            15 => [
                'client' => 'Johnny Leclerc',
                'service' => 'All inclusive',
                'time' => '9h30',
                'type' => 'all_inclusive',
                'email' => 'johnny@rock.fr',
                'address' => 'Marnes-la-Coquette',
                'stylist' => 'Chris'
            ],
            18 => [
                'client' => 'Eric Judor',
                'service' => 'Audit dressing',
                'time' => '9h',
                'type' => 'audit',
                'email' => 'eric@ramzy.com',
                'address' => 'Tour Montparnasse, Paris',
                'stylist' => 'Alex'
            ],
            23 => [
                'client' => 'Yacine Sabri',
                'service' => 'Stylisme évenement',
                'time' => '15h',
                'type' => 'event',
                'email' => 'yacine@event.com',
                'address' => 'Le Marais, Paris',
                'stylist' => 'Mike'
            ],
            25 => [
                'client' => 'Zyed Brahimi',
                'service' => 'Audit dressing',
                'time' => '9h',
                'type' => 'audit',
                'email' => 'zyed@email.com',
                'address' => '12 Rue de la Paix, 75002 Paris',
                'stylist' => 'Chris'
            ]
        ];

        return $this->render('backlog/index.html.twig', [
            'appointments' => $appointments
        ]);
    }
}
