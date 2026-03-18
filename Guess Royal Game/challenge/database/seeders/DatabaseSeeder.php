<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // To make the flag dynamic, replace the insert statement with:
        // 'value' => 'HTB{' . Str::random(20) . '}',
        //
        // The Str class is already imported, so no additional imports are needed.
        // This will generate a new 20-character random string each time the seeder
        // is executed by the deploy.sh script.

        DB::table('flags')->insert([
            'value' => 'HTB{ThE_GuEss_ROyAl_MAstEr}',
        ]);
    }
}
