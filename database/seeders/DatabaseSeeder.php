<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
    
    public function run(): void
    {

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        //     'role'=>'user'
        // ]);
        // $this->call(AdminSeeder::class);

        User::create([
            'name' => 'Admin2',
            'email' => 'admin2@example.com', // Make sure it's unique
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

    }
}




