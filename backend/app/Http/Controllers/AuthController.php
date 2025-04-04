<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        try {
            $request->validate([
                'full_name' => 'required|string|max:50',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);
            $user = new User;
            $user->full_name = $request["full_name"];
            $user->email = $request["email"];
            $user->password = bcrypt($request["password"]);
            $user->save();
            $user->token = Auth::login($user);

            return responseMessage(
                true,
                200,
                "Signup successfully, Welcome " . $user->full_name,
                $user
            );
        } catch (\Throwable $e) {
            return responseMessage(
                false,
                401,
                $e->getMessage()
            );
        }
    }

    public function login(Request $request)
    {
        try {
            $credentials = [
                "email" => $request["email"],
                "password" => $request["password"]
            ];
            if (!$token = Auth::attempt($credentials)) {
                return responseMessage(
                    false,
                    401,
                    "Email or password not correct"
                );

            }
            $user = Auth::user();
            $user->token = $token;

            return responseMessage(
                true,
                200,
                "Login successfully, Welcome " . $user->full_name,
                $user
            );
        } catch (\Throwable $e) {
            return responseMessage(
                false,
                401,
                $e->getMessage()
            );
        }
    }
}
