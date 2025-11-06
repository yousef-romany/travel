"use client"

import { useEffect, useState } from "react"
import { Mail, Phone, MapPin, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfileHeader() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setUser(data);

      } catch (error) {
        console.log("User fetch error:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="w-full text-center py-10 text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background-950 via-slate-900 to-muted-950 border-b border-amber-900/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full blur-md opacity-60"></div>
              <Avatar className="h-28 w-28 border-4 border-amber-500/50 relative z-10">
                <AvatarImage src={user?.avatar || "/default-avatar.png"} alt={user.username} />
                <AvatarFallback className="bg-amber-600 text-white text-lg font-bold">
                  {user.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{user.username}</h1>
              <p className="text-amber-400 font-semibold mb-4">{user.role?.name}</p>

              <div className="flex flex-col gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>{user.email}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-500" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {user.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>{user.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 hover:text-white gap-2 bg-transparent">
              <Settings className="w-4 h-4" />
              Settings
            </Button>

            <Button onClick={handleLogout} variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 hover:text-white gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
