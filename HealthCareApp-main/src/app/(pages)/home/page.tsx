"use client";

import { useState, ReactNode, useEffect } from "react";
import Image from "next/image";
import Logo from "../../../assets/logo.svg";
import { Button } from "@/components/ui/button";
import PatientsPage from "@/app/_components/PatientsPage/PatientsPage";
import AppointmentsPage from "@/app/_components/AppointmentsPage/AppointmentsPage";
import MedicalRecordsPage from "@/app/_components/MedicalRecordsPage/MedicalRecordsPage";
import CreateWorkerPage from "@/app/_components/CreateWorker/CreateWorker";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<string>("Patients");
  const [role, setRole] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      router.replace("/login");
    } else {
      setRole(storedRole);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const renderContent = (): ReactNode => {
    switch (activePage) {
      case "Create Worker":
        return role === "admin" ? <CreateWorkerPage /> : null;
      case "Patients":
        return <PatientsPage />;
      case "Medical Records":
        return <MedicalRecordsPage />;
      case "Appointments":
        return <AppointmentsPage />;
      default:
        return null;
    }
  };

  const menuItems: string[] = [
    ...(role === "admin" ? ["Create Worker"] : []),
    "Patients",
    "Medical Records",
    "Appointments",
  ];

  if (!role) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#1E3A8A] to-[#60A5FA] p-6 text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center mb-10">
            <Image src={Logo} alt="Logo" width={150} height={150} />
          </div>

          <nav className="space-y-4">
            {menuItems.map((item) => (
              <Button
                key={item}
                variant="ghost"
                size="default"
                onClick={() => setActivePage(item)}
                className={`w-full justify-start text-left transition-all ease-in-out duration-300 ${
                  activePage === item
                    ? "bg-white/20 font-bold"
                    : "hover:bg-white/10"
                }`}
              >
                {item}
              </Button>
            ))}
          </nav>
        </div>

        <div>
          <Button
            variant="ghost"
            size="default"
            className="w-full cursor-pointer bg-[#1E3A8A] hover:bg-[#2563EB] text-white"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 bg-gray-50">
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">{activePage}</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          {renderContent()}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold text-[#1E3A8A]">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size={"default"}
                className="bg-white hover:bg-gray-100"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="default"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleLogout}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
