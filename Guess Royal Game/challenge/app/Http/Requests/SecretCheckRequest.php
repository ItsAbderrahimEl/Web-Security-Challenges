<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SecretCheckRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'guess' => 'required|numeric|integer|min:1|max:255'
        ];
    }

    protected function passedValidation(): void
    {
        $this->merge([
           'guess' => (int) $this->guess
        ]);
    }
}
