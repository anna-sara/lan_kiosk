<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\Purchase;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::orderBy('name', 'asc')->get();
        return Inertia::render('Dashboard', ['customers' => $customers]);
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
            'name' => 'required',
            'guardian_name' => 'required',
            'give_leftover' => 'nullable',
        ]);

        Customer::create([
            'name' => $request->name,
            'guardian_name' => $request->guardian_name,
            'give_leftover' => $request->give_leftover,
        ]);

        return redirect(route('thankyou', absolute: false));
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $customer = Customer::with('purchases')->with('deposits')->findOrFail($id);

        return Inertia::render('Customer', ['customer' => $customer]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customers $customers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateDeposit(Request $request, $id)
    {
        $request->validate([
            'deposit' => 'required',
        ]);
        
        $customer = Customer::findOrFail($id);

        $customer->deposit = $customer->deposit + $request->deposit;
        $customer->amount_left = $customer->amount_left + $request->deposit;
        $customer->save();
        
        return redirect('customer/' . $customer->id);
    }

     /**
     * Update the specified resource in storage.
     */
    public function updateComment(Request $request)
    {
        $request->validate([
            'customer_id' => 'required',
            'comment' => 'required',
        ]);
        
        $customer = Customer::findOrFail($request->customer_id);

        $customer->comment = $request->comment;
        $customer->save();
        
        return redirect('customer/' . $customer->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $customer = Customer::findOrFail( $id );
        $customer->delete();
    
        return response()->json([
            'success' => true, 'message' => 'Customer deleted successfully'
        ]);
    }
}
