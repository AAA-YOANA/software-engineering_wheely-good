import { useParams, Link } from 'react-router';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import { ArrowLeft, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';
import { mockUsers, mockBookings } from '../data/mockData';

export function UserDetail() {
  const { userId } = useParams();
  const user = mockUsers.find((u) => u.id === userId);
  const userBookings = mockBookings.filter((b) => b.userId === userId);

  if (!user) {
    return (
      <Box>
        <Typography variant="h5">用户未找到</Typography>
        <Button component={Link} to="/users" startIcon={<ArrowLeft size={18} />} sx={{ mt: 2 }}>
          返回用户列表
        </Button>
      </Box>
    );
  }

  const stats = [
    {
      title: '总订单数',
      value: user.totalBookings,
      icon: TrendingUp,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      title: '总消费',
      value: `¥${user.totalSpent.toLocaleString()}`,
      icon: TrendingUp,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
    },
  ];

  return (
    <Box>
      <Button
        component={Link}
        to="/users"
        startIcon={<ArrowLeft size={18} />}
        sx={{ mb: 2 }}
      >
        返回用户列表
      </Button>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        用户详情
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              基本信息
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  用户ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {user.id}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  姓名
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Mail size={16} color="#757575" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    邮箱
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone size={16} color="#757575" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    电话
                  </Typography>
                  <Typography variant="body1">{user.phone}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={16} color="#757575" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    注册日期
                  </Typography>
                  <Typography variant="body1">{user.registrationDate}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  状态
                </Typography>
                <Chip
                  label={user.status === 'active' ? '活跃' : '不活跃'}
                  size="small"
                  color={user.status === 'active' ? 'success' : 'default'}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Grid item xs={12} sm={6} key={stat.title}>
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

            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  订单历史
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>订单ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>滑板车型号</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>开始时间</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>结束时间</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>费用</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>状态</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>{booking.scooterModel}</TableCell>
                          <TableCell>{booking.startDate}</TableCell>
                          <TableCell>{booking.endDate}</TableCell>
                          <TableCell>¥{booking.totalCost}</TableCell>
                          <TableCell>
                            <Chip
                              label={
                                booking.status === 'active'
                                  ? '进行中'
                                  : booking.status === 'completed'
                                  ? '已完成'
                                  : '已取消'
                              }
                              size="small"
                              color={
                                booking.status === 'active'
                                  ? 'success'
                                  : booking.status === 'completed'
                                  ? 'primary'
                                  : 'error'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}