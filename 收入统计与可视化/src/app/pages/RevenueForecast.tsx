import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  mockRentals, 
  mockCustomers, 
  getRentalsByType,
  getDailyRevenue,
  rentalPrices 
} from "../data/mockData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Calendar, DollarSign, Users } from "lucide-react";

export function RevenueForecast() {
  const dailyRevenue = getDailyRevenue();
  const rentalStats = getRentalsByType();
  
  // Calculate average daily revenue
  const avgDailyRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0) / dailyRevenue.length;
  
  // Calculate growth rate (simple linear trend)
  const recentRevenue = dailyRevenue.slice(-7).reduce((sum, day) => sum + day.revenue, 0) / 7;
  const olderRevenue = dailyRevenue.slice(0, 7).reduce((sum, day) => sum + day.revenue, 0) / 7;
  const growthRate = ((recentRevenue - olderRevenue) / olderRevenue) * 100;

  // Generate forecast for next 7 days
  const lastDate = new Date(dailyRevenue[dailyRevenue.length - 1].date);
  const forecast = [];
  
  for (let i = 1; i <= 7; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    // Simple forecast: average + trend + random variation
    const baseRevenue = avgDailyRevenue;
    const trend = (avgDailyRevenue * (growthRate / 100)) * i;
    const variation = (Math.random() - 0.5) * 20; // ±10 variation
    
    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      revenue: Math.max(0, baseRevenue + trend + variation),
      dayOfWeek: forecastDate.toLocaleDateString('en-US', { weekday: 'short' }),
      isForecast: true,
    });
  }

  // Combine historical and forecast data
  const combinedData = [
    ...dailyRevenue.slice(-14).map(d => ({ ...d, isForecast: false })),
    ...forecast,
  ];

  // Calculate monthly forecast
  const avgMonthlyRevenue = avgDailyRevenue * 30;
  const forecastMonthlyRevenue = avgMonthlyRevenue * (1 + growthRate / 100);

  // Calculate projected annual revenue
  const projectedAnnualRevenue = forecastMonthlyRevenue * 12;

  // Customer retention forecast
  const activeCustomers = mockCustomers.length;
  const avgRentalsPerCustomer = mockRentals.length / activeCustomers;
  const projectedCustomerGrowth = Math.round(activeCustomers * (1 + growthRate / 200)); // Half growth rate

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Revenue Forecast</h1>
        <p className="text-slate-600 mt-2">
          Profit predictions based on existing customer and rental data
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </span>
              <Badge variant={growthRate >= 0 ? 'default' : 'destructive'}>
                {growthRate >= 0 ? 'Growing' : 'Declining'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">Last 7 days vs previous</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Monthly Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ${forecastMonthlyRevenue.toFixed(0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Expected for next month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Annual Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ${projectedAnnualRevenue.toFixed(0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Projected yearly revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Customer Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {projectedCustomerGrowth}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Expected customers (+{projectedCustomerGrowth - activeCustomers})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 7-Day Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Revenue Forecast</CardTitle>
          <p className="text-sm text-slate-600 mt-1">
            Historical data (last 14 days) and predicted revenue
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={payload.isForecast ? '#10b981' : '#3b82f6'}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-600">Historical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-600">Forecast</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast by Rental Type */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast by Rental Type</CardTitle>
          <p className="text-sm text-slate-600 mt-1">
            Expected revenue distribution for next month
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={Object.entries(rentalStats).map(([type, data]) => ({
                type: type.replace('hour', 'h').replace('day', 'd').replace('week', 'w'),
                current: data.revenue,
                forecast: data.revenue * (1 + growthRate / 100) * 1.2, // Next month projection
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name="Current Month" />
              <Bar dataKey="forecast" fill="#10b981" name="Next Month (Forecast)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Average Daily Revenue</h4>
              <p className="text-2xl font-bold text-blue-600">${avgDailyRevenue.toFixed(2)}</p>
              <p className="text-sm text-blue-700 mt-1">Based on last 28 days</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Most Popular Duration</h4>
              <p className="text-2xl font-bold text-green-600">
                {Object.entries(rentalStats)
                  .sort(([, a], [, b]) => b.count - a.count)[0][0]
                  .replace('hour', ' Hour')
                  .replace('day', ' Day')
                  .replace('week', ' Week')}
              </p>
              <p className="text-sm text-green-700 mt-1">
                {Object.entries(rentalStats).sort(([, a], [, b]) => b.count - a.count)[0][1].count} rentals
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Customer Engagement</h4>
              <p className="text-2xl font-bold text-purple-600">
                {avgRentalsPerCustomer.toFixed(1)}
              </p>
              <p className="text-sm text-purple-700 mt-1">Average rentals per customer</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {growthRate > 5 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-900">
                  <strong>✓ Strong Growth:</strong> Consider expanding your fleet to meet increasing demand.
                </p>
              </div>
            )}

            {growthRate < 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-900">
                  <strong>⚠ Declining Trend:</strong> Review pricing strategy and marketing efforts.
                </p>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>💡 Pricing Strategy:</strong> The{' '}
                {Object.entries(rentalStats)
                  .sort(([, a], [, b]) => b.revenue - a.revenue)[0][0]
                  .replace('hour', '-hour')
                  .replace('day', '-day')
                  .replace('week', '-week')}{' '}
                rental generates the most revenue.
              </p>
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-900">
                <strong>📊 Optimize Operations:</strong> Focus maintenance during low-demand periods to maximize availability.
              </p>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-900">
                <strong>🎯 Customer Retention:</strong> Implement loyalty programs to increase repeat rentals.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
