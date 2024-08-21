import { Login } from "~/app/pages/login/login";
import { Location } from "~/app/pages/Location/Location";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";

export default function home() {
    return (
        <div>
            <Location />
        </div>
    );
}