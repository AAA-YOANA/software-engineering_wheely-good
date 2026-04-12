import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { Users, DollarSign, Bike, TrendingUp } from 'lucide-react';
import { mockUsers, mockBookings, mockScooters } from '../data/mockData';

const stats = [
  {
    title: '总用户数',
    value: mockUsers.length,
    icon: Users,
    color: '#1976d2',
    bgColor: '#e3f2fd',
  },
  {
    title: '活跃订单',
    value: mockBookings.filter(b => b.status === 'active').length,
    icon: TrendingUp,
    color: '#2e7d32',
    bgColor: '#e8f5e9',
  },
  {
    title: '可用滑板车',
    value: mockScooters.filter(s => s.status === 'available').length,
    icon: Bike,
    color: '#ed6c02',
    bgColor: '#fff3e0',
  },
  {
    title: '本月收入',
    value: `¥${mockBookings.reduce((sum, b) => sum + b.totalCost, 0).toLocaleString()}`,
    icon: DollarSign,
    color: '#9c27b0',
    bgColor: '#f3e5f5',
  },
];

export function Dashboard() {
  const recentBookings = mockBookings.slice(0, 5);
  const activeUsers = mockUsers.filter(u => u.status === 'active');

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        仪表盘
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card elevation={0} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: stat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={24} color={stat.color} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              最近订单
            </Typography>
            <Box>
              {recentBookings.map((booking) => (
                <Box
                  key={booking.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: '1px solid #e0e0e0',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {booking.userName}
                      {!booking.isRegistered && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            ml: 1,
                            px: 1,
                            py: 0.5,
                            backgroundColor: '#fff3e0',
                            color: '#ed6c02',
                            borderRadius: 1,
                          }}
                        >
                          未注册
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {booking.scooterModel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.startDate}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ¥{booking.totalCost}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          booking.status === 'active'
                            ? '#e8f5e9'
                            : booking.status === 'completed'
                            ? '#e3f2fd'
                            : '#ffebee',
                        color:
                          booking.status === 'active'
                            ? '#2e7d32'
                            : booking.status === 'completed'
                            ? '#1976d2'
                            : '#c62828',
                      }}
                    >
                      {booking.status === 'active'
                        ? '进行中'
                        : booking.status === 'completed'
                        ? '已完成'
                        : '已取消'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}