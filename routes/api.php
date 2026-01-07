<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerGroupController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\DepositController;
use App\Http\Middleware\ApiToken;

Route::post('register_customer', [CustomerController::class, 'store'])->name('register_customer');

Route::middleware('auth:sanctum')->group(function () {
    //Route::post('register_deposit', [DepositController::class, 'store'])->name('register_deposit');
    Route::post('update_comment', [CustomerController::class, 'updateComment'])->name('update_comment');
    Route::post('register_purchase', [PurchaseController::class, 'store'])->name('register_purchase'); 
    Route::post('customer-group', [CustomerGroupController::class, 'store'])->name('register_customer_group'); 
    Route::post('add-to-customer-group/{id}', [CustomerGroupController::class, 'update'])->name('add_to_customer_group'); 
    Route::delete('customer-group/{id}', [CustomerGroupController::class, 'destroy'])->name('delete_customer_group'); 
    Route::delete('customer/{id}', [CustomerController::class, 'destroy'])->name('delete_customer'); 
    Route::put('customer/{id}', [CustomerController::class, 'edit'])->name('edit_customer'); 
});

Route::post('register_deposit', [DepositController::class, 'store'])->name('register_deposit')->middleware([ApiToken::class]);
