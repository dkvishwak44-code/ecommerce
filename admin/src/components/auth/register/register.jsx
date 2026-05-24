"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const nextStep = async () => {
    let fields = [];

    if (step === 1) fields = ["name", "email", "phone"];
    if (step === 2) fields = ["storeName", "address"];

    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data) => {
    if (!accepted) return alert("Please accept Terms & Conditions");

    setLoading(true);

    const payload = { ...data, role: "seller" };

    try {
      await fetch("https://api.yourbackend.com/auth/register-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <Card className="w-full max-w-xl shadow-xl border-0">

        {/* HEADER */}
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl text-center font-bold">
            Seller Registration
          </CardTitle>

          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader >

        <CardContent className="">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <Input placeholder="Full Name" {...register("name", { required: true })} />
                <Input type="email" placeholder="Email" {...register("email", { required: true })} />
                <Input placeholder="Phone" {...register("phone")} />
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <Input placeholder="Store Name" {...register("storeName", { required: true })} />
                <Input placeholder="Store Address" {...register("address")} />
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password", { required: true })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />

                {/*  TERMS DIALOG */}
                <div className="flex items-center justify-between text-sm">

                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                    />
                    I agree to Terms
                  </label>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="text-blue-600 p-0">
                        View Terms
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Terms & Conditions</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                          1. You agree to use this platform responsibly.
                        </p>
                        <p>
                          2. You are responsible for your store products and data.
                        </p>
                        <p>
                          3. We may suspend accounts violating policies.
                        </p>
                        <p>
                          4. All payments and transactions are subject to verification.
                        </p>
                        <p>
                          5. Your data will be stored securely as per privacy rules.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                </div>
              </>
            )}

            {/* BUTTONS */}
            <div className="flex gap-3 pt-2">

              {step > 1 && (
                <Button type="button" variant="outline" className="flex-1" onClick={prevStep}>
                  Back
                </Button>
              )}

              {step < 3 ? (
                <Button type="button" className="flex-1" onClick={nextStep} variant="blue">
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1"
                  variant="blue"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              )}

            </div>

          </form>

        </CardContent>
      </Card>

    </div>
  );
}