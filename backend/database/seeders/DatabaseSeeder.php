<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\JobStatus;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'Admin'], ['description' => 'Garage Manager']);
        $mechanicRole = Role::firstOrCreate(['name' => 'Mechanic'], ['description' => 'Mechanic user']);
        $customerRole = Role::firstOrCreate(['name' => 'Customer'], ['description' => 'Customer user']);

        foreach (['Received','In Progress','Awaiting Parts','Completed'] as $statusName) {
            JobStatus::firstOrCreate(['name' => $statusName]);
        }

        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@example.com',
                'password' => 'password',
                'role_id' => $adminRole->id,
            ]);
        }

        // Seed three mechanics with unique profiles
        $mechanics = [
            [
                'name' => 'John Doe',
                'username' => 'john_mechanic',
                'email' => 'john.mechanic@example.com',
            ],
            [
                'name' => 'Sarah Smith',
                'username' => 'sarah_mechanic',
                'email' => 'sarah.mechanic@example.com',
            ],
            [
                'name' => 'Alex Brown',
                'username' => 'alex_mechanic',
                'email' => 'alex.mechanic@example.com',
            ],
        ];

        foreach ($mechanics as $m) {
            if (!User::where('email', $m['email'])->exists() && !User::where('username', $m['username'])->exists()) {
                User::create([
                    'name' => $m['name'],
                    'username' => $m['username'],
                    'email' => $m['email'],
                    'password' => 'password',
                    'role_id' => $mechanicRole->id,
                ]);
            }
        }
    }
}
