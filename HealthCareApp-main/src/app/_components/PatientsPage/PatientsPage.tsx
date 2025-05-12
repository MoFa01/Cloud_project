"use client";

import axios from "axios";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Patient {
  _id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
  createdAt?: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/patients");
      setPatients(data);
    } catch {
      toast.error("Failed to fetch patients");
    }
  };

  const handleAddPatient = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/patients/${editingId}`, {
          firstName,
          lastName,
          dateOfBirth,
          gender,
          contactNumber,
          email,
        });
        toast.success("Patient updated successfully");
      } else {
        await axios.post("http://localhost:3001/patients", {
          firstName,
          lastName,
          dateOfBirth,
          gender,
          contactNumber,
          email,
        });
        toast.success("Patient added successfully");
      }
      fetchPatients();
      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setGender("");
      setContactNumber("");
      setEmail("");
      setEditingId(null);
    } catch (error) {
      toast.error(`Failed to submit: ${(error as Error).message}`);
    }
  };

  const handleEdit = (p: Patient) => {
    setFirstName(p.firstName);
    setLastName(p.lastName);
    setDateOfBirth(p.dateOfBirth);
    setGender(p.gender);
    setContactNumber(p.contactNumber);
    setEmail(p.email);
    setEditingId(p._id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/patients/${id}`);
      toast.success("Patient deleted");
      fetchPatients();
      if (editingId === id) setEditingId(null);
    } catch {
      toast.error("Failed to delete patient");
    }
  };

  return (
    <div className="p-6 space-y-10">
      <Card className="bg-white shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-[#1E3A8A] text-xl">
            {editingId ? "Edit Patient" : "Register New Patient"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            onSubmit={handleAddPatient}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <InputBlock
              label="First Name"
              value={firstName}
              setValue={setFirstName}
              placeholder="first name"
            />
            <InputBlock
              label="Last Name"
              value={lastName}
              setValue={setLastName}
              placeholder="last name"
            />
            <InputBlock
              label="Date of Birth"
              value={dateOfBirth}
              setValue={setDateOfBirth}
              type="date"
              placeholder="date of birth"
            />
            <InputBlock
              label="Gender"
              value={gender}
              setValue={setGender}
              placeholder="gender"
            />
            <InputBlock
              label="Contact Number"
              value={contactNumber}
              setValue={setContactNumber}
              placeholder="contact number"
            />
            <InputBlock
              label="Email"
              value={email}
              setValue={setEmail}
              type="email"
              placeholder="email"
            />
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <Button
                type="submit"
                variant="default"
                size="default"
                className="w-1/2 bg-[#1E3A8A] text-white hover:text-white hover:bg-[#2563EB]"
              >
                {editingId ? "Update Patient" : "Add Patient"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-[#1E3A8A] text-xl">
            Registered Patients
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {patients.length === 0 ? (
            <p className="text-gray-500">No patients found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-center">
                <thead className="bg-[#1E3A8A] text-white">
                  <tr>
                    <th className="py-2 px-2 border">#</th>
                    <th className="py-2 px-2 border">First Name</th>
                    <th className="py-2 px-2 border">Last Name</th>
                    <th className="py-2 px-2 border">DOB</th>
                    <th className="py-2 px-2 border">Gender</th>
                    <th className="py-2 px-2 border">Phone</th>
                    <th className="py-2 px-2 border">Email</th>
                    <th className="py-2 px-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-100">
                      <td className="py-2 px-2 border text-[14px]">{p._id}</td>
                      <td className="py-2 px-2 border text-[14px]">
                        {p.firstName}
                      </td>
                      <td className="py-2 px-2 border text-[14px]">
                        {p.lastName}
                      </td>
                      <td className="py-2 px-2 border text-[14px]">
                        {new Date(p.dateOfBirth).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-2 px-2 border text-[14px]">
                        {p.gender}
                      </td>
                      <td className="py-2 px-2 border text-[14px]">
                        {p.contactNumber}
                      </td>
                      <td className="py-2 px-2 border text-[14px]">
                        {p.email}
                      </td>
                      <td className="py-2 px-2 border space-y-1">
                        <Button
                          onClick={() => handleEdit(p)}
                          size="sm"
                          variant={"outline"}
                          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(p._id)}
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

const InputBlock = ({
  label,
  value,
  setValue,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  setValue: (val: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={label} className="text-[#1E3A8A]">
      {label}
    </Label>
    <Input
      id={label}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      required
      className="bg-gray-100"
    />
  </div>
);
