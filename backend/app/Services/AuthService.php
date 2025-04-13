<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService extends Service
{
    public static function signup($request)
    {
        try {
            $user = new User();
            $user->full_name = $request["full_name"];
            $user->email = $request["email"];
            $user->password = bcrypt($request["password"]);
            $user->save();
            $user->token = Auth::login($user);

            return self::return(
                true,
                "Signup successfully",
                $user
            );

        } catch (\Throwable $e) {
            return self::return(
                false,
                $e->getMessage()
            );
        }
    }

    public static function login($request)
    {
        try {
            $credentials = [
                "email" => $request["email"],
                "password" => $request["password"]
            ];
            if (!$token = Auth::attempt($credentials)) {
                return self::return(
                    false,
                    "Email or Password not correct"
                );

            }
            $user = Auth::user();
            $user->token = $token;

            return self::return(
                true,
                "Login successfully",
                $user
            );

        } catch (\Throwable $e) {
            return self::return(
                "false",
                $e->getMessage()
            );
        }
    }

    public static function logout()
    {
        try {
            Auth::logout();
            return self::return(
                true,
                "Logout successfully"
            );


        } catch (\Throwable $e) {
            return self::return(
                false,
                $e->getMessage()
            );
        }
    }
}
