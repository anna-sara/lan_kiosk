<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerController;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/dashboard', [CustomerController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/customer/{id}', [CustomerController::class, 'show'])->middleware(['auth', 'verified']);

Route::get('/form', function () {
    return Inertia::render('Form');
})->name('form');

Route::get('/thankyou', function () {
    return Inertia::render('Thankyou');
})->name('thankyou');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
