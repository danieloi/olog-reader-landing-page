import { Button } from "./ui/button";
import Image from "next/image";
import ShinyText from "./ShineyText";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Image src="/icon.png" alt="Olog Reader" width={54} height={54} />

        <Button
          asChild
          variant="link"
          className="px-0 h-auto leading-none text-lg sm:text-xl font-semibold text-primary no-underline hover:no-underline cta-underline"
        >
          <a href="#beta" aria-label="Jump to beta signup">
            <ShinyText text="Get Beta Access" speed={5} />
          </a>
        </Button>
      </div>
    </header>
  );
}
