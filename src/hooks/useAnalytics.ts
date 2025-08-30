import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CohortData {
  cohort_month: string;
  month_0: number;
  month_1: number;
  month_2: number;
  month_3: number;
}

export interface ChurnData {
  user_id: string;
  last_order_date: string | null;
  region: string;
  total_spent: number;
}

export interface HighValueCustomer {
  user_id: string;
  region: string;
  total_spent: number;
  order_count: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export const useAnalytics = (filters: {
  selectedRegion: string;
  selectedPeriod: string;
  startDate?: string;
  endDate?: string;
}) => {
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  const [churnData, setChurnData] = useState<ChurnData[]>([]);
  const [highValueCustomers, setHighValueCustomers] = useState<HighValueCustomer[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildRegionFilter = (region: string) => {
    return region === "all" ? "" : `AND u.region = '${region}'`;
  };

  const fetchCohortData = async () => {
    try {
      let query = supabase
        .from('users')
        .select(`
          user_id,
          signup_date,
          region,
          orders(order_date)
        `);

      if (filters.selectedRegion !== "all") {
        query = query.eq('region', filters.selectedRegion);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Process cohort data manually
      const cohortMap = new Map();
      
      data?.forEach(user => {
        const cohortMonth = new Date(user.signup_date).toISOString().slice(0, 7);
        
        if (!cohortMap.has(cohortMonth)) {
          cohortMap.set(cohortMonth, { cohort_month: cohortMonth, month_0: 0, month_1: 0, month_2: 0, month_3: 0 });
        }
        
        const cohort = cohortMap.get(cohortMonth);
        cohort.month_0++;
        
        if (user.orders && user.orders.length > 0) {
          const signupDate = new Date(user.signup_date);
          user.orders.forEach((order: any) => {
            const orderDate = new Date(order.order_date);
            const monthDiff = Math.floor((orderDate.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
            
            if (monthDiff === 1) cohort.month_1++;
            else if (monthDiff === 2) cohort.month_2++;
            else if (monthDiff === 3) cohort.month_3++;
          });
        }
      });

      return Array.from(cohortMap.values()).sort((a, b) => a.cohort_month.localeCompare(b.cohort_month));
    } catch (error) {
      console.error('Cohort fetch error:', error);
      return [];
    }
  };

  const fetchChurnData = async () => {
    try {
      let query = supabase
        .from('users')
        .select(`
          user_id,
          region,
          orders(order_date, amount)
        `);

      if (filters.selectedRegion !== "all") {
        query = query.eq('region', filters.selectedRegion);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Find churned users (no orders in last 60 days)
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const churnedUsers = data?.filter(user => {
        if (!user.orders || user.orders.length === 0) return true;
        
        const latestOrder = user.orders.reduce((latest: any, order: any) => {
          const orderDate = new Date(order.order_date);
          return !latest || orderDate > new Date(latest.order_date) ? order : latest;
        }, null);

        return latestOrder && new Date(latestOrder.order_date) < sixtyDaysAgo;
      }).map(user => ({
        user_id: user.user_id,
        region: user.region,
        last_order_date: user.orders?.length > 0 
          ? user.orders.reduce((latest: any, order: any) => {
              const orderDate = new Date(order.order_date);
              return !latest || orderDate > new Date(latest.order_date) ? order.order_date : latest;
            }, null)
          : null,
        total_spent: user.orders?.reduce((sum: number, order: any) => sum + Number(order.amount), 0) || 0
      })).slice(0, 20);

      return churnedUsers || [];
    } catch (error) {
      console.error('Churn fetch error:', error);
      return [];
    }
  };

  const fetchHighValueCustomers = async () => {
    try {
      let query = supabase
        .from('users')
        .select(`
          user_id,
          region,
          orders(amount)
        `);

      if (filters.selectedRegion !== "all") {
        query = query.eq('region', filters.selectedRegion);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate totals and sort by spending
      const highValue = data?.map(user => ({
        user_id: user.user_id,
        region: user.region,
        total_spent: user.orders?.reduce((sum: number, order: any) => sum + Number(order.amount), 0) || 0,
        order_count: user.orders?.length || 0
      }))
      .filter(user => user.total_spent > 0)
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 10);

      return highValue || [];
    } catch (error) {
      console.error('High-value fetch error:', error);
      return [];
    }
  };

  const fetchRevenueData = async () => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          order_date,
          amount,
          users(region)
        `);

      const { data, error } = await query;
      if (error) throw error;

      // Filter by region if specified
      let filteredData = data;
      if (filters.selectedRegion !== "all") {
        filteredData = data?.filter(order => 
          order.users?.region === filters.selectedRegion
        );
      }

      // Group by month and sum revenue
      const revenueMap = new Map();
      filteredData?.forEach(order => {
        const month = new Date(order.order_date).toISOString().slice(0, 7);
        if (!revenueMap.has(month)) {
          revenueMap.set(month, 0);
        }
        revenueMap.set(month, revenueMap.get(month) + Number(order.amount));
      });

      const revenue = Array.from(revenueMap.entries())
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => a.month.localeCompare(b.month));

      return revenue || [];
    } catch (error) {
      console.error('Revenue fetch error:', error);
      return [];
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [cohort, churn, highValue, revenue] = await Promise.all([
        fetchCohortData(),
        fetchChurnData(), 
        fetchHighValueCustomers(),
        fetchRevenueData()
      ]);

      setCohortData(cohort);
      setChurnData(churn);
      setHighValueCustomers(highValue);
      setRevenueData(revenue);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [filters.selectedRegion, filters.selectedPeriod, filters.startDate, filters.endDate]);

  return {
    cohortData,
    churnData,
    highValueCustomers,
    revenueData,
    loading,
    error,
    refetch: fetchAllData
  };
};