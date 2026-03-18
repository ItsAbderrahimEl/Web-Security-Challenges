<?php

namespace App\Http\Requests;

use Random\RandomException;
use Illuminate\Foundation\Http\FormRequest;

class SetupGameRequest extends FormRequest
{
    public function rules(): array
    {
        $username = $this->host() === env('APP_VHOST_URL') ? "required" : "nullable";

        return [
            'minRange' => 'required|numeric|integer|min:1|max:255',
            'maxRange' => 'required|numeric|integer|min:2|max:255|gt:minRange',
            'maxAttempts' => 'required|numeric|integer|min:1|max:255',
            'username' => $username."|string|max:150|min:3",
        ];
    }

    /**
     * @throws RandomException
     */
    protected function passedValidation(): void
    {
        $this->merge([
            'minRange' => (int) $this->minRange,
            'maxRange' => (int) $this->maxRange,
            'maxAttempts' => (int) $this->maxAttempts
        ]);

        $this->merge([
            'random_secret' => random_int($this->minRange, $this->maxRange)
        ]);
    }
}
