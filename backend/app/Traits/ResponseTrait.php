<?php

namespace App\Traits;

use illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

trait ResponseTrait
{
    public function returnResponse($success, $message, $data = null, $code = null)
    {
        if (!$code) {
            $code = $success ? 200 : 500;
        }

        return response()->json([
            "success" => $success,
            "message" => $message,
            "data" => $data
        ], $code);
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->returnResponse(
                false,
                "Failed Validation",
                $validator->errors(),
                422
            )
        );
    }
}
