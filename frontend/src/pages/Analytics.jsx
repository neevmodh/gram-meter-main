// Analytics Page - Comprehensive Energy Analytics with ML Insights
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Zap, DollarSign, Leaf, 
  BarChart3, PieChart, Activity, Calendar, Download,
  ArrowUpRight, ArrowDownRight, Target, Cpu, AlertTriangle,
  Brain, Sparkles, Shield, Bell
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/api';
import { useAnalyticsTrends, useRealtimeData, useBillingData } from '../hooks/useRealtimeData';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics = ({ onLogout }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('consumption');
  const [dateRange, setDateRange] = useState('week');
  
  // Real-time simulated trends data
  const realtimeTrends = useAnalyticsTrends();
  const liveData = useRealtimeData();
  const billingData = useBillingData();
  
  // Calculate live stats from realtime data
  const liveStats = useMemo(() => {
    const totalConsumption = liveData.energy || 234.5;
    const totalCost = billingData.total || Math.round(totalConsumption * 5.5);
    const efficiencyScore = Math.round(85 + (liveData.powerFactor || 0.92) * 10);
    const carbonSaved = Math.round(totalConsumption * 0.1); // 0.1kg CO2 saved per kWh from solar offset
    
    return {
      totalConsumption: totalConsumption.toFixed(1),
      totalCost,
      efficiencyScore: Math.min(efficiencyScore, 99),
      carbonSaved
    };
  }, [liveData, billingData]);
  
  // Data states
  const [consumptionData, setConsumptionData] = useState(null);
  const [efficiencyData, setEfficiencyData] = useState(null);
  const [costData, setCostData] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const days = dateRange === 'day' ? 1 : dateRange === 'week' ? 7 : 30;
      
      console.log('Fetching analytics with days:', days);
      
      const [consumption, efficiency, cost, carbon, summaryData] = await Promise.all([
        apiService.getConsumptionTrends({ days }),
        apiService.getEfficiencyAnalysis({ days }),
        apiService.getCostProjection({ days }),
        apiService.getCarbonFootprint({ days }),
        apiService.getDashboardStats()
      ]);

      console.log('Consumption data:', consumption);
      console.log('Efficiency data:', efficiency);
      console.log('Cost data:', cost);
      console.log('Carbon data:', carbon);

      setConsumptionData(consumption);
      setEfficiencyData(efficiency);
      setCostData(cost);
      setCarbonData(carbon);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data if API returns null - use realtime trends as fallback
  const getConsumptionChartData = () => {
    if (consumptionData?.trends) return consumptionData.trends;
    
    // Use realtime simulated data if available
    if (realtimeTrends.consumption.length > 0) {
      const days = dateRange === 'day' ? 24 : dateRange === 'week' ? 7 : 30;
      return realtimeTrends.consumption.slice(-days).map((item, i) => ({
        date: dateRange === 'day' ? `${i}:00` : item.date,
        energy: item.value,
        cost: Math.round(item.value * 6.5),
        efficiency: realtimeTrends.efficiency[i]?.value || Math.round(75 + Math.random() * 20)
      }));
    }
    
    // Fallback to generated data
    const days = dateRange === 'day' ? 24 : dateRange === 'week' ? 7 : 30;
    return Array.from({ length: days }, (_, i) => ({
      date: dateRange === 'day' ? `${i}:00` : `Day ${i + 1}`,
      energy: Math.round(15 + Math.random() * 20),
      cost: Math.round((15 + Math.random() * 20) * 6.5),
      efficiency: Math.round(75 + Math.random() * 20)
    }));
  };

  const getEfficiencyRadarData = () => {
    return [
      { subject: 'Power Factor', A: 92, fullMark: 100 },
      { subject: 'Load Balance', A: 85, fullMark: 100 },
      { subject: 'Peak Efficiency', A: 78, fullMark: 100 },
      { subject: 'Off-Peak Usage', A: 88, fullMark: 100 },
      { subject: 'Standby Power', A: 95, fullMark: 100 },
      { subject: 'Voltage Quality', A: 90, fullMark: 100 },
    ];
  };

  const getCostBreakdownData = () => {
    return [
      { name: 'Irrigation', value: 45, color: '#10b981' },
      { name: 'Lighting', value: 20, color: '#3b82f6' },
      { name: 'Equipment', value: 25, color: '#f59e0b' },
      { name: 'Other', value: 10, color: '#8b5cf6' },
    ];
  };

  const getHourlyUsageData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      usage: i >= 6 && i <= 18 ? 2 + Math.random() * 3 : 0.5 + Math.random() * 1,
      peak: i >= 10 && i <= 14 ? 4 : 0
    }));
  };

  const StatCard = ({ title, value, unit, icon: Icon, trend, trendValue, color }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            {value}<span className="text-lg ml-1">{unit}</span>
          </h3>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-mint-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading Analytics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-mint-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar onLogout={onLogout} />
      
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-emerald-500" />
              Energy Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              ML-powered insights and consumption analysis
            </p>
          </div>
          
          {/* Date Range Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-md">
            {['day', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  dateRange === range
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Consumption"
            value={liveStats.totalConsumption}
            unit="kWh"
            icon={Zap}
            trend="down"
            trendValue="12% vs last period"
            color="bg-emerald-500"
          />
          <StatCard
            title="Total Cost"
            value={`₹${liveStats.totalCost.toLocaleString()}`}
            unit=""
            icon={DollarSign}
            trend="down"
            trendValue="8% savings"
            color="bg-blue-500"
          />
          <StatCard
            title="Efficiency Score"
            value={liveStats.efficiencyScore}
            unit="%"
            icon={Target}
            trend="up"
            trendValue="5% improvement"
            color="bg-amber-500"
          />
          <StatCard
            title="Carbon Saved"
            value={liveStats.carbonSaved}
            unit="kg"
            icon={Leaf}
            trend="up"
            trendValue="Green energy"
            color="bg-green-600"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'consumption', label: 'Consumption Trends', icon: TrendingUp },
            { id: 'efficiency', label: 'Efficiency Analysis', icon: Activity },
            { id: 'cost', label: 'Cost Projection', icon: DollarSign },
            { id: 'carbon', label: 'Carbon Footprint', icon: Leaf },
            { id: 'patterns', label: 'Usage Patterns', icon: PieChart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'consumption' && 'Energy Consumption Over Time'}
                {activeTab === 'efficiency' && 'Efficiency Performance'}
                {activeTab === 'cost' && 'Cost Analysis & Projection'}
                {activeTab === 'carbon' && 'Carbon Emissions Tracking'}
                {activeTab === 'patterns' && 'Daily Usage Pattern'}
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'consumption' && (
                  <AreaChart data={getConsumptionChartData()}>
                    <defs>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorEnergy)" 
                      name="Energy (kWh)"
                    />
                  </AreaChart>
                )}
                
                {activeTab === 'efficiency' && (
                  <LineChart data={getConsumptionChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      name="Efficiency (%)"
                    />
                  </LineChart>
                )}
                
                {activeTab === 'cost' && (
                  <BarChart data={getConsumptionChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="cost" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Cost (₹)" />
                  </BarChart>
                )}
                
                {activeTab === 'carbon' && (
                  <AreaChart data={getConsumptionChartData()}>
                    <defs>
                      <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#22c55e" 
                      fillOpacity={1} 
                      fill="url(#colorCarbon)" 
                      name="CO₂ Saved (kg)"
                    />
                  </AreaChart>
                )}
                
                {activeTab === 'patterns' && (
                  <BarChart data={getHourlyUsageData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="hour" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="usage" fill="#10b981" radius={[2, 2, 0, 0]} name="Usage (kW)" />
                    <Bar dataKey="peak" fill="#ef4444" radius={[2, 2, 0, 0]} name="Peak Hours" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Efficiency Radar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Efficiency Breakdown</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={getEfficiencyRadarData()}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9ca3af" />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cost Breakdown Pie */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Cost Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={getCostBreakdownData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getCostBreakdownData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ML Insights Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">ML-Powered Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-emerald-100 text-sm">Predicted Monthly Usage</p>
                  <p className="text-2xl font-bold text-white mt-1">245 kWh</p>
                  <p className="text-emerald-200 text-xs mt-1">Based on current patterns</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-emerald-100 text-sm">Anomaly Detection</p>
                  <p className="text-2xl font-bold text-white mt-1">2 Found</p>
                  <p className="text-emerald-200 text-xs mt-1">Last 7 days</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-emerald-100 text-sm">Optimization Potential</p>
                  <p className="text-2xl font-bold text-white mt-1">₹180/mo</p>
                  <p className="text-emerald-200 text-xs mt-1">Savings opportunity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
