<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index()
    {
        // return ke halaman Todo.jsx, buat di route nya juga.
        return Inertia::render('Todo');
    }
}
