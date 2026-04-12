import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { mockScooters, Scooter, ScooterStatus } from "../data/mockData";
import { Battery, MapPin, Wrench, Check, X } from "lucide-react";
import { toast } from "sonner";

export function ScooterManagement() {
  const [scooters, setScooters] = useState<Scooter[]>(mockScooters);
  const [filterStatus, setFilterStatus] = useState<ScooterStatus | 'all'>('all');

  const filteredScooters = filterStatus === 'all' 
    ? scooters 
    : scooters.filter(s => s.status === filterStatus);

  const updateScooterStatus = (scooterId: string, newStatus: ScooterStatus) => {
    setScooters(prev =>
      prev.map(scooter =>
        scooter.id === scooterId ? { ...scooter, status: newStatus } : scooter
      )
    );
    
    const statusText = newStatus === 'available' ? 'Available' : 
                      newStatus === 'unavailable' ? 'Unavailable' : 'Maintenance';
    toast.success(`Scooter status updated to ${statusText}`);
  };

  const getStatusBadge = (status: ScooterStatus) => {
    const variants = {
      available: 'default',
      unavailable: 'secondary',
      maintenance: 'destructive',
    } as const;

    const labels = {
      available: 'Available',
      unavailable: 'In Use',
      maintenance: 'Maintenance',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status]}
      </Badge>
    );
  };

  const getBatteryColor = (level: number) => {
    if (level >= 70) return 'text-green-600';
    if (level >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = {
    available: scooters.filter(s => s.status === 'available').length,
    unavailable: scooters.filter(s => s.status === 'unavailable').length,
    maintenance: scooters.filter(s => s.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Scooter Management</h1>
          <p className="text-slate-600 mt-2">Monitor and update scooter status (Backlog ID 10, 17)</p>
        </div>

        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ScooterStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scooters</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">In Use</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">{stats.available}</span>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-orange-600">{stats.unavailable}</span>
              <X className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-red-600">{stats.maintenance}</span>
              <Wrench className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scooter Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scooter List</CardTitle>
          <p className="text-sm text-slate-600 mt-1">
            {filteredScooters.length} scooter{filteredScooters.length !== 1 ? 's' : ''} found
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="hidden md:table-cell">Last Maintenance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScooters.map((scooter) => (
                  <TableRow key={scooter.id}>
                    <TableCell className="font-medium">{scooter.id}</TableCell>
                    <TableCell>{scooter.name}</TableCell>
                    <TableCell>{getStatusBadge(scooter.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Battery className={`w-4 h-4 ${getBatteryColor(scooter.batteryLevel)}`} />
                        <span className={getBatteryColor(scooter.batteryLevel)}>
                          {scooter.batteryLevel}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="w-3 h-3" />
                        {scooter.location.address}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-slate-600">
                      {new Date(scooter.lastMaintenance).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={scooter.status}
                        onValueChange={(value) => updateScooterStatus(scooter.id, value as ScooterStatus)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="unavailable">In Use</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredScooters.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No scooters found with the selected status
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setScooters(prev =>
                  prev.map(s => s.status === 'unavailable' ? { ...s, status: 'available' } : s)
                );
                toast.success('All in-use scooters marked as available');
              }}
            >
              Mark All In-Use as Available
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const lowBattery = scooters.filter(s => s.batteryLevel < 30);
                setScooters(prev =>
                  prev.map(s => s.batteryLevel < 30 ? { ...s, status: 'maintenance' } : s)
                );
                toast.success(`${lowBattery.length} scooters with low battery sent to maintenance`);
              }}
            >
              Send Low Battery to Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
