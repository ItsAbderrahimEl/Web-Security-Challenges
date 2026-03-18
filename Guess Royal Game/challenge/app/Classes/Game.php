<?php

namespace App\Classes;

use Illuminate\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Response;

class Game
{
    protected string $mode = '';
    protected string $view = '';

    public function index(): View
    {
        return view($this->view);
    }

    protected function setup($request): void
    {
        $options = [
            'history' => [],
            'rules' => [
                'minRange' => $request->input('minRange'),
                'maxRange' => $request->input('maxRange'),
                'maxAttempts' => $request->input('maxAttempts')
            ],
            'secret' => $request->input('random_secret'),
        ];

        $this->mode === "session"
            ? Session::put('game', $options)
            : auth()->user()->games()->create($options);
    }

    protected function hint($guess, $game): string
    {
        if ($guess == $game->secret) return 'equal';

        return $guess > $game->secret ? 'greater' : 'lower';
    }

    protected function reachedMaxAttempts($game): bool
    {
        return count($game->history) === $game->rules['maxAttempts'];
    }

    protected function created(): JsonResponse
    {
        return Response::json(['Game Created' => true]);
    }

    protected function resolve($game, $guess): JsonResponse
    {
        $guessed = $game->secret === $guess;

        if ($this->mode === 'database' && $guessed) {
            $game->update(['result' => 'winner']);
        }

        return Response::json([
            'guessed' => $guessed,
            'is' => $this->hint($guess, $game),
            'value' => ($guessed or $this->reachedMaxAttempts($game)) ? $game->secret : NULL
        ]);
    }

    protected function record($guess, $game = NULL): void
    {
        if ($this->mode === "session") {
            Session::push('game.history', $guess);
            return;
        }

        $history = $game->history;
        $history[] = $guess;

        $game->update(['history' => $history]);
    }
}
