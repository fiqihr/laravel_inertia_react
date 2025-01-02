import { Link, usePage } from "@inertiajs/react";
import React from "react";

const AdminLayout = ({ children }) => {
    const { component } = usePage();
    const { auth } = usePage().props;

    return (
        <div>
            <header className="bg-black text-white py-8">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-2xl">Todo</h2>
                        <nav className="flex justify-between items-center grow ml-36">
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
                            <div>{auth.user.name}</div>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="mt-10">
                <div className="container mx-auto">{children}</div>
            </main>
        </div>
    );
};

export default AdminLayout;
