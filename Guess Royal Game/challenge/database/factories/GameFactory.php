<?php

namespace Database\Factories;

use App\Models\User;
use Random\RandomException;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     * @throws RandomException
     */
    public function definition(): array
    {
        return [
            'secret' => random_int(1, 255),
            'history' => [1,2,3],
            'result' => 'losser',
            'user_name' => User::factory(),
            'rules' => ['minRange' => 1, 'maxRange' => 255, 'maxAttempts' => 10],
        ];
    }
}
