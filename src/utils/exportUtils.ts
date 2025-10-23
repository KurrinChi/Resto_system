export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Get headers from first object keys
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape commas and quotes in values
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportReportToCSV = (
  stats: any,
  revenueData: any[],
  ordersStatusData: any[],
  topItemsData: any[],
  customerGrowthData: any[],
  categorySales: any[],
  reportType: string,
  dateRange: { start: string; end: string }
) => {
  const timestamp = new Date().toISOString().split("T")[0];

  // Create summary sheet
  const summary = [
    {
      Metric: "Total Revenue",
      Value: `$${stats.totalRevenue.toFixed(2)}`,
      Growth: `${stats.revenueGrowth}%`,
    },
    {
      Metric: "Total Orders",
      Value: stats.totalOrders,
      Growth: `${stats.orderGrowth}%`,
    },
    { Metric: "Total Customers", Value: stats.totalCustomers, Growth: "N/A" },
    {
      Metric: "Average Order Value",
      Value: `$${stats.averageOrder.toFixed(2)}`,
      Growth: "N/A",
    },
    { Metric: "Report Type", Value: reportType, Growth: "N/A" },
    {
      Metric: "Date Range",
      Value: `${dateRange.start || "All"} to ${dateRange.end || "All"}`,
      Growth: "N/A",
    },
  ];

  // Export summary
  exportToCSV(summary, `${reportType}_report_summary`);

  // Small delay between downloads
  setTimeout(() => {
    // Export revenue data
    const revenueExport = revenueData.map((item) => ({
      Date: item.date,
      Revenue: `$${item.revenue.toFixed(2)}`,
    }));
    exportToCSV(revenueExport, `${reportType}_revenue_trend`);
  }, 100);

  setTimeout(() => {
    // Export orders status
    exportToCSV(ordersStatusData, `${reportType}_orders_by_status`);
  }, 200);

  setTimeout(() => {
    // Export top items
    exportToCSV(topItemsData, `${reportType}_top_selling_items`);
  }, 300);

  setTimeout(() => {
    // Export customer growth
    exportToCSV(customerGrowthData, `${reportType}_customer_growth`);
  }, 400);

  setTimeout(() => {
    // Export category sales
    const categorySalesExport = categorySales.map((item) => ({
      Category: item.category,
      Orders: item.orders,
      Revenue: `$${item.revenue.toFixed(2)}`,
      Growth: `${item.growth}%`,
    }));
    exportToCSV(categorySalesExport, `${reportType}_sales_by_category`);
  }, 500);
};

export const exportSingleSheetReport = (
  stats: any,
  revenueData: any[],
  ordersStatusData: any[],
  topItemsData: any[],
  customerGrowthData: any[],
  categorySales: any[],
  reportType: string,
  dateRange: { start: string; end: string }
) => {
  // Create comprehensive CSV with all data
  let csvContent = "";

  // Add title
  csvContent += `${reportType.toUpperCase()} REPORT\n`;
  csvContent += `Generated: ${new Date().toLocaleString()}\n`;
  csvContent += `Date Range: ${dateRange.start || "All"} to ${
    dateRange.end || "All"
  }\n\n`;

  // Summary Statistics
  csvContent += "SUMMARY STATISTICS\n";
  csvContent += "Metric,Value,Growth\n";
  csvContent += `Total Revenue,$${stats.totalRevenue.toFixed(2)},${
    stats.revenueGrowth
  }%\n`;
  csvContent += `Total Orders,${stats.totalOrders},${stats.orderGrowth}%\n`;
  csvContent += `Total Customers,${stats.totalCustomers},N/A\n`;
  csvContent += `Average Order Value,$${stats.averageOrder.toFixed(2)},N/A\n\n`;

  // Revenue Trend
  csvContent += "REVENUE TREND\n";
  csvContent += "Date,Revenue\n";
  revenueData.forEach((item) => {
    csvContent += `${item.date},$${item.revenue.toFixed(2)}\n`;
  });
  csvContent += "\n";

  // Orders by Status
  csvContent += "ORDERS BY STATUS\n";
  csvContent += "Status,Count\n";
  ordersStatusData.forEach((item) => {
    csvContent += `${item.name},${item.value}\n`;
  });
  csvContent += "\n";

  // Top Selling Items
  csvContent += "TOP SELLING ITEMS\n";
  csvContent += "Item,Sales\n";
  topItemsData.forEach((item) => {
    csvContent += `${item.name},${item.sales}\n`;
  });
  csvContent += "\n";

  // Customer Growth
  csvContent += "CUSTOMER GROWTH\n";
  csvContent += "Month,Customers\n";
  customerGrowthData.forEach((item) => {
    csvContent += `${item.month},${item.customers}\n`;
  });
  csvContent += "\n";

  // Sales by Category
  csvContent += "SALES BY CATEGORY\n";
  csvContent += "Category,Orders,Revenue,Growth\n";
  categorySales.forEach((item) => {
    csvContent += `${item.category},${item.orders},$${item.revenue.toFixed(
      2
    )},${item.growth}%\n`;
  });

  // Create and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().split("T")[0];

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${reportType}_comprehensive_report_${timestamp}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
