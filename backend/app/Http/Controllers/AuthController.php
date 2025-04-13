<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        try {

            $result = AuthService::signup($request->validated());
            return $this->returnResponse(
                $result['success'],
                $result['message'],
                $result['data']
            );

        } catch (\Throwable $e) {
            return $this->returnResponse(
                false,
                $e->getMessage()
            );
        }
    }

    public function login(LoginRequest $request)
    {
        try {

            $result = AuthService::login($request->validated());
            return $this->returnResponse(
                $result['success'],
                $result['message'],
                $result['data']
            );

        } catch (\Throwable $e) {
            return $this->returnResponse(
                false,
                $e->getMessage()
            );
        }
    }

    public function logout()
    {
        try {

            $result = AuthService::logout();
            return $this->returnResponse(
                $result['success'],
                $result['message']
            );

        } catch (\Throwable $e) {
            return $this->returnResponse(
                false,
                $e->getMessage()
            );
        }
    }
}
