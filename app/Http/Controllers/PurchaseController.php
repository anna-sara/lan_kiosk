<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Illuminate\Http\Request;
use App\Models\Customer;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $purchases = Purchase::get();
        return $purchases->toJson();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => 'required',
            'amount' => 'nullable',
        ]);

        Purchase::create([
            'customer_id' => $data['customer_id'],
            'amount' => $data['amount'],
        ]);

        $customer = Customer::findOrFail( $data['customer_id'] );
        $customer->amount_left =  $customer->amount_left - $data['amount'];
        $customer->save();

        return redirect('customer/' . $customer->id);
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $purchase = Purchase::findOrFail( $id );
        $customer = Customer::where('id', $purchase->customer_id);
        $customer->amount_left =  $customer->amount_left + $purchase->amount;
        $customer->amount_used =  $customer->amount_used - $purchase->amount;
        $customer->save();
        $purchase->delete();
    
        return response()->json([
            'success' => true, 'message' => 'Purchase deleted successfully'
        ]);
    }
}
