import { Search, ShoppingCart, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="text-xl font-semibold">
          Temp
        </div>

        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          <li className="cursor-pointer hover:text-gray-600">Home</li>
          <li className="cursor-pointer hover:text-gray-600">Shop</li>
          <li className="cursor-pointer hover:text-gray-600">Collection</li>
          <li className="cursor-pointer hover:text-gray-600">Customize</li>
        </ul>

        <div className="flex items-center space-x-5">
          <Search className="w-5 h-5 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 cursor-pointer" />
          <Menu className="w-5 h-5 cursor-pointer md:hidden" />
        </div>
      </div>
    </nav>
  );
}