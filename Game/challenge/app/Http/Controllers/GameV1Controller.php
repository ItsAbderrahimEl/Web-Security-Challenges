<?php

namespace App\Http\Controllers;

use App\Classes\Game;
use Illuminate\Support\Fluent;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\SetupGameRequest;
use Illuminate\Support\Facades\Session;
use App\Http\Requests\SecretCheckRequest;

class GameV1Controller extends Game
{
    public function __construct()
    {
        $this->mode = 'session';
        $this->view = 'GameV1.index';
    }

    public function store(SetupGameRequest $request): JsonResponse
    {
        $this->setup($request);

        return $this->created();
    }

    public function secretCheck(SecretCheckRequest $request): JsonResponse
    {
        $guess = $request->input('guess');

        $this->record($guess);

        return $this->resolve(
            (object) Session::get('game'), $guess
        );
    }
}
