<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;

class CustomerGroup extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

     /**
     * Get the customers for the group.
     */
    public function customers()
    {
        return $this->hasMany(Customer::class);
    }
}
