export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-auto border-t border-gray-200 bg-white">
      <div className="container mx-auto px-6 flex items-center justify-center flex-col md:flex-row  gap-4">
        <p className="text-sm text-gray-500">
          © {currentYear} Blog Application. Made with Next.js and Lot of console.log()'s.
        </p>
      </div>
    </footer>
  );
}