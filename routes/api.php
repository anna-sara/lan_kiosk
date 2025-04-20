<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PurchaseController;

Route::post('register_customer', [CustomerController::class, 'store'])->name('register_customer');
Route::post('register_purchase', [PurchaseController::class, 'store'])->name('register_purchase');
Route::post('register_deposit/{id}', [CustomerController::class, 'updateDeposit']);