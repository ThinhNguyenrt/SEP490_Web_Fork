import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit3,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";
import EditCompanyProfileModal from "./EditCompanyProfileModal";

export default function CompanyProfile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="lg:col-span-3 space-y-8">
      <Card className="overflow-hidden border-2 border-slate-200 shadow-sm rounded-2xl bg-white">
        <div className="h-32 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500')] bg-cover bg-center relative border-b-2 border-slate-200">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kala" />
            </Avatar>
          </div>
        </div>
        <CardContent className="pt-12 pb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 uppercase tracking-wider">
            <h3 className="font-bold text-lg text-slate-800">Company</h3>
            <button onClick={() => setIsEditModalOpen(true)}>
              <div className="flex items-center justify-center w-7 h-7 border-2 border-slate-200 bg-white rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group">
                <Edit3
                  size={12}
                  className="text-slate-400 group-hover:text-blue-500"
                />
              </div>
            </button>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-[#5b99fc] hover:bg-blue-600 rounded-xl text-white font-bold cursor-pointer">
              Chi tiết
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-2 border-slate-200 bg-white cursor-pointer"
            >
              <MoreHorizontal size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>
      <EditCompanyProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
