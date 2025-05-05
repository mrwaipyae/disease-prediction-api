<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Disease extends Model
{
    public function symptoms()
    {
        return $this->belongsToMany(Symptom::class)->withPivot('weight');
    }
}
