import { Login } from "~/app/pages/login/login";
import { Officer } from "~/app/pages/officer/officer";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";

export default function home() {
    return (
        <div className="App">
            <Officer />
        </div>
    );

}