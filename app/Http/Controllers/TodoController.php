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
        $data = $request->validate(
            [
                'name' => 'required | min:3',
                'is_completed' => 'boolean'
            ],
            [
                'name.required' => 'Nama todo harus diisi',
                'name.min' => 'Nama todo minimal 3 karakter bro'
            ]
        );
        Todo::create($data);
        return back()->with('message', 'Todo berhasil ditambahkan');
    }
}