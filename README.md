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
<a href="https://youtube.com/playlist?list=PLxzARwISlmzgO74VI9Yva7sxbUhJJ56yW&si=hkpyw_dB4bWBVIqt">link playlist</a><br>

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

<details>
<summary><h2>display validation error message</h2></summary>

kita coba menampilkan validasi saat input kosong atau kurang dari 3 karakter. <br>
bikin di controller nya dulu. <br>

```
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
```

ini di Todo.jsx. <br>

```
...
const { flash, errors } = usePage().props;
...
return(
    ...
    {errors.name && (
        <p className="text-red-700 text-sm mt-2">
            {errors.name}
        </p>
    )}
    ...
)
```

selanjutnya kita coba install react icon, lihat saja di dokumentasi nya. <br>
<a href="https://react-icons.github.io/react-icons/">link dokumentasi react icons</a> <br>
<br>
lalu tambahkan juga pagination pake tailwindcss flowbite. ini dokumentasinya. <br>
<a href="https://flowbite.com/docs/components/pagination/">link dokumentasi pagination</a> <br>

bikin komponen baru di Components/Pagination.jsx. <br>
lalu panggil di Todo.jsx. <br>

</details>

<details>
<summary><h2>pagination</h2></summary>

di controller kita buat seperti ini, untuk menampilkan pagination. <br>

```
public function index()
    {
        // return ke halaman Todo.jsx, buat di route nya juga.
        return Inertia::render('Todo', [
            'todos' => Todo::latest()->paginate(2)
        ]);
    }
```

di Todo.jsx kita panggil pagination nya dan mengirimkan props todos. <br>

```
<div className="mt-8 flex justify-end items-center">
    <Pagination todos={todos} />
</div>
```

ini di Pagination.jsx. <br>

```
...
const Pagination = ({ todos }) => {
    const links = todos.links;
    const currentPage = todos.current_page;
    const lastPage = todos.last_page;
    ...
    return(
        ...
        {links.map((link, i) => {
            return (
                <li key={i}>
                    <Link
                        href={link.url}
                        className={`flex items-center justify-center px-4 h-10 leading-tight  bg-slate-900 hover:bg-slate-600 hover:text-gray-900 ${
                            link.active
                                ? "bg-slate-500 text-gray-900 border-slate-500"
                                : "bg-slate-900 text-gray-500 border-slate-900"
                        }
                        ${i == 0 && "rounded-s-md"} ${
                            i == links.length - 1 && "rounded-e-md"
                        }
                        ${i == 0 && currentPage == 1 && "hidden"}
                        ${
                            currentPage == lastPage &&
                            i == links.length - 1 &&
                            "hidden"
                        }`}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    </Link>
                </li>
            );
        })}
        ...
    )
```

</details>

<details>
<summary><h2>update data</h2></summary>

buat file baru Edit.jsx. <br>
lalu bikin route juga. <br>

```
Route::get('/todo/edit/{todo}', [TodoController::class, 'edit'])->name('todo.edit');
Route::patch('/todo/edit/{todo}', [TodoController::class, 'update'])->name('todo.update');
```

ini controller nya. <br>

```
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
```

di Todo.jsx pada tombol edit kita arahkan ke Edit.jsx. <br>

```
<Link href={`todo/edit/${todo.id}`}>
    <BsPencilSquare size={20} />
</Link>{" "}
```

di Edit.jsx lihat saja kode untuk proses edit nya. <br>

</details>

<details>
<summary><h2>mark complete + react hot toast</h2></summary>
jadi nanti toastnya bisa di check dan di uncheck. <br>
kita buat onClick dulu di Todo.jsx. <br>

```
{todo.is_complete ? (
    <FaRegCircleXmark
        className="cursor-pointer text-red-600"
        size={20}
        onClick={() =>
            handleComplete(
                todo.id,
                todo.name,
                todo.is_complete
            )
        }
    />
) : (
    <FaRegCircleCheck
        className="cursor-pointer"
        size={20}
        onClick={() =>
            handleComplete(
                todo.id,
                todo.name,
                todo.is_complete
            )
        }
    />
)}
```

dan bikin function handleComplete di Todo.jsx juga. <br>

```
const handleComplete = (id, name, isComplete) => {
    let title = document.getElementById(id);
    title.innerText = "Processing...";
    router.patch(
        `/todo/edit-complete/${id}`,
        {
            is_complete: !isComplete,
        },
        {
            onSuccess: () => {
                title.innerText = name;
            },
        }
    );
};
```

tambahkan routenya. <br>

```
Route::patch('/todo/edit-complete/{todo}', [TodoController::class, 'updateComplete'])->name('todo.updateComplete');
```

di controller nya seperti ini. <br>

```
public function updateComplete(Request $request, Todo $todo)
    {
        $data = $request->validate([
            'is_complete' => 'boolean',
        ]);
        $todo->update($data);
        return back()->with('message', 'Todo berhasil diubah');
    }
```

selanjutnya kita akan mengganti flashmessage dengan toast. <br>
kita pake <a href="https://react-hot-toast.com/">react hot toast"></a> <br>
install dulu pake npm. baca dokumentasi. <br>
<br>
lalu ini di AdminLayout.jsx. <br>

```
import { Toaster } from "react-hot-toast";
...
<div>
    <Toaster />
</div>
```

lalu ini juga di Todo.jsx. <br>

```
import toast from "react-hot-toast";
...
useEffect(() => {
    flash.message && toast.success(flash.message);
}, [flash]);
```

</details>

<details>
<summary><h2>delete data</h2></summary>
sebelumnya, coba kita buat title nya dinamis dulu. <br>
jadi inertia memiliki komponen <Head title="..."/>
ini diletakkan di atas sendiri di komponen Layout. <br>
selanjutnya jika ingin mengubah app_name menjadi bukan laravel tinggal di ganti di .env nya saja. di bagian APP_NAME. <br>
<hr>
lalu kita buat fitur delete nya. <br>
jadi saat tombol di klik nanti akan memunculkan popup konfirmasi gitu. <br>

kita kasih onclick pada button deletenya. dan kita kirimkan props ke PopupTodo <br>

```
<FaRegTrashAlt
size={20}
className="cursor-pointer"
onClick={() =>
    handleShowConfirmation(
        todo.id,
        todo.name
    )
}
{showConfirm && (
    <PopupTodo
        todoProps={todoProps}
        setShowConfirm={setShowConfirm}
    />
)}
/>
```

lalu buat function nya di Todo.jsx. <br>
jadi awalnya kita atur setShowConfirm menjadi false, lalu saat 'tombol hapus' di klik maka setShowConfirm di ubah menjadi true sehingga popup akan tampil. lalu setShowConfirm dikirimkan ke PopupTodo.jsx dan props id, name juga ikut dikirim. <br>

```
const [showConfirm, setShowConfirm] = useState(false);

const [todoProps, setTodoProps] = useState({
    id: "",
    name: "",
});

const handleShowConfirmation = (id, name) => {
    setShowConfirm(true);
    setTodoProps({ id: id, name: name });
};
```

buat file baru PopupTodo.jsx untuk menerima props dan ini juga untuk menampilkan popup confirmation. <br>
buat function handleDelete di PopupTodo.jsx. <br>
jadi maksud onSuccess adalah saat sudah berhasil maka akan mengubah nilai setShowConfirm menjadi false, sehingga pop up akan hilang. <br>

```
const handleDelete = () => {
    router.post(
        `/todo/${todoProps.id}/delete`,
        {
            _method: "delete",
        },
        {
            onSuccess: () => {
                setShowConfirm(false);
            },
        }
    );
};
```

ini untuk button nya. jika Ya, maka panggil handleDelete, jika batal maka atur setShowConfirm menjadi false. <br>

```
<button
    onClick={handleDelete}
    className="px-4 py-2 text-sm text-white rounded-md bg-indigo-600">
    Ya, Yakin
</button>
<button
    onClick={() => setShowConfirm(false)}
    className="px-4 py-2 text-sm text-white rounded-md bg-red-600">
    Batal
</button>
```

ohiya bikin untuk route delete nya. <br>

```
Route::delete('/todo/{todo}/delete', [TodoController::class, 'destroy'])->name('todo.delete');
```

TodoController.php. <br>

```
public function destroy(Todo $todo)
    {
        $todo->delete();
        return back()->with('message', 'Todo berhasil dihapus');
    }
```

</details>
