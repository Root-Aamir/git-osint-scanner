<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
use App\Http\Controllers\RepositoryController;

Route::post('/repos', [RepositoryController::class, 'store']);
Route::get('/repos/{id}/logs', [RepositoryController::class, 'getLogs']);