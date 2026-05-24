import { useState } from "react";

import {Pencil} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ProfileInfo() {
  const [image, setImage] = useState(
    "https://ui-avatars.com/api/?name=Dinesh+Vish&background=0D8ABC&color=fff",
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImage(preview);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      {/* IMAGE SECTION */}
      {/* IMAGE SECTION */}
      <div className="flex flex-col items-center justify-center gap-1 m-6">
        {/* Avatar Wrapper */}
        <div className="relative">
          {/* Avatar */}
          <img
            src={image}
            alt="profile"
            className="w-35 h-25 rounded-full object-cover border "
          />

          {/* Edit Icon */}
          <Label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-white border rounded-full p-1 cursor-pointer shadow hover:bg-muted"
          >
            <Pencil size={14} />
          </Label>

          {/* Hidden Input */}
          <Input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Info */}
        <div className="font-semibold">Dinesh Vish</div>
        <div className="text-muted-foreground text-xs">administrator</div>
        <div className="text-muted-foreground text-xs">dk@gmail.com</div>
      </div>
      {/* FORM */}
      <div className="w-full space-y-3">
        <div className="space-y-1">
          <Label htmlFor="full-name" className="text-xs">
            Full Name
          </Label>
          <Input id="full-name" placeholder="Full Name" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs">
            Email Address
          </Label>
          <Input id="email" placeholder="Email Address" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone" className="text-xs">
            Phone Number
          </Label>
          <Input id="phone" placeholder="Phone Number" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="role" className="text-xs">
            Role
          </Label>
          <Input id="role" placeholder="Admin / Staff" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="bio" className="text-xs">
            Bio
          </Label>
          <Textarea id="bio" placeholder="Write your bio..." />
        </div>

        <div className="flex justify-end"><Button variant="blue">Save Changes</Button></div>
      </div>
    </div>
  );
}
