import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { portfolioService, PortfolioResponse } from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import { notify } from "@/lib/toast";

export default function PortfolioViewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          notify.error("Portfolio ID không hợp lệ");
          return;
        }

        // Fetch portfolio by ID
        const response = await portfolioService.fetchPortfolioById(parseInt(id));
        if (response) {
          setPortfolio(response);
        } else {
          notify.error("Không tìm thấy portfolio");
        }
      } catch (error) {
        console.error("❌ Error loading portfolio:", error);
        notify.error("Không thể tải portfolio");
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-16 left-0 right-0 backdrop-blur-md z-50 px-6 py-4 flex items-center gap-4 border-b border-gray-100 bg-white/80">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Xem chi tiết Portfolio</h1>
      </header>

      <main className="pt-24 pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : portfolio ? (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <PortfolioRenderer
                  blocks={
                    Array.isArray(portfolio.blocks)
                      ? portfolio.blocks
                      : [portfolio.blocks]
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-32">
            <p className="text-gray-400 text-lg">Không tìm thấy portfolio</p>
          </div>
        )}
      </main>
    </div>
  );
}
