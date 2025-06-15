
import { Book } from "lucide-react";

const Footer = () => (
  <footer className="w-full bg-slate-900 text-white mt-10 py-8 px-4 animate-fade-in">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2 text-lg font-bold">
        <Book className="text-green-400" />
        EduFund &copy; {new Date().getFullYear()}
      </div>
      <nav>
        <ul className="flex gap-5 text-slate-300 text-sm">
          <li>
            <a href="#" className="hover:underline hover:text-white transition">Home</a>
          </li>
          <li>
            <a href="#campaigns" className="hover:underline hover:text-white transition">Campaigns</a>
          </li>
          <li>
            <a href="#about" className="hover:underline hover:text-white transition">About</a>
          </li>
          <li>
            <a href="#how" className="hover:underline hover:text-white transition">How It Works</a>
          </li>
        </ul>
      </nav>
      <div className="text-slate-400 text-xs">Made with ❤ for impact</div>
    </div>
  </footer>
);

export default Footer;
