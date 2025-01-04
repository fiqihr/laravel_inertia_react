<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/todo', [TodoController::class, 'index'])->name('todo.index');
    Route::post('todo', [TodoController::class, 'store'])->name('todo.store');
    Route::get('/todo/edit/{todo}', [TodoController::class, 'edit'])->name('todo.edit');
    Route::patch('/todo/edit/{todo}', [TodoController::class, 'update'])->name('todo.update');
    Route::patch('/todo/edit-complete/{todo}', [TodoController::class, 'updateComplete'])->name('todo.updateComplete');
});

Route::get('/users', [UserController::class, 'index'])->name('users.index');

require __DIR__ . '/auth.php';