<?php

namespace App\Http\Controllers;

use App\Models\Deposit;
use App\Models\Customer;
use Illuminate\Http\Request;

class DepositController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $deposits = Deposit::get();
        return $deposits->toJson();
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
        $request->validate([
            'customer_id' => 'required',
            'deposit' => 'required',
            //'give_leftover' => 'nullable'
        ]);

        if ($request->manual_deposit === 1) {
             $customer = Customer::where('id',$request->customer_id)->first();
        } else {
             $customer = Customer::where('lan_id',$request->customer_id)->first();
        }
       

        Deposit::create([
            'customer_id' => $customer->id,
            'amount' => $request->deposit,
        ]);

        

        if ($customer->is_in_group ) {
            $groupCustomer = Customer::where('customer_group_id', $customer->customer_group_id)->where('is_in_group', 0)->first();
            $groupCustomer->deposit += $request->deposit;
            $groupCustomer->amount_left += $request->deposit;
            //$groupCustomer->give_leftover = $request->give_leftover;
            $groupCustomer->save();
            $customer->deposit = 0;
            $customer->save();

            if ($request->manual_deposit === 1) {
                return redirect('customer/' . $request->customer_id);
            } 
            return response()->json([
                'success' => true, 'message' => 'Deposit added successfully'
            ]);
           

        } else {
            $customer->deposit = $customer->deposit + $request->deposit;
            $customer->amount_left = $customer->amount_left + $request->deposit;
            //$customer->give_leftover = $request->give_leftover;
            $customer->save();

            if ($request->manual_deposit === 1) {
                return redirect('customer/' . $request->customer_id);
            } 
            return response()->json([
                'success' => true, 'message' => 'Deposit added successfully'
            ]);
        }
       
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
        $deposit = Deposit::findOrFail( $id );
        $customer = Customer::where('id', $deposit->customer_id);
        $customer->amount_left =  $customer->amount_left + $deposit->amount;
        $customer->amount_used =  $customer->amount_used - $deposit->amount;
        $customer->save();
        $deposit->delete();
    
        return response()->json([
            'success' => true, 'message' => 'Deposit deleted successfully'
        ]);
    }
}
