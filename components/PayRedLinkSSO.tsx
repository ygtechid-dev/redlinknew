// components/PayRedLinkSSO.tsx
// Component ini ditaruh di RedLink utama (redlink.id)

"use client";
import { useState } from "react";
import { Wallet, ExternalLink, Loader2 } from "lucide-react";

export default function PayRedLinkSSO() {
  const [loading, setLoading] = useState(false);

  const handleOpenPay = async () => {
    setLoading(true);
    
    try {
      // Get auth data dari localStorage RedLink
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("auth_token"); // Dari Supabase session
      
      if (!username || !userId) {
        alert("❌ Silakan login terlebih dahulu!");
        setLoading(false);
        return;
      }

      // Build URL dengan query params
    //   const payUrl = new URL("https://pay.redlink.id/app");
      const payUrl = new URL("http://localhost:3001/app");

      payUrl.searchParams.set("username", username);
      payUrl.searchParams.set("user_id", userId);
      
      if (authToken) {
        payUrl.searchParams.set("token", authToken);
      }

      // Redirect to PAY-RedLink
      window.open(payUrl.toString(), "_blank");
      
      // Atau kalau mau di window yang sama:
      // window.location.href = payUrl.toString();
      
    } catch (error) {
      console.error("❌ Error opening PAY-RedLink:", error);
      alert("Gagal membuka PAY-RedLink");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleOpenPay}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <Wallet className="w-5 h-5" />
          <span>Buka PAY-RedLink</span>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </>
      )}
    </button>
  );
}