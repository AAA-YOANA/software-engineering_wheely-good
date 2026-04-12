import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { Calendar, Clock, User, DollarSign } from 'lucide-react';
import { mockScooters } from '../data/mockData';
import { toast } from 'sonner';

export function CreateBooking() {
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    scooterId: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);

  const availableScooters = mockScooters.filter(
    (scooter) => scooter.status === 'available'
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Recalculate cost if relevant fields change
    if (['scooterId', 'startDate', 'startTime', 'endDate', 'endTime'].includes(field)) {
      calculateCost({ ...formData, [field]: value });
    }
  };

  const calculateCost = (data: typeof formData) => {
    if (!data.scooterId || !data.startDate || !data.startTime || !data.endDate || !data.endTime) {
      setCalculatedCost(null);
      return;
    }

    const scooter = mockScooters.find((s) => s.id === data.scooterId);
    if (!scooter) {
      setCalculatedCost(null);
      return;
    }

    const start = new Date(`${data.startDate}T${data.startTime}`);
    const end = new Date(`${data.endDate}T${data.endTime}`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      setCalculatedCost(null);
      return;
    }

    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    const cost = hours * scooter.pricePerHour;
    setCalculatedCost(cost);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName || !formData.userPhone || !formData.scooterId) {
      toast.error('请填写所有必填字段');
      return;
    }

    if (!calculatedCost) {
      toast.error('请选择有效的租赁时间');
      return;
    }

    // In a real app, this would make an API call
    toast.success('预订创建成功！');
    
    // Reset form
    setFormData({
      userName: '',
      userPhone: '',
      userEmail: '',
      scooterId: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    });
    setCalculatedCost(null);
  };

  const selectedScooter = mockScooters.find((s) => s.id === formData.scooterId);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        创建预订（未注册用户）
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        此功能用于代表未注册的顾客创建订单。客户将通过电话或邮箱收到订单确认。
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                客户信息
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="姓名"
                    required
                    value={formData.userName}
                    onChange={(e) => handleChange('userName', e.target.value)}
                    InputProps={{
                      startAdornment: <User size={18} style={{ marginRight: 8 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="电话"
                    required
                    value={formData.userPhone}
                    onChange={(e) => handleChange('userPhone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="邮箱（可选）"
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => handleChange('userEmail', e.target.value)}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                租赁信息
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>选择滑板车</InputLabel>
                    <Select
                      value={formData.scooterId}
                      label="选择滑板车"
                      onChange={(e) => handleChange('scooterId', e.target.value)}
                    >
                      {availableScooters.map((scooter) => (
                        <MenuItem key={scooter.id} value={scooter.id}>
                          {scooter.model} - ¥{scooter.pricePerHour}/小时
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="开始日期"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Calendar size={18} style={{ marginRight: 8 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="开始时间"
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Clock size={18} style={{ marginRight: 8 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="结束日期"
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Calendar size={18} style={{ marginRight: 8 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="结束时间"
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Clock size={18} style={{ marginRight: 8 }} />,
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
              >
                创建预订
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, position: 'sticky', top: 100 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                订单摘要
              </Typography>

              {selectedScooter ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      滑板车型号
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedScooter.model}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      价格
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ¥{selectedScooter.pricePerHour}/小时
                    </Typography>
                  </Box>
                  {calculatedCost !== null && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: '#e3f2fd',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <DollarSign size={20} color="#1976d2" />
                        <Typography variant="body2" color="text.secondary">
                          预计费用
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        ¥{calculatedCost}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  请选择滑板车以查看订单详情
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}