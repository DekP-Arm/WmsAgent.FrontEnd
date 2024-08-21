import { Login } from "~/app/pages/login/login";
import { Warehouse } from "~/app/pages/Warehouse/Warehouse";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";

export default function home() {
    return (
        <div>
            <Warehouse />
        </div>
    );
}