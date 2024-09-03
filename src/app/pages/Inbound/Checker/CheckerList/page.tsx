"use client";

import { Login } from "~/app/pages/login/login";

import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";
import CheckerList from "./CheckerList";

export default function home() {
    return (
        <div>
            <h1><CheckerList/></h1>
        </div>
    );

}