import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <p>© {currentYear} Producer Battles. All rights reserved.</p>

        <nav className="flex gap-4">
          <Link className="hover:text-black" href="/submit">
            Submit
          </Link>

          <Link className="hover:text-black" href="/past-battles">
            Past Battles
          </Link>

          <Link className="hover:text-black" href="/admin">
            Admin
          </Link>
        </nav>
      </div>
    </footer>
  );
}
