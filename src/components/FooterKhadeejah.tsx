import { Instagram, Facebook, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer id="kontak" className="bg-pink-50 text-gray-700 py-10 px-6 sm:px-10 mt-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold text-pink-600 mb-3">
            KhadeejaHijab
          </h3>
          <p className="text-sm">
            Hijab elegan & nyaman untuk setiap momen spesialmu.  
            Kirim dari Bandung 💕
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Kontak Kami</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> <span>0857-1234-5678</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> <span>admin@khadeejahijab.id</span>
            </li>
          </ul>
        </div>

        {/* Sosial */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Ikuti Kami</h4>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/khadeejahijabofficial"
              target="_blank"
              className="hover:text-pink-500"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-pink-500"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@khadeejahijab.idn"
              target="_blank"
              className="hover:text-pink-500"
            >
              <img
                src="/icons/tiktok.svg"
                alt="TikTok"
                className="w-5 h-5 opacity-80 hover:opacity-100"
              />
            </a>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} Khadeeja Hijab. All rights reserved.
      </p>
    </footer>
  )
}
