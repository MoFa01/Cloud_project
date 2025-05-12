"use client";

import axios from "axios";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface MedicalRecord {
  _id: string;
  patientId: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  createdAt: string;
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patientId, setPatientId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get("http://localhost:3002/medical-records");
      setRecords(data);
    } catch {
      toast.error("Failed to fetch medical records.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3002/medical-records/${editingId}`, {
          diagnosis,
          treatment,
        });
        toast.success("Medical record updated.");
      } else {
        await axios.post("http://localhost:3002/medical-records", {
          patientId,
          doctorName,
          diagnosis,
          treatment,
        });
        toast.success("Medical record created.");
      }

      setPatientId("");
      setDoctorName("");
      setDiagnosis("");
      setTreatment("");
      setEditingId(null);
      fetchRecords();
    } catch {
      toast.error("Failed to submit medical record.");
    }
  };

  const handleEdit = (record: MedicalRecord) => {
    setEditingId(record._id);
    setDiagnosis(record.diagnosis);
    setTreatment(record.treatment);
    setPatientId(record.patientId); // Optional for UX, not editable in PUT
    setDoctorName(record.doctorName); // Optional for UX, not editable in PUT
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3002/medical-records/${id}`);
      toast.success("Record deleted.");
      fetchRecords();
      if (editingId === id) setEditingId(null);
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  return (
    <div className="p-6 space-y-10">
      <Card className="shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-[#1E3A8A] text-xl">
            {editingId ? "Update Medical Record" : "Add Medical Record"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {!editingId && (
              <>
                <InputBlock
                  id="patientId"
                  label="Patient ID"
                  value={patientId}
                  onChange={setPatientId}
                />
                <InputBlock
                  id="doctorName"
                  label="Doctor Name"
                  value={doctorName}
                  onChange={setDoctorName}
                />
              </>
            )}
            <InputBlock
              id="diagnosis"
              label="Diagnosis"
              value={diagnosis}
              onChange={setDiagnosis}
              colSpan
            />
            <InputBlock
              id="treatment"
              label="Treatment"
              value={treatment}
              onChange={setTreatment}
              colSpan
            />
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <Button
                type="submit"
                variant={"default"}
                size="default"
                className="w-1/2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white"
              >
                {editingId ? "Update Record" : "Add Record"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-[#1E3A8A] text-xl">
            Medical Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {records.length === 0 ? (
            <p className="text-gray-500">No medical records available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-center">
                <thead className="bg-[#1E3A8A] text-white">
                  <tr>
                    <th className="py-2 px-2 border">#</th>
                    <th className="py-2 px-2 border">Patient ID</th>
                    <th className="py-2 px-2 border">Doctor</th>
                    <th className="py-2 px-2 border">Diagnosis</th>
                    <th className="py-2 px-2 border">Treatment</th>
                    <th className="py-2 px-2 border">Created</th>
                    <th className="py-2 px-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, idx) => (
                    <tr key={r._id} className="hover:bg-gray-100">
                      <td className="py-2 px-2 border">{idx + 1}</td>
                      <td className="py-2 px-2 border">{r.patientId}</td>
                      <td className="py-2 px-2 border">{r.doctorName}</td>
                      <td className="py-2 px-2 border">{r.diagnosis}</td>
                      <td className="py-2 px-2 border">{r.treatment}</td>
                      <td className="py-2 px-2 border">
                        {new Date(r.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-2 px-2 border">
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            onClick={() => handleEdit(r)}
                            size="sm"
                            variant={"outline"}
                            className="w-[100px] bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(r._id)}
                            size="sm"
                            variant={"outline"}
                            className="w-[100px] bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </Button>
                        </div>
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
  onChange,
  colSpan = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  colSpan?: boolean;
}) {
  return (
    <div className={`space-y-2 ${colSpan ? "md:col-span-2" : ""}`}>
      <Label htmlFor={id} className="text-[#1E3A8A]">
        {label}
      </Label>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={`Enter ${label}`}
        required
        className="bg-gray-100"
      />
    </div>
  );
}
