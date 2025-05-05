<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Symptom extends Model
{
    public function diseases()
    {
        return $this->belongsToMany(Disease::class)->withPivot('weight');
    }
}
