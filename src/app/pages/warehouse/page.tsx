"use client";
import { Login } from "~/app/pages/login/login";
import Warehouse from "./Warehouse";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";

export default function Home() {
    return (
        <div className="App">
            <Warehouse />
        </div>
    );
}
