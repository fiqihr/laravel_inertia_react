<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# laravel inertia react

sepertinya sangat menarik, jadi ini saya coba.<br>

ini link playlist nya.<br>
<a href="https://youtube.com/playlist?list=PLxzARwISlmzgO74VI9Yva7sxbUhJJ56yW&si=hkpyw_dB4bWBVIqt">Link Playlist</a><br>

penjelasan inertia silahkan lihat ke docs nya langsung.<br>

<a href="https://inertiajs.com/">dokumentasi inertia</a>

jadi intinya, dengan inertia kita bisa install javascript seperti react,vue dll sebagai client nya. sedangkan server side nya pake laravel.<br>

<details>
<summary><h2>inisialisasi project</h2></summary>

install laravel seperti biasa.<br>

```
laravel new laravel_inertia_react
```

selanjutnya install laravel breeze sebagai starter kit nya. <br>
<a href="https://laravel.com/docs/11.x/starter-kits#laravel-breeze-installation">breeze docs</a>

```
composer require laravel/breeze --dev
php artisan breeze:install
```

breeze stack nya pilih react.<br>
optional features pilih none.<br>
testing framework pilih 0(PHPUnit).<br>
<br>
selanjutnya setup .env nya atur database pake mysql dan buat database nya.<br>
lalu:<br>

```
php artisan migrate
```

jalankan project seperti biasa.<br>

```
php artisan serve
```

```
npm run dev
```

</details>

<details>
<summary><h2>layouts</h2></summary>

jadi disini coba buat layouts baru, dan layouts yang lama di hapus saja.<br>
lokasinya di resources/js/layouts/AdminLayout.jsx. <br>
<br>
selanjutnya buat controller yaitu TodoController. dan buat file views nya juga di resources/js/Pages/Todo.jsx. Route nya juga di buat, jangan lupa<br>

TodoController.php

```
public function index()
{
    // return ke halaman Todo.jsx, buat di route nya juga.
    return Inertia::render('Todo');
}
```

route nya<br>

```
Route::get('/todo', [TodoController::class, 'index'])->name('todo.index');
```

lalu ada penyesuaian juga di AdminLayout seperti react js pada umumnya, seperti component, props.<br>

ohiya, di AdminLayout untuk href nya seperti ini, pake Link yang di gunakan di react. <br>

```
<div className="flex gap-6 items-center justify-start">
  <Link
      href="dashboard"
      className={`${
          component == "Dashboard"
              ? "text-indigo-500"
              : ""
      }`}
  >
      Dashboard
  </Link>
  <Link
      href="todo"
      className={`${
          component == "Todo"
              ? "text-indigo-500"
              : ""
      }`}
  >
      Todo
  </Link>
</div>
```

</details>

<details>
<summary><h2>shared data</h2></summary>
jadi sebelumnya kan halaman login error karena kita sudah mengganti layout nya, sekarang perbaiki dulu.<br>
bikin file di layouts/GeneralLayout.jsx untuk mengganti GuesLayout bawaan dari breeze.<br>

```
import React from "react";
const GeneralLayout = ({ children }) => {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center">
            {children}
        </section>
    );
};
export default GeneralLayout;

```

sehingga ada penyesuaian di Login.jsx dan Register.jsx, yang sebelumnya menggunakan GuestLayout sekarang diganti jadi menggunakan GeneralLayout.<br>
<br>
selanjutnya coba kita akan menampilkan nama user yang sedang login di pojok kanan atas, yang sebelumnya masih static. <br>
bagaimana caranya? <br>
jadi inertia memiliki file yang lokasi nya di app\Http\Middleware\HandleInertiaRequests.php. <br>
<br>
isinya seperti ini:<br>

```
public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
        ];
    }
```

disitu tertulis auth user. yang berarti user yang sedang login. <br>
kita bisa memanggilnya di AdminLayout.jsx.<br>

```
...
const { auth } = usePage().props;
...
return(
  ...
  <div>{auth.user.name}</div>
  ...
)
```

sehingga nanti akan muncul nama user yang sedang login.

</details>

<details>
<summary><h2>insert data & flash message</h2></summary>
oke kita akan coba insert data.<br>
bikin dulu model dan migration nya untuk tabel todo.<br>

```
php artisan make:model Todo -m
   INFO  Model [D:\Programming\Laravel\laravel-inertia-react\app\Models\Todo.php] created successfully.
   INFO  Migration [D:\Programming\Laravel\laravel-inertia-react\database\migrations/2025_01_02_085209_create_todos_table.php] created successfully.
```

lalu migrasi kan. <br>

```
$ php artisan migrate
   INFO  Running migrations.
  2025_01_02_085209_create_todos_table ...................................... 34.57ms DONE
```

ini untuk route nya. <br>
kita masukkan route todo nya ke dalam middleware, agar hanya orang yang sudah login yang bisa CRUD. <br>

```
Route::middleware('auth')->group(function () {
  ...
  Route::get('/todo', [TodoController::class, 'index'])->name('todo.index');
  Route::post('todo', [TodoController::class, 'store'])->name('todo.store');
});
```

lalu pergi ke Todo.jsx. <br>
kita bikin function untuk input form dan untuk store. <br>

```
const { data, setData, post } = useForm({
    name: "",
});

const storeTodo = (e) => {
    e.preventDefault();
    router.post("/todo", data, {
        onSuccess: () => {
            reset();
        },
    });
};
```

ini untuk form nya. <br>

```
<form onSubmit={storeTodo}>
    <div className="flex gap-4 items-center mb-6">
        <input
            type="text"
            placeholder="Enter todo here"
            className="px-4 py-2 rounded-md grow"
            onChange={(e) => setData("name", e.target.value)}
            value={data.name}/>
        <button
            type="submit"
            className="py-2 px-4 rounded-md bg-indigo-500 text-white">
            Save
        </button>
    </div>
</form>
```

di controller nya juga di buat untuk store nya. <br>

```
public function store(Request $request)
{
    $data = $request->validate([
        'name' => 'required',
        'is_completed' => 'boolean'
    ]);
    Todo::create($data);
    return back()->with('message', 'Todo berhasil ditambahkan');
}
```

coba kita bikin flashmessage nya. <br>
pergi ke HandleInertiaRequests.php. <br>
tambahkan untuk flash di bawah auth. <br>

```
public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
            ]
        ];
    }
```

di Todo.jsx panggil flashmessage nya. <br>
usePage() itu dari inertia nya. <br>

```
const { flash } = usePage().props;
...
...
return(
    ...
    {flash.message && (
        <div className="py-2 px-4 rounded-md bg-green-300 text-center mb-6">
            {flash.message}
        </div>
    )}
    ...
)
```

</details>
