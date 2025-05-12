"use client";

import axios from "axios";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Appointment {
  _id: string;
  patientId: string;
  doctorName: string;
  appointmentDate: string;
  status: string;
  createdAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientId, setPatientId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [status, setStatus] = useState("Scheduled");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get("http://localhost:3002/appointments");
      setAppointments(data);
    } catch {
      toast.error("Failed to fetch appointments");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3002/appointments/${editingId}`, {
          patientId,
          doctorName,
          appointmentDate,
          status,
        });
        toast.success("Appointment updated");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:3002/appointments", {
          patientId,
          doctorName,
          appointmentDate,
          status,
        });
        toast.success("Appointment created");
      }
      setPatientId("");
      setDoctorName("");
      setAppointmentDate("");
      setStatus("Scheduled");
      fetchAppointments();
    } catch {
      toast.error("Failed to submit appointment");
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setPatientId(appointment.patientId);
    setDoctorName(appointment.doctorName);
    setAppointmentDate(appointment.appointmentDate.slice(0, 16)); // format for input
    setStatus(appointment.status);
    setEditingId(appointment._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3002/appointments/${id}`);
      toast.success("Appointment deleted");
      fetchAppointments();
      if (editingId === id) setEditingId(null);
    } catch {
      toast.error("Failed to delete appointment");
    }
  };

  return (
    <div className="p-6 space-y-10">
      <Card className="shadow-md">
        <CardHeader className="">
          <CardTitle className="text-[#1E3A8A] text-xl">
            {editingId ? "Edit Appointment" : "Create Appointment"}
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <InputBlock
              id="patientId"
              label="Patient ID"
              value={patientId}
              setValue={setPatientId}
            />
            <InputBlock
              id="doctorName"
              label="Doctor Name"
              value={doctorName}
              setValue={setDoctorName}
            />
            <InputBlock
              id="appointmentDate"
              label="Appointment Date"
              value={appointmentDate}
              setValue={setAppointmentDate}
              type="date"
            />
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#1E3A8A]">
                Status
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-md w-full"
              >
                <option>Scheduled</option>
                <option>Completed</option>
                <option>Cancelled</option>
                <option>No-Show</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <Button
                type="submit"
                variant={"default"}
                size="default"
                className="w-1/2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white"
              >
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="">
          <CardTitle className="text-[#1E3A8A] text-xl">Appointments</CardTitle>
        </CardHeader>
        <CardContent className="">
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-center">
                <thead className="bg-[#1E3A8A] text-white">
                  <tr>
                    <th className="py-2 px-2 border">#</th>
                    <th className="py-2 px-2 border">Patient ID</th>
                    <th className="py-2 px-2 border">Doctor</th>
                    <th className="py-2 px-2 border">Date</th>
                    <th className="py-2 px-2 border">Status</th>
                    <th className="py-2 px-2 border">Created</th>
                    <th className="py-2 px-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a, index) => (
                    <tr key={a._id} className="hover:bg-gray-100 text-sm">
                      <td className="py-2 px-2 border">{index + 1}</td>
                      <td className="py-2 px-2 border">{a.patientId}</td>
                      <td className="py-2 px-2 border">{a.doctorName}</td>
                      <td className="py-2 px-2 border">
                        {new Date(a.appointmentDate).toLocaleString("en-GB")}
                      </td>
                      <td className="py-2 px-2 border">{a.status}</td>
                      <td className="py-2 px-2 border">
                        {new Date(a.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-2 px-2 border space-y-1">
                        <Button
                          onClick={() => handleEdit(a)}
                          size="sm"
                          variant={"outline"}
                          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(a._id)}
                          size="sm"
                          variant={"outline"}
                          className="bg-red-600 hover:bg-red-700 text-white w-full"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InputBlock({
  id,
  label,
  value,
  setValue,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  setValue: (val: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#1E3A8A]">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        required
        placeholder={`Enter ${label}`}
        className="bg-gray-100"
      />
    </div>
  );
}
