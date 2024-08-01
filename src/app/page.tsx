
import Link from "next/link";
import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import { Login } from "~/app/pages/login/login";
import { Register } from "~/app/pages/register/register";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";
import { ShelfProvider } from "~/app/_context/ShelfContext";

export default function Home() {
  return (
      <main className="">
        <Login />
      </main>
  );
}