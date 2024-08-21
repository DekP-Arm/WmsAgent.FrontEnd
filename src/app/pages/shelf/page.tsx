import { Login } from "~/app/pages/login/login";
import Shelf from "./Shelf";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";


export default function home() {
    return (
        <div className="App">
            <Shelf />
        </div>
    );

}