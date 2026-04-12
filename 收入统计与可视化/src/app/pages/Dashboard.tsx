import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { 
  DollarSign, 
  Bike, 
  Users, 
  TrendingUp,
  Activity,
  MapPin,
  Info
} from "lucide-react";
import { 
  mockScooters, 
  mockCustomers, 
  mockRentals,
  getRentalsByType 
} from "../data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from "react-router";

export function Dashboard() {
  const availableScooters = mockScooters.filter(s => s.status === 'available').length;
  const totalRevenue = mockRentals.reduce((sum, rental) => sum + rental.price, 0);
  const activeRentals = mockRentals.filter(r => r.status === 'active').length;
  const rentalStats = getRentalsByType();

  const chartData = Object.entries(rentalStats).map(([type, data]) => ({
    type: type.replace('hour', 'h').replace('day', 'd').replace('week', 'w'),
    rentals: data.count,
    revenue: data.revenue,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600 mt-2">Welcome to the Scooter Rental Management System</p>
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Info className="w-5 h-5" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/revenue" className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-slate-900 text-sm">View Revenue Stats</h3>
              <p className="text-xs text-slate-600 mt-1">Track income by type and date</p>
            </Link>
            <Link to="/scooters" className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Bike className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-slate-900 text-sm">Manage Scooters</h3>
              <p className="text-xs text-slate-600 mt-1">Update status and availability</p>
            </Link>
            <Link to="/map" className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <MapPin className="w-6 h-6 text-orange-600 mb-2" />
              <h3 className="font-semibold text-slate-900 text-sm">View Location Map</h3>
              <p className="text-xs text-slate-600 mt-1">See all scooters on the map</p>
            </Link>
            <Link to="/forecast" className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Activity className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-slate-900 text-sm">Revenue Forecast</h3>
              <p className="text-xs text-slate-600 mt-1">View predictions and insights</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Last 4 weeks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Available Scooters</CardTitle>
            <Bike className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{availableScooters}</div>
            <p className="text-xs text-slate-500 mt-1">Out of {mockScooters.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Rentals</CardTitle>
            <Activity className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{activeRentals}</div>
            <p className="text-xs text-slate-500 mt-1">Currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Customers</CardTitle>
            <Users className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{mockCustomers.length}</div>
            <p className="text-xs text-slate-500 mt-1">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Activity by Type</CardTitle>
          <p className="text-sm text-slate-600 mt-1">Number of rentals and revenue by rental duration</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="rentals" fill="#3b82f6" name="Number of Rentals" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Scooter Status Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { status: 'Available', count: mockScooters.filter(s => s.status === 'available').length, color: 'text-green-600' },
                { status: 'In Use', count: mockScooters.filter(s => s.status === 'unavailable').length, color: 'text-orange-600' },
                { status: 'Maintenance', count: mockScooters.filter(s => s.status === 'maintenance').length, color: 'text-red-600' },
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">{item.status}</span>
                  <span className={`text-xl font-bold ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Popular Rental Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(rentalStats)
                .sort(([, a], [, b]) => b.count - a.count)
                .map(([type, data]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700 capitalize">{type.replace('hour', ' Hour').replace('day', ' Day').replace('week', ' Week')}</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-900">{data.count}</div>
                      <div className="text-xs text-slate-500">${data.revenue}</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}