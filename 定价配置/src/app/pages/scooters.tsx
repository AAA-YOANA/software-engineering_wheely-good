import { useState } from "react";
import { Plus, Edit, Trash2, Battery, MapPin, Check, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface Scooter {
  id: string;
  model: string;
  serialNumber: string;
  battery: number;
  status: "available" | "in-use" | "maintenance" | "offline";
  location: string;
  lastMaintenance: string;
}

const mockScooters: Scooter[] = [
  {
    id: "1",
    model: "小米电动滑板车 Pro 2",
    serialNumber: "XM2023001",
    battery: 85,
    status: "available",
    location: "朝阳区望京SOHO",
    lastMaintenance: "2026-03-15",
  },
  {
    id: "2",
    model: "九号电动滑板车 Max",
    serialNumber: "NB2023045",
    battery: 45,
    status: "in-use",
    location: "海淀区中关村",
    lastMaintenance: "2026-03-10",
  },
  {
    id: "3",
    model: "小米电动滑板车 Pro 2",
    serialNumber: "XM2023012",
    battery: 20,
    status: "maintenance",
    location: "维修中心",
    lastMaintenance: "2026-02-28",
  },
];

const statusColors = {
  available: "bg-green-100 text-green-700",
  "in-use": "bg-blue-100 text-blue-700",
  maintenance: "bg-orange-100 text-orange-700",
  offline: "bg-gray-100 text-gray-700",
};

const statusLabels = {
  available: "可用",
  "in-use": "使用中",
  maintenance: "维护中",
  offline: "离线",
};

export function ScootersPage() {
  const [scooters, setScooters] = useState<Scooter[]>(mockScooters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScooter, setEditingScooter] = useState<Scooter | null>(null);
  const [formData, setFormData] = useState<Partial<Scooter>>({});

  const handleAdd = () => {
    setEditingScooter(null);
    setFormData({
      model: "",
      serialNumber: "",
      battery: 100,
      status: "available",
      location: "",
      lastMaintenance: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (scooter: Scooter) => {
    setEditingScooter(scooter);
    setFormData(scooter);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setScooters(scooters.filter((s) => s.id !== id));
    toast.success("滑板车已删除");
  };

  const handleSave = () => {
    if (!formData.model || !formData.serialNumber || !formData.location) {
      toast.error("请填写所有必填字段");
      return;
    }

    if (editingScooter) {
      setScooters(
        scooters.map((s) => (s.id === editingScooter.id ? { ...s, ...formData } : s))
      );
      toast.success("滑板车信息已更新");
    } else {
      const newScooter: Scooter = {
        id: Date.now().toString(),
        ...formData as Scooter,
      };
      setScooters([...scooters, newScooter]);
      toast.success("滑板车已添加");
    }
    setIsDialogOpen(false);
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return "text-green-600";
    if (battery > 30) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">滑板车管理</h1>
            <p className="text-gray-600 mt-1">
              添加、编辑或删除系统中的电动滑板车信息
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="size-4" />
            添加滑板车
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">总数</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {scooters.length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">可用</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {scooters.filter((s) => s.status === "available").length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">使用中</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {scooters.filter((s) => s.status === "in-use").length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">维护中</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">
              {scooters.filter((s) => s.status === "maintenance").length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  型号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  序列号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  电量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  位置
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  上次维护
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scooters.map((scooter) => (
                <tr key={scooter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {scooter.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {scooter.serialNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Battery
                        className={`size-4 ${getBatteryColor(scooter.battery)}`}
                      />
                      <span
                        className={`text-sm font-medium ${getBatteryColor(
                          scooter.battery
                        )}`}
                      >
                        {scooter.battery}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={statusColors[scooter.status]}>
                      {statusLabels[scooter.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="size-4" />
                      {scooter.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {scooter.lastMaintenance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(scooter)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(scooter.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingScooter ? "编辑滑板车" : "添加滑板车"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="model">型号 *</Label>
              <Input
                id="model"
                value={formData.model || ""}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="例如：小米电动滑板车 Pro 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">序列号 *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                placeholder="例如：XM2023001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="battery">电量 (%)</Label>
              <Input
                id="battery"
                type="number"
                min="0"
                max="100"
                value={formData.battery || 100}
                onChange={(e) =>
                  setFormData({ ...formData, battery: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Scooter["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">可用</SelectItem>
                  <SelectItem value="in-use">使用中</SelectItem>
                  <SelectItem value="maintenance">维护中</SelectItem>
                  <SelectItem value="offline">离线</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">位置 *</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="例如：朝阳区望京SOHO"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastMaintenance">上次维护日期</Label>
              <Input
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastMaintenance: e.target.value })
                }
              />
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
