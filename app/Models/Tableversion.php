<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tableversion extends Model
{
    protected $fillable = [
       'table',
       'version'
    ];
}
