import { Link } from "@inertiajs/react";
import React from "react";

const Pagination = ({ todos }) => {
    const links = todos.links;
    const currentPage = todos.current_page;
    const lastPage = todos.last_page;

    return (
        <nav aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px text-base h-10">
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
            </ul>
        </nav>
    );
};

export default Pagination;
