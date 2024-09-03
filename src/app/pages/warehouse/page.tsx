import { Login } from "~/app/pages/login/login";
import { Warehouse } from "./warehouse"
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";

export default function home() {
    return (
        <div>
            <Warehouse />
        </div>
    );
}