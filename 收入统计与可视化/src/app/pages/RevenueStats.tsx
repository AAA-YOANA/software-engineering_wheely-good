import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { getWeeklyRevenue, getDailyRevenue, getRentalsByType } from "../data/mockData";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export function RevenueStats() {
  const weeklyData = getWeeklyRevenue();
  const dailyData = getDailyRevenue();
  const rentalTypeStats = getRentalsByType();

  const rentalTypePieData = Object.entries(rentalTypeStats).map(([type, data]) => ({
    name: type.replace('hour', 'h').replace('day', 'd').replace('week', 'w'),
    value: data.revenue,
  }));

  const totalRevenue = Object.values(rentalTypeStats).reduce((sum, data) => sum + data.revenue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Revenue Statistics</h1>
        <p className="text-slate-600 mt-2">Track income by rental type and date</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(rentalTypeStats).map(([type, data], index) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 capitalize">
                {type.replace('hour', ' Hour').replace('day', ' Day').replace('week', ' Week')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">${data.revenue}</div>
              <p className="text-xs text-slate-500 mt-1">{data.count} rentals</p>
              <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${(data.revenue / totalRevenue) * 100}%`,
                    backgroundColor: COLORS[index],
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full sm:w-auto grid-cols-3 sm:inline-grid">
          <TabsTrigger value="weekly">Weekly Revenue</TabsTrigger>
          <TabsTrigger value="daily">Daily Revenue</TabsTrigger>
          <TabsTrigger value="types">By Type</TabsTrigger>
        </TabsList>

        {/* Weekly Revenue by Type */}
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue by Rental Type</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Track popular rental durations (Backlog ID 19)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="week" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Week of ${new Date(value).toLocaleDateString()}`}
                    formatter={(value: number) => [`$${value}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="1hour" stackId="a" fill={COLORS[0]} name="1 Hour" />
                  <Bar dataKey="4hours" stackId="a" fill={COLORS[1]} name="4 Hours" />
                  <Bar dataKey="1day" stackId="a" fill={COLORS[2]} name="1 Day" />
                  <Bar dataKey="1week" stackId="a" fill={COLORS[3]} name="1 Week" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Revenue */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Trend</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Track popular rental dates (Backlog ID 20)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
                    }}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Daily Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Day of Week Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Day of Week</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Identify peak rental days
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(
                  dailyData.reduce((acc, day) => {
                    if (!acc[day.dayOfWeek]) acc[day.dayOfWeek] = 0;
                    acc[day.dayOfWeek] += day.revenue;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([, a], [, b]) => b - a)
                  .map(([day, revenue]) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-700">{day}</span>
                      <span className="text-xl font-bold text-slate-900">${revenue.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue by Type */}
        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution by Rental Type</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Visual breakdown of income sources (Backlog ID 21)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={rentalTypePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rentalTypePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(rentalTypeStats).map(([type, data], index) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">
                    {type.replace('hour', ' Hour').replace('day', ' Day').replace('week', ' Week')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Rentals:</span>
                      <span className="font-bold text-slate-900">{data.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Revenue:</span>
                      <span className="font-bold text-slate-900">${data.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Average per Rental:</span>
                      <span className="font-bold text-slate-900">
                        ${(data.revenue / data.count).toFixed(2)}
                      </span>
                    </div>
                    <div 
                      className="mt-4 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
