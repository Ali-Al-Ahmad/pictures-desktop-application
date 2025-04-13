<?php

namespace App\Http\Requests;

use App\Traits\ResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class SignupRequest extends FormRequest
{
    use ResponseTrait;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'full_name' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',

        ];
    }

    public function messages(): array
    {
        return [
            "full_name.required" => "Your :attribute is required!",
            "email.required" => "Your :attribute is required!",
            "password.required" => "Your :attribute is required!",

        ];
    }

    public function attributes(): array
    {
        return [
            "full_name" => "Full Name",
            "email" => "Email Address",
        ];
    }
}
