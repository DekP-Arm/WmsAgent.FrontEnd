import { Login } from "~/app/pages/login/login";
import ShelfList from "./ShelfList";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";


export default function home() {
    return (
        <div className="App">
            <ShelfList />
        </div>
    );

}