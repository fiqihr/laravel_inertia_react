import Pagination from "@/Components/Pagination";
import PopupTodo from "@/Components/PopupTodo";
import AdminLayout from "@/layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPencilSquare } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";

const Todo = ({ todos }) => {
    const { flash, errors } = usePage().props;
    const [showConfirm, setShowConfirm] = useState(false);
    const [todoProps, setTodoProps] = useState({
        id: "",
        name: "",
    });
    const { data, setData, reset } = useForm({
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

    useEffect(() => {
        flash.message && toast.success(flash.message);
    }, [flash]);

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

    const handleShowConfirmation = (id, name) => {
        setShowConfirm(true);
        setTodoProps({ id: id, name: name });
    };

    return (
        <>
            <Head title="Todo App" />
            <AdminLayout>
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-semibold text-4xl my-8 text-center">
                        Todo App
                    </h2>
                    <form onSubmit={storeTodo}>
                        <div className="mb-6">
                            <div className="flex gap-4 items-center">
                                <input
                                    type="text"
                                    placeholder="Enter todo here"
                                    className="px-4 py-2 rounded-md grow"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    value={data.name}
                                />
                                <button
                                    type="submit"
                                    className="py-2 px-4 rounded-md bg-indigo-500 text-white"
                                >
                                    Save
                                </button>
                            </div>
                            {errors.name && (
                                <p className="text-red-700 text-sm mt-2">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </form>
                    <div className="flex flex-col gap-4">
                        {todos.data.map((todo, i) => (
                            <div
                                key={i}
                                className={`flex justify-between items-center py-3 px-6 rounded-md ${
                                    todo.is_complete
                                        ? "bg-green-100"
                                        : "bg-red-100"
                                }`}
                            >
                                <h3 id={todo.id}>{todo.name}</h3>
                                <div className="flex justify-center items-center gap-2">
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
                                    <Link href={`todo/edit/${todo.id}`}>
                                        <BsPencilSquare size={20} />
                                    </Link>{" "}
                                    |
                                    <FaRegTrashAlt
                                        size={20}
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleShowConfirmation(
                                                todo.id,
                                                todo.name
                                            )
                                        }
                                    />
                                    {showConfirm && (
                                        <PopupTodo
                                            todoProps={todoProps}
                                            setShowConfirm={setShowConfirm}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* <div className="flex justify-between items-center py-3 px-6 bg-red-100 rounded-md">
                        <h3>lorem ipsum dolor sit</h3>
                        <div className="flex justify-center items-center gap-2">
                            <BsPencilSquare size={20} /> |{" "}
                            <FaRegTrashAlt size={20} />
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-3 px-6 bg-green-100 rounded-md">
                        <h3>lorem ipsum dolor sit</h3>
                        <div className="flex justify-center items-center gap-2">
                            <FaRegCircleCheck size={20} />
                            <FaRegTrashAlt size={20} />
                        </div>
                    </div> */}
                    </div>
                    <div className="mt-8 flex justify-end items-center">
                        <Pagination todos={todos} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
};

export default Todo;
