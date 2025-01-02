<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // ini adalah untuk me return ke jsx menggunakan inertia
        return Inertia::render('Users', ['status' => 'OK']);
    }
}
