<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Puchase;

class Customer extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'guardian_name',
        'deposit',
        'amount left',
        'amount used',
        'give_leftover',
    ];

    /**
     * Get the purchases for the customer.
     */
    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }
}
