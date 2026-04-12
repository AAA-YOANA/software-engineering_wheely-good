import { useState } from "react";
import { DollarSign, Clock, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { toast } from "sonner";

interface PricingTier {
  duration: string;
  label: string;
  price: number;
  cost: number;
  icon: string;
}

const mockPricing: PricingTier[] = [
  { duration: "1hour", label: "1小时", price: 15, cost: 3, icon: "⏱️" },
  { duration: "4hours", label: "4小时", price: 50, cost: 10, icon: "🕐" },
  { duration: "1day", label: "1天", price: 100, cost: 20, icon: "📅" },
  { duration: "1week", label: "1周", price: 500, cost: 100, icon: "📆" },
];

export function PricingPage() {
  const [pricing, setPricing] = useState<PricingTier[]>(mockPricing);

  const handlePriceChange = (duration: string, field: "price" | "cost", value: string) => {
    const numValue = parseFloat(value) || 0;
    setPricing(
      pricing.map((tier) =>
        tier.duration === duration ? { ...tier, [field]: numValue } : tier
      )
    );
  };

  const handleSave = () => {
    toast.success("定价配置已保存");
  };

  const calculateMargin = (price: number, cost: number) => {
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">定价配置</h1>
          <p className="text-gray-600 mt-1">
            设置或修改不同租赁时长的收费标准和成本
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">平均单价</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                ¥{(pricing.reduce((sum, p) => sum + p.price, 0) / pricing.length).toFixed(0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">总成本</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                ¥{pricing.reduce((sum, p) => sum + p.cost, 0).toFixed(0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">平均利润率</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {(
                  pricing.reduce(
                    (sum, p) => sum + calculateMargin(p.price, p.cost),
                    0
                  ) / pricing.length
                ).toFixed(1)}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Table */}
        <Card>
          <CardHeader>
            <CardTitle>租赁价格设置</CardTitle>
            <CardDescription>
              配置不同时长的租赁价格和运营成本
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pricing.map((tier) => (
                <div
                  key={tier.duration}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tier.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {tier.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          利润率:{" "}
                          <span
                            className={
                              calculateMargin(tier.price, tier.cost) > 70
                                ? "text-green-600 font-medium"
                                : calculateMargin(tier.price, tier.cost) > 50
                                ? "text-orange-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {calculateMargin(tier.price, tier.cost).toFixed(1)}%
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ¥{tier.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        利润: ¥{(tier.price - tier.cost).toFixed(0)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`price-${tier.duration}`}>
                        收费价格 (¥)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          id={`price-${tier.duration}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={tier.price}
                          onChange={(e) =>
                            handlePriceChange(tier.duration, "price", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`cost-${tier.duration}`}>
                        运营成本 (¥)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          id={`cost-${tier.duration}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={tier.cost}
                          onChange={(e) =>
                            handlePriceChange(tier.duration, "cost", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="gap-2">
                <Save className="size-4" />
                保存定价配置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-2">
            <Clock className="size-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">定价建议</h4>
              <p className="text-sm text-blue-700 mt-1">
                建议保持利润率在 70% 以上，以覆盖维护、充电、运营等额外成本。长期租赁可以设置更优惠的价格以吸引客户。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
