"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Globe, 
  Share2, 
  TrendingUp, 
  Users,
  CheckCircle,
  ArrowRight,
  Link2,
  BarChart3,
  Palette,
  Shield,
  Star,
  Instagram,
  Youtube,
  Twitter,
  Smartphone,
  Eye,
  MousePointer
} from "lucide-react";
import CookieConsent from "@/components/CookieConsent";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Link2 className="w-6 h-6" />,
      title: "Satu Link, Semua Platform",
      description: "Kumpulkan Instagram, TikTok, YouTube, dan semua link penting kamu dalam satu tempat yang mudah diakses",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Mendalam",
      description: "Pantau klik, pengunjung, dan performa setiap link dengan dashboard analytics yang powerful",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Desain Unlimited",
      description: "Customize warna, font, background, dan tema sesuai personal branding kamu yang unik",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Super Cepat & Ringan",
      description: "Load time di bawah 1 detik! Pengunjung tidak akan pernah menunggu lama",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const benefits = [
    "Unlimited links untuk semua platform",
    "Real-time analytics & insights",
    "Customizable themes & colors",
    "Mobile responsive sempurna",
    "SEO optimized untuk Google",
    "24/7 customer support"
  ];

  const testimonials = [
    {
      name: "Andi Prasetyo",
      role: "Content Creator",
      avatar: "🎨",
      text: "RedLink bikin semua link sosmed gue jadi rapih! Followers gampang banget akses semua konten gue.",
      rating: 5
    },
    {
      name: "Sarah Kusuma",
      role: "Online Shop Owner",
      avatar: "🛍️",
      text: "Sejak pakai RedLink, traffic ke toko online gue naik 40%! Gampang banget pelanggan langsung checkout.",
      rating: 5
    },
    {
      name: "Budi Santoso",
      role: "Digital Marketer",
      avatar: "📊",
      text: "Analytics nya lengkap banget! Bisa tracking mana link yang paling efektif. Worth it!",
      rating: 5
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-50 via-orange-50 to-pink-50"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-pink-200/30 to-red-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-10%] left-[30%] w-[300px] h-[300px] bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Navbar */}
        <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <div className="flex items-center justify-between h-20">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  RedLink
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <button
                  onClick={() => router.push("/login")}
                  className="hidden sm:block text-gray-700 hover:text-red-600 font-semibold transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  Mulai Gratis
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-red-200/50"
                >
                  <Sparkles className="w-4 h-4" />
                  Dipercaya oleh 10,000+ Kreator Indonesia
                </motion.div>

                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  Semua Link Kamu,
                  <br />
                  <span className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    Dalam Satu Tempat
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Platform link-in-bio tercepat di Indonesia. Bangun personal brand yang kuat dengan profil yang mudah diingat dan profesional.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                >
                  <button
                    onClick={() => router.push("/login")}
                    className="group bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-8 py-4 rounded-xl font-bold text-lg text-white shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Buat RedLink Gratis
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                  
                  <button
                    onClick={() => router.push("/login")}
                    className="px-8 py-4 rounded-xl font-bold text-lg text-gray-700 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Eye className="w-5 h-5" />
                    Lihat Demo
                  </button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-8 text-sm text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-orange-400 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
                    </div>
                    <span className="font-semibold">10,000+ pengguna aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold">4.9/5 rating</span>
                  </div>
                </motion.div>
              </div>

              {/* Right - Enhanced Profile Preview */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {/* Main Card */}
                <div className="relative max-w-md mx-auto">
                  <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
                    {/* Header Gradient */}
                    <div className="h-32 bg-gradient-to-br from-red-600 via-orange-600 to-pink-600 relative">
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    
                    {/* Profile Content */}
                    <div className="relative px-8 pb-8">
                      {/* Avatar */}
                      <div className="flex justify-center -mt-16 mb-4">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                          <span className="text-white text-5xl font-bold">YG</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">REID</h3>
                        <p className="text-gray-600 text-sm mb-3">Redlink • Content Creator</p>
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-4 py-2 rounded-full text-xs font-bold">
                          <Globe className="w-3 h-3" />
                          redlink.id/namaanda
                        </div>
                      </div>

                      {/* Links */}
                      <div className="flex flex-col gap-3">
                        <motion.a 
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold py-4 rounded-xl hover:shadow-xl transition-all duration-200 text-center flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Globe className="w-4 h-4" />
                          Website Portfolio
                        </motion.a>
                        <motion.a 
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-pink-500 to-rose-500 text-white font-semibold py-4 rounded-xl hover:shadow-xl transition-all duration-200 text-center flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </motion.a>
                        <motion.a 
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-red-600 to-red-700 text-white font-semibold py-4 rounded-xl hover:shadow-xl transition-all duration-200 text-center flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Youtube className="w-4 h-4" />
                          YouTube Channel
                        </motion.a>
                        <motion.a 
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-semibold py-4 rounded-xl hover:shadow-xl transition-all duration-200 text-center flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Twitter className="w-4 h-4" />
                          Twitter
                        </motion.a>
                      </div>

                      {/* Share Button */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 font-semibold transition-colors">
                          <Share2 className="w-4 h-4" />
                          Share Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Stats */}
                  <motion.div
                    className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl border border-gray-200"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">+240%</div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Traffic
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl border border-gray-200"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">12.5K</div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Visitors
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-black mb-6">
                  Fitur yang Bikin 
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"> Perbedaan</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Platform all-in-one yang dirancang khusus untuk kreator, influencer, dan bisnis modern di Indonesia
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="group relative bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                    <div className={`bg-gradient-to-br ${feature.color} text-white p-4 rounded-xl w-fit mb-5 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-xl mb-3 text-gray-900">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-black mb-6">
                  Kata Mereka yang Sudah 
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"> Sukses</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Bergabunglah dengan ribuan kreator yang sudah berkembang bersama RedLink
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-600 to-red-700"></div>
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                  Siap Tingkatkan Personal Brand Kamu?
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Mulai gratis hari ini! Tidak perlu kartu kredit. Setup dalam 60 detik.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-white text-red-600 px-10 py-5 rounded-xl font-black text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-3"
                  >
                    Buat RedLink Gratis
                    <Zap className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-3"
                  >
                    <MousePointer className="w-6 h-6" />
                    Lihat Demo
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                  <div>
                    <div className="text-4xl font-black text-white mb-2">10K+</div>
                    <div className="text-white/80">Pengguna Aktif</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white mb-2">50K+</div>
                    <div className="text-white/80">Link Dibuat</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white mb-2">99.9%</div>
                    <div className="text-white/80">Uptime</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl">RedLink</span>
              </div>
              
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} RedLink by YG Tech. All rights reserved.
              </p>

              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <CookieConsent />

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}