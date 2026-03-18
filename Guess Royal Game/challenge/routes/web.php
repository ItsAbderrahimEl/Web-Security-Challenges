<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameV1Controller;
use App\Http\Controllers\GameV2Controller;

Route::domain(env('APP_VHOST_URL'))->group(function () {
    Route::controller(GameV2Controller::class)->name('game.v2.')->group(function () {
        Route::get('/', 'index')->name('show');
        Route::get('/game/store', 'store')->name('store');
        Route::get('/secret/check', 'secretCheck')->name('secret.check');
        Route::get('/games/history', 'history')->name('games.history');
    });
});

Route::controller(GameV1Controller::class)->name('game.')->group(function () {
    Route::get('/', 'index')->name('show');
    Route::get('/game/store', 'store')->name('store');
    Route::get('/secret/check', 'secretCheck')->name('secret.check');
});
