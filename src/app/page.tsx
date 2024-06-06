
import Link from "next/link";
import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import { Login } from "~/app/pages/login/login";
import { Register } from "~/app/pages/register/register";
import { Navbar } from "~/app/_components/Navbar";
import "assets/css/main.css";

export default async function Home() {
  return (
    <main className="">
        <Login />
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
