import { Login } from "~/app/pages/login/login";
import ShelfPage from "./shelf-show";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";


export default function home() {
    return (
        <div className="App">
            <ShelfPage />
        </div>
    );

}