<?php

namespace App\Http\Controllers;

use App\Models\CustomerGroup;
use App\Models\Customer;
use App\Models\Deposit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $groups = CustomerGroup::with('customers')->get();
        $customers = Customer::whereNull('customer_group_id')->where('is_in_group', false)->orderBy('name', 'asc')->get();

        return Inertia::render('CustomerGroups', ['groups' => $groups, 'customers' => $customers]);
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
            'group_name' => 'required',
            'customers' => 'required',
        ]);

        $customers = $request->customers;
        
        $guardian_name = Customer::where('id', (int) $customers[0])->pluck('guardian_name');

        $customerGroup = CustomerGroup::create([
            'name' => $request->group_name,
        ]);


        $groupCustomer = Customer::create([
            'name' => $request->group_name,
            'guardian_name' => $guardian_name[0],
            'is_in_group' => false,
            'customer_group_id' => $customerGroup->id
        ]);

        $groupAmount= 0;

        foreach ($customers as $customerItem) {
            $customer = Customer::findOrFail($customerItem);
            $customer->customer_group_id = $customerGroup->id;
            $customer->is_in_group = 1;
            $groupAmount += $customer->deposit;
            $customer->deposit = 0;
            $customer->save();
        }

        Deposit::create([
            'customer_id' => $groupCustomer->id,
            'amount' => $groupAmount,
        ]);

        $groupCustomer->amount_left = $groupAmount;
        $groupCustomer->deposit = $groupAmount;
        $groupCustomer->save();
        
        return redirect('customer-groups/');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomerGroup $customerGroup)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CustomerGroup $customerGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id, Request $request)
    {

        $request->validate([
            'customers' => 'required',
        ]);

        $customers = $request->customers;
        $groupCustomer = Customer::where('customer_group_id', $id)->where('is_in_group', 0)->first();

        foreach ($customers as $customerItem) {
            $customer = Customer::findOrFail($customerItem);
            $groupCustomer->deposit += $customer->deposit;
            $groupCustomer->amount_left += $customer->deposit;
            $groupCustomer->save();
            $customer->customer_group_id = $id;
            $customer->is_in_group = 1;
            $customer->deposit = 0;
            $customer->save();
        }
        
       return response()->json([
            'success' => true, 'message' => 'Customer group was updated'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $group = CustomerGroup::findOrFail( $id );
        $customerGroup = Customer::where('customer_group_id', $group->id);
        $customerGroup->delete();
        $group->delete();
    
        return response()->json([
            'success' => true, 'message' => 'Customer group deleted successfully'
        ]);
    }
}
