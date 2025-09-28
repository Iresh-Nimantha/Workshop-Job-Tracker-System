<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Swagger UI route alias
Route::get('/api/docs', function () {
    return redirect('/api/documentation');
});

require __DIR__.'/auth.php';
