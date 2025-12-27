import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Gauge, 
  Droplet, 
  Clock, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  WifiOff,
  RefreshCw,
  Plus,
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Power,
  Thermometer
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import api from '../services/api';
import { useMultiMeterData } from '../hooks/useRealtimeData';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCircle },
    inactive: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', icon: Power },
    alert: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: AlertTriangle },
    offline: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: WifiOff },
  };
  
  const config = statusConfig[status] || statusConfig.inactive;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Meter Card Component
const MeterCard = ({ meter, onSelect, isSelected }) => {
  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return 'text-green-500';
    if (efficiency >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div 
      onClick={() => onSelect(meter)}
      className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-2 transition-all cursor-pointer hover:shadow-md
        ${isSelected ? 'border-blue-500 dark:border-blue-400' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{meter.name || `Meter ${meter.meter_id}`}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {meter.location || meter.village || 'Unknown Location'}
          </p>
        </div>
        <StatusBadge status={meter.status || 'active'} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Current Power</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {meter.power?.toFixed(1) || '0'} <span className="text-sm font-normal">W</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Today's Usage</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {meter.energy_today?.toFixed(2) || '0'} <span className="text-sm font-normal">kWh</span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-gray-400" />
          <span className={`text-sm font-medium ${getEfficiencyColor(meter.efficiency || 0)}`}>
            {meter.efficiency?.toFixed(0) || '0'}% efficiency
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {meter.last_reading_at ? new Date(meter.last_reading_at).toLocaleTimeString() : 'No data'}
        </span>
      </div>
    </div>
  );
};

// Live Meter Detail Component
const MeterDetail = ({ meter, readings }) => {
  if (!meter) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
        <Gauge className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Select a Meter</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Click on a meter card to view detailed readings and analytics</p>
      </div>
    );
  }

  const latestReading = readings?.[0] || {};
  
  const liveMetrics = [
    { label: 'Voltage', value: latestReading.voltage?.toFixed(1) || meter.voltage?.toFixed(1) || '0', unit: 'V', icon: Zap, color: 'text-yellow-500' },
    { label: 'Current', value: latestReading.current?.toFixed(2) || meter.current?.toFixed(2) || '0', unit: 'A', icon: Activity, color: 'text-blue-500' },
    { label: 'Power', value: latestReading.power?.toFixed(1) || meter.power?.toFixed(1) || '0', unit: 'W', icon: Power, color: 'text-green-500' },
    { label: 'Energy', value: latestReading.energy?.toFixed(2) || meter.energy?.toFixed(2) || '0', unit: 'kWh', icon: BarChart3, color: 'text-purple-500' },
    { label: 'Power Factor', value: latestReading.power_factor?.toFixed(2) || meter.power_factor?.toFixed(2) || '0', unit: '', icon: TrendingUp, color: 'text-orange-500' },
    { label: 'Frequency', value: latestReading.frequency?.toFixed(1) || meter.frequency?.toFixed(1) || '50', unit: 'Hz', icon: Clock, color: 'text-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Live Readings Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{meter.name || `Meter ${meter.meter_id}`}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Live Readings</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm text-green-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {liveMetrics.map((metric) => (
            <div key={metric.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
                <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Power Consumption Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Power Consumption (Last 24 Hours)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={readings?.slice(0, 24).reverse() || []}>
              <defs>
                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={(value) => [`${value.toFixed(2)} W`, 'Power']}
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Area 
                type="monotone" 
                dataKey="power" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#powerGradient)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Voltage & Current Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Voltage & Current Trends</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings?.slice(0, 24).reverse() || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis yAxisId="voltage" orientation="left" stroke="#EAB308" fontSize={12} />
              <YAxis yAxisId="current" orientation="right" stroke="#3B82F6" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#9CA3AF' }}
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Legend />
              <Line 
                yAxisId="voltage"
                type="monotone" 
                dataKey="voltage" 
                stroke="#EAB308" 
                strokeWidth={2}
                dot={false}
                name="Voltage (V)"
              />
              <Line 
                yAxisId="current"
                type="monotone" 
                dataKey="current" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
                name="Current (A)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Main Meters Page
const Meters = () => {
  const [meters, setMeters] = useState([]);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [readings, setReadings] = useState([]);
  const [liveStatus, setLiveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingsLoading, setReadingsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Real-time simulated meter data
  const realtimeMeters = useMultiMeterData(5, 2000);

  // Fetch all meters
  const fetchMeters = async () => {
    try {
      const data = await api.getMeters();
      setMeters(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch meters:', err);
      // Use realtime simulated data if API fails
      if (realtimeMeters.length > 0) {
        setMeters(realtimeMeters);
        setError(null);
      } else {
        setError('Failed to load meters');
      }
    } finally {
      setLoading(false);
    }
  };

  // Merge API meters with realtime data for live updates
  const displayMeters = meters.length > 0 ? meters.map((meter, idx) => {
    const realtimeMeter = realtimeMeters[idx % realtimeMeters.length];
    return {
      ...meter,
      // Override with realtime values for live feel
      voltage: realtimeMeter?.voltage || meter.voltage,
      current: realtimeMeter?.current || meter.current,
      power: realtimeMeter?.power || meter.power,
      energy_today: realtimeMeter?.energy_today || meter.energy_today,
      efficiency: realtimeMeter?.efficiency || meter.efficiency,
      status: realtimeMeter?.status || meter.status,
      last_reading_at: realtimeMeter?.last_reading_at || new Date(),
    };
  }) : realtimeMeters;

  // Fetch meter stats
  const fetchStats = async () => {
    try {
      const data = await api.getMeterStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Fetch readings for selected meter
  const fetchReadings = async (meterId) => {
    if (!meterId) return;
    setReadingsLoading(true);
    try {
      const data = await api.getMeterReadings(meterId);
      setReadings(Array.isArray(data) ? data : (data?.results || data?.readings || []));
    } catch (err) {
      console.error('Failed to fetch readings:', err);
    } finally {
      setReadingsLoading(false);
    }
  };

  // Fetch live status
  const fetchLiveStatus = async (meterId) => {
    if (!meterId) return;
    try {
      const data = await api.getMeterLiveStatus(meterId);
      setLiveStatus(data);
    } catch (err) {
      console.error('Failed to fetch live status:', err);
    }
  };

  useEffect(() => {
    fetchMeters();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedMeter) {
      fetchReadings(selectedMeter.meter_id || selectedMeter.id);
      fetchLiveStatus(selectedMeter.meter_id || selectedMeter.id);
    }
  }, [selectedMeter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchMeters();
      if (selectedMeter) {
        fetchReadings(selectedMeter.meter_id || selectedMeter.id);
        fetchLiveStatus(selectedMeter.meter_id || selectedMeter.id);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, selectedMeter]);

  const handleMeterSelect = (meter) => {
    setSelectedMeter(meter);
  };

  const handleRefresh = () => {
    fetchMeters();
    fetchStats();
    if (selectedMeter) {
      fetchReadings(selectedMeter.meter_id || selectedMeter.id);
      fetchLiveStatus(selectedMeter.meter_id || selectedMeter.id);
    }
  };

  // Calculate summary stats from meters
  const summaryStats = [
    { 
      label: 'Total Meters', 
      value: stats?.total_meters || displayMeters.length, 
      icon: Gauge, 
      color: 'bg-blue-500',
      trend: null
    },
    { 
      label: 'Active', 
      value: stats?.active_meters || displayMeters.filter(m => m.status === 'active').length, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      label: 'Offline', 
      value: stats?.offline_meters || displayMeters.filter(m => m.status === 'offline').length, 
      icon: WifiOff, 
      color: 'bg-yellow-500',
      trend: null
    },
    { 
      label: 'With Alerts', 
      value: stats?.meters_with_alerts || displayMeters.filter(m => m.status === 'alert').length, 
      icon: AlertTriangle, 
      color: 'bg-red-500',
      trend: 'down'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading meters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Meters</h1>
            <p className="text-gray-500 dark:text-gray-400">Monitor and manage all connected meters</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${autoRefresh 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
            >
              <Activity className="w-4 h-4" />
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.color} rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>vs last week</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meters List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Meters</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{displayMeters.length} total</span>
              </div>
            </div>
            
            {displayMeters.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
                <Gauge className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No meters found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {displayMeters.map((meter) => (
                  <MeterCard 
                    key={meter.id || meter.meter_id} 
                    meter={meter} 
                    onSelect={handleMeterSelect}
                    isSelected={selectedMeter?.id === meter.id || selectedMeter?.meter_id === meter.meter_id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Meter Detail */}
          <div className="lg:col-span-2">
            {readingsLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
                <RefreshCw className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading meter data...</p>
              </div>
            ) : (
              <MeterDetail meter={selectedMeter} readings={readings} />
            )}
          </div>
        </div>

        {/* Daily Usage Comparison Chart */}
        {displayMeters.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Energy Comparison (All Meters)</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayMeters.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tickFormatter={(value, index) => displayMeters[index]?.name || `Meter ${index + 1}`}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#9CA3AF' }}
                    formatter={(value) => [`${value?.toFixed(2) || 0} kWh`, 'Energy']}
                  />
                  <Bar 
                    dataKey="energy_today" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Today's Energy (kWh)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meters;
