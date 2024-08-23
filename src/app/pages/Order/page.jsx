"use client";
import { Login } from "~/app/pages/login/login";
import Order from  "~/app/pages/Order/order";
import Order2 from  "~/app/pages/Order/order2";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";

export default function Home() {
    return (
        <div className="App">
            <Order2 />
        </div>
    );
}
