import { useState } from "react";
import { Plus, Edit, Trash2, Percent, Users, Check, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface Discount {
  id: string;
  name: string;
  userGroup: "frequent" | "student" | "senior" | "all";
  type: "percentage" | "fixed";
  value: number;
  minRentals?: number;
  active: boolean;
  description: string;
}

const mockDiscounts: Discount[] = [
  {
    id: "1",
    name: "频繁用户折扣",
    userGroup: "frequent",
    type: "percentage",
    value: 15,
    minRentals: 10,
    active: true,
    description: "累计租赁10次以上用户可享受15%折扣",
  },
  {
    id: "2",
    name: "学生优惠",
    userGroup: "student",
    type: "percentage",
    value: 20,
    active: true,
    description: "持有效学生证用户可享受20%折扣",
  },
  {
    id: "3",
    name: "老年人优惠",
    userGroup: "senior",
    type: "fixed",
    value: 5,
    active: true,
    description: "60岁以上用户每次租赁减免5元",
  },
];

const userGroupLabels = {
  frequent: "频繁用户",
  student: "学生",
  senior: "老年人",
  all: "所有用户",
};

const userGroupColors = {
  frequent: "bg-purple-100 text-purple-700",
  student: "bg-blue-100 text-blue-700",
  senior: "bg-green-100 text-green-700",
  all: "bg-gray-100 text-gray-700",
};

export function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [formData, setFormData] = useState<Partial<Discount>>({});

  const handleAdd = () => {
    setEditingDiscount(null);
    setFormData({
      name: "",
      userGroup: "all",
      type: "percentage",
      value: 10,
      active: true,
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData(discount);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDiscounts(discounts.filter((d) => d.id !== id));
    toast.success("折扣策略已删除");
  };

  const handleToggle = (id: string, active: boolean) => {
    setDiscounts(
      discounts.map((d) => (d.id === id ? { ...d, active } : d))
    );
    toast.success(active ? "折扣已启用" : "折扣已禁用");
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast.error("请填写所有必填字段");
      return;
    }

    if (editingDiscount) {
      setDiscounts(
        discounts.map((d) =>
          d.id === editingDiscount.id ? { ...d, ...formData } : d
        )
      );
      toast.success("折扣策略已更新");
    } else {
      const newDiscount: Discount = {
        id: Date.now().toString(),
        ...formData as Discount,
      };
      setDiscounts([...discounts, newDiscount]);
      toast.success("折扣策略已添加");
    }
    setIsDialogOpen(false);
  };

  const activeDiscounts = discounts.filter((d) => d.active);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">折扣策略管理</h1>
            <p className="text-gray-600 mt-1">
              设置针对特定用户群体的折扣规则
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="size-4" />
            添加折扣策略
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">总折扣策略</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {discounts.length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">启用中</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {activeDiscounts.length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">平均折扣率</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {activeDiscounts.length > 0
                ? (
                    activeDiscounts
                      .filter((d) => d.type === "percentage")
                      .reduce((sum, d) => sum + d.value, 0) /
                    activeDiscounts.filter((d) => d.type === "percentage").length
                  ).toFixed(0)
                : 0}
              %
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">用户群体</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {new Set(discounts.map((d) => d.userGroup)).size}
            </div>
          </div>
        </div>

        {/* Discount Cards */}
        <div className="space-y-4">
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {discount.name}
                    </h3>
                    <Badge className={userGroupColors[discount.userGroup]}>
                      <Users className="size-3 mr-1" />
                      {userGroupLabels[discount.userGroup]}
                    </Badge>
                    {!discount.active && (
                      <Badge className="bg-gray-100 text-gray-600">已禁用</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {discount.description}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Percent className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {discount.type === "percentage"
                          ? `${discount.value}% 折扣`
                          : `减免 ¥${discount.value}`}
                      </span>
                    </div>
                    {discount.minRentals && (
                      <div className="text-sm text-gray-600">
                        最低租赁次数: {discount.minRentals}次
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`switch-${discount.id}`} className="text-sm">
                      {discount.active ? "启用" : "禁用"}
                    </Label>
                    <Switch
                      id={`switch-${discount.id}`}
                      checked={discount.active}
                      onCheckedChange={(checked) =>
                        handleToggle(discount.id, checked)
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(discount)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(discount.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex gap-2">
            <Percent className="size-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900">折扣策略建议</h4>
              <p className="text-sm text-purple-700 mt-1">
                合理的折扣策略可以提高用户忠诚度和使用频率。建议为频繁用户提供
                10-20% 的折扣，为特殊群体（学生、老年人）提供社会福利性质的优惠。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDiscount ? "编辑折扣策略" : "添加折扣策略"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">折扣名称 *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="例如：频繁用户折扣"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userGroup">用户群体</Label>
              <Select
                value={formData.userGroup}
                onValueChange={(value: Discount["userGroup"]) =>
                  setFormData({ ...formData, userGroup: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frequent">频繁用户</SelectItem>
                  <SelectItem value="student">学生</SelectItem>
                  <SelectItem value="senior">老年人</SelectItem>
                  <SelectItem value="all">所有用户</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">折扣类型</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Discount["type"]) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">百分比折扣</SelectItem>
                    <SelectItem value="fixed">固定金额</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">
                  {formData.type === "percentage" ? "折扣比例 (%)" : "减免金额 (¥)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  max={formData.type === "percentage" ? "100" : undefined}
                  value={formData.value || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, value: parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>
            {formData.userGroup === "frequent" && (
              <div className="space-y-2">
                <Label htmlFor="minRentals">最低租赁次数</Label>
                <Input
                  id="minRentals"
                  type="number"
                  min="1"
                  value={formData.minRentals || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minRentals: parseInt(e.target.value),
                    })
                  }
                  placeholder="例如：10"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">描述 *</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="简要描述折扣策略的适用条件"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <Label htmlFor="active">立即启用此折扣策略</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="size-4 mr-2" />
              取消
            </Button>
            <Button onClick={handleSave}>
              <Check className="size-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
