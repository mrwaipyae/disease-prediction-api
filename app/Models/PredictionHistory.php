<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PredictionHistory extends Model
{
    protected $fillable = [
        'user_id',  // Foreign key to User model
        'symptoms',
        'predicted_disease',
        'confidence',
        'predicted_at'
    ];

    protected $casts = [
        'symptoms' => 'array',  // Auto-decode JSON
        'predicted_at' => 'datetime',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

