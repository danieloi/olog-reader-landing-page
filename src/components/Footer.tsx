import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative bg-white overflow-hidden">
      <div
        className="absolute inset-0 hero-radials opacity-40 pointer-events-none"
        aria-hidden
      />

      <div className="relative px-4 sm:px-6 lg:px-8 georama-text">
        <div className="border-t border-gray-100">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/icon.png" alt="Olog Reader" width={50} height={50} />
            </div>

            <div className="flex items-center gap-5 text-sm text-text-secondary">
              <a href="#" className="hover:text-text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
