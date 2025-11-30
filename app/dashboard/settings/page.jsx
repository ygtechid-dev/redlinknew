"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  User, 
  Info, 
  HelpCircle, 
  FileText, 
  LogOut, 
  Mail, 
  Shield 
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [open, setOpen] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    router.push("/login");
  };

  const toggle = (val) => {
    setOpen(open === val ? null : val);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* About Us */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <button
            onClick={() => toggle("about")}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-800 text-lg">Tentang Kami</h2>
            </div>
          </button>

          {open === "about" && (
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              Redlink adalah platform digital untuk membuat landing page modern 
              secara cepat, mudah, dan tanpa coding.  
              Cukup drag & drop, publish, dan bagikan link Anda ke pelanggan.
              <br /><br />
              Tujuan kami adalah membantu UMKM, kreator, dan bisnis online memiliki 
              halaman profesional tanpa biaya besar dan tanpa ribet.
            </p>
          )}
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <button
            onClick={() => toggle("help")}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold text-gray-800 text-lg">Bantuan & Support</h2>
            </div>
          </button>

          {open === "help" && (
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>Email Support: <strong>support@redlink.id</strong></p>
              <p>WhatsApp: <strong>+62 812-3456-7890</strong></p>
              <p>
                Untuk panduan lengkap, buka menu Tutorial di aplikasi ini.
              </p>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <button
            onClick={() => toggle("faq")}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-orange-500" />
              <h2 className="font-semibold text-gray-800 text-lg">FAQ</h2>
            </div>
          </button>

          {open === "faq" && (
            <ul className="mt-4 text-sm text-gray-700 space-y-3">
              <li>
                <strong>Apa itu Redlink?</strong><br />
                Redlink adalah platform untuk membuat landing page cepat dan mudah.
              </li>
              <li>
                <strong>Apakah Redlink gratis?</strong><br />
                Ada paket gratis dan paket Pro dengan fitur lebih lengkap.
              </li>
              <li>
                <strong>Apakah saya bisa custom domain?</strong><br />
                Bisa! Custom domain tersedia pada paket Pro.
              </li>
            </ul>
          )}
        </div>

        {/* Legal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-600" />
            Legal & Kebijakan
          </h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

      </div>
    </div>
  );
}
