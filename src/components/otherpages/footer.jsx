import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-stone-900 text-amber-50 border-t border-stone-700">
      <div className="w-full px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-6">
          {/* Brand Info - Left */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                <div className="text-white font-serif text-sm">M</div>
              </div>
              <div className="text-left">
                <div className="font-serif text-xl tracking-wide">BE MEN</div>
                <div className="text-xs text-amber-200/70 tracking-widest font-light">COLLECTION</div>
              </div>
            </div>
            <p className="text-amber-200/70 text-sm max-w-xs font-light leading-relaxed">
              Curated essentials with enduring character for the modern gentleman
            </p>
          </div>


          {/* Service Links - Right */}
          <div className="text-center md:text-right">
            <h4 className="font-serif text-lg mb-3 text-amber-200">Service</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-amber-200/70 hover:text-amber-200 transition-colors duration-300 cursor-pointer font-light">
                Contact Us
              </li>
              <li className="text-amber-200/70 hover:text-amber-200 transition-colors duration-300 cursor-pointer font-light">
                Shipping Info
              </li>
              <li className="text-amber-200/70 hover:text-amber-200 transition-colors duration-300 cursor-pointer font-light">
                Returns
              </li>
              <li className="text-amber-200/70 hover:text-amber-200 transition-colors duration-300 cursor-pointer font-light">
                FAQ
              </li>
            </ul>
          </div>
        </div>

        {/* Heritage Statement */}
        <div className="text-center mb-6">
          <div className="inline-block border-t border-b border-amber-600/30 py-3">
            <p className="text-amber-200/60 text-xs font-light tracking-widest uppercase">
              CRAFTING TIMELESS PIECES SINCE 2024
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-700 pt-4 text-center">
          <div className="text-amber-200/50 text-xs font-light tracking-wide">
            © 2024 BE MEN COLLECTION. CRAFTED WITH INTENTION.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;