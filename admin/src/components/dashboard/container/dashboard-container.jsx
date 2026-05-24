import ActivityFeed from "../components/activity-feed";
import StatsCards from "../components/dashboard-stats";
import RecentOrders from "../components/recent-orders";
import RevenueChart from "../components/revenue-chart";
import SalesOverview from "../components/sales-overview";
import TopProducts from "../components/top-products";

export default function DashboardContainer() {
  return (
    <div className="md:space-y-4 mb-15 md:mb-0 space-y-2">
      {/*  Stats */}
      <StatsCards />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <RevenueChart />
        </div>

        <div className="md:col-span-1">
          <TopProducts />
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-4">{/* <ActivityFeed /> */}</div>

      {/* Orders */}
      <RecentOrders />
    </div>
  );
}
