<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Puchase;
use App\Models\Deposit;

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
        'amount left',
        'amount used',
        'deposit',
        'give_leftover',
        'comment'
    ];

    /**
     * Get the purchases for the customer.
     */
    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    /**
     * Get the deposit for the customer.
     */
    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }
}
