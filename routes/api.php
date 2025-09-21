<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\DepositController;

Route::post('register_customer', [CustomerController::class, 'store'])->name('register_customer');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('register_deposit', [DepositController::class, 'store'])->name('register_deposit');
    Route::post('update_comment', [CustomerController::class, 'updateComment'])->name('update_comment');
    Route::post('register_purchase', [PurchaseController::class, 'store'])->name('register_purchase'); 
    Route::delete('customer/{id}', [CustomerController::class, 'destroy'])->name('delete_customer'); 
});
