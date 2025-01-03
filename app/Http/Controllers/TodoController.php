<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index()
    {
        // return ke halaman Todo.jsx, buat di route nya juga.
        return Inertia::render('Todo');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'is_completed' => 'boolean'
        ]);
        Todo::create($data);
        return back()->with('message', 'Todo berhasil ditambahkan');
    }
}