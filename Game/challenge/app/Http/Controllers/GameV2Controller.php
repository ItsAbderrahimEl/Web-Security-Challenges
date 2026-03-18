<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use Random\RandomException;
use Illuminate\Http\JsonResponse;
use App\Classes\Game as GameParent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\SetupGameRequest;
use Illuminate\Support\Facades\Response;
use App\Http\Requests\SecretCheckRequest;
use Illuminate\Container\Attributes\CurrentUser;

class GameV2Controller extends GameParent
{
    public function __construct()
    {
        $this->mode = 'database';
        $this->view = 'GameV2.index';
    }

    /**
     * @throws RandomException
     */
    public function store(SetupGameRequest $request): JsonResponse
    {
        $this->registerAndLogin($request->input('username'));

        $this->setup($request);

        return $this->created();
    }

    public function secretCheck(SecretCheckRequest $request): JsonResponse
    {
        $guess = $request->input('guess');

        $game = $request->user()->game;

        $this->record($guess, $game);

        $game->refresh();

        return $this->resolve($game, $guess);
    }

    public function history(#[CurrentUser] User $user): JsonResponse
    {
        return Response::json(
            Game::whereRaw("user_name = '{$user->name}'")->get()
        );
    }

    protected function registerAndLogin($username): void
    {
        Auth::login(
            User::firstOrCreate([
                'name' => $username
            ])
        );
    }
}

