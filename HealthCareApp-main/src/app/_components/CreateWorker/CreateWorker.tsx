import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CreateWorkerPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateWorker = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, salary: 5000 }),
      });

      if (response.ok) {
        toast.success("Worker created successfully!");
        setEmail("");
        setPassword("");
      } else {
        const data = await response.json();
        toast.error(data.message || "Creation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <Card className="bg-white shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-[#1E3A8A] text-xl">
            Create New Worker
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <form
            onSubmit={handleCreateWorker}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <InputBlock
              label="Email"
              value={email}
              setValue={setEmail}
              type="email"
              placeholder="Enter email"
            />
            <InputBlock
              label="Password"
              value={password}
              setValue={setPassword}
              type="password"
              placeholder="Enter password"
            />
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <Button
                type="submit"
                variant="default"
                size="default"
                className="w-1/2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Worker"}
              </Button>
            </div>
          </form>
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
  placeholder = "",
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
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      required
      placeholder={placeholder || label}
      className="bg-gray-100"
    />
  </div>
);
