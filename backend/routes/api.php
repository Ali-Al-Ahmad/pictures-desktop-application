<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::group(["prefix" => "v0.1"], function () {

    Route::group(["prefix" => "auth"], function () {
        Route::post('/signup', [AuthController::class, "signup"]);
        Route::post('/login', [AuthController::class, "login"]);


    });

    Route::group(["middleware" => "auth:api"], function () {
        Route::post('/logout', [AuthController::class, "logout"]);

    });
});
