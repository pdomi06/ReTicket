<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Minimal named login route to avoid RouteNotFoundException when
// unauthenticated requests trigger redirects to the `login` route.
Route::get('/login', function () {
    return redirect('/');
})->name('login');
