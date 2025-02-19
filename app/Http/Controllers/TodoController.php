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
        return Inertia::render('Todo', [
            'todos' => Todo::latest()->paginate(2)
        ]);
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

    public function edit(Todo $todo)
    {
        return Inertia::render('Edit', [
            'todo' => $todo,
        ]);
    }

    public function update(Request $request, Todo $todo)
    {
        $data = $request->validate([
            'name' => 'required | min:3',
        ]);
        $todo->update($data);
        return redirect(route('todo.index'))->with('message', 'Todo berhasil diubah');
    }

    public function updateComplete(Request $request, Todo $todo)
    {
        $data = $request->validate([
            'is_complete' => 'boolean',
        ]);
        $todo->update($data);
        return back()->with('message', 'Todo berhasil diubah');
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();
        return back()->with('message', 'Todo berhasil dihapus');
    }
}