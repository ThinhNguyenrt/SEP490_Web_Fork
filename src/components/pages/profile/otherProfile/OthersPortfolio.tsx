import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const OthersPortfolio = ({ userId }: { userId: string }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/Portfolio/user/${userId}`);
        const data = await res.json();
        setPortfolios(data.items || data || []);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, [userId]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>;

  return portfolios.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {portfolios.map((item: any) => (
        <Card key={item.id} className="rounded-[2rem] border-none shadow-sm overflow-hidden group hover:shadow-md transition-all cursor-pointer bg-white">
          <div className="h-40 bg-slate-100 flex items-center justify-center">
            {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover" /> : <span className="text-slate-300 italic">Portfolio Preview</span>}
          </div>
          <div className="p-6">
            <h4 className="font-black text-slate-800">{item.title}</h4>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase">{item.role || "Sản phẩm hoàn thiện"}</p>
          </div>
        </Card>
      ))}
    </div>
  ) : (
    <div className="text-center py-20 bg-white rounded-[2rem]"><p className="text-slate-400 font-bold">Chưa có hồ sơ năng lực nào.</p></div>
  );
};