<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    /**
     * Anyone may submit the public contact form.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for an incoming contact message.
     */
    public function rules(): array
    {
        return [
            'name'    => ['required', 'string', 'max:120'],
            'email'   => ['required', 'email', 'max:180'],
            'message' => ['required', 'string', 'min:5', 'max:5000'],
        ];
    }

    /**
     * Friendly, human-readable validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required'    => 'Please tell me your name.',
            'email.required'   => 'An email is required so I can reply.',
            'email.email'      => 'That doesn’t look like a valid email.',
            'message.required' => 'Don’t forget to write a message!',
            'message.min'      => 'Your message is a little too short.',
        ];
    }
}
