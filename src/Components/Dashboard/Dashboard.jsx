import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, 
} from "chart.js";


import "./dashboard.css";
import "../../Components/Navbar/navbar.css";
import productData from "../../Products/Products.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const totalProducts = productData.products.length;
  const lowStockItems = productData.products.filter(
    (item) => item.quantity <= 10 && item.quantity > 0
  ).length;
  const outOfStockItems = productData.products.filter(
    (item) => item.quantity === 0
  ).length;
  const inStockItems = totalProducts - outOfStockItems;

  const categoryQuantities = productData.products.reduce((acc, product) => {
    const category = product.category;
    acc[category] = (acc[category] || 0) + product.quantity;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(categoryQuantities), 
    datasets: [
      {
        label: "Total Quantity by Category",
        data: Object.values(categoryQuantities), 
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["In Stock", "Low Stock", "Out of Stock"],
    datasets: [
      {
        label: "Stock Overview",
        data: [inStockItems, lowStockItems, outOfStockItems],
        backgroundColor: ["#4caf50", "#ffc107", "#f44336"], 
        hoverOffset: 4,
      },
    ],
  };

  const renderPage = () => {
        return (
          <div>
            <div className="metrics">
              <div className="metric-total-products">
                <h3>Total Products</h3>
                <strong><p style={{color:"green"}}>{totalProducts}</p></strong>
              </div>
              <div className="metric-lowstock">
                <h3>Low Stock Items</h3>
                <strong><p style={{color:"orange"}}>{lowStockItems}</p></strong>
              </div>
              <div className="metric-outofstock">
                <h3>Out of Stock Items</h3>
                <strong><p style={{color:"red"}}>{outOfStockItems}</p></strong>
                
              </div>
            </div>
            <div className="chart-wrapper">
              <div className="chart-container">
                <h3>Product Quantity by Category</h3>
                <Bar data={barChartData} />
              </div>

        
              <div className="pie-chart-container">
                <h3>Stock Overview</h3>
                <Pie data={pieChartData} className="pie" />
              </div>
            </div>
          </div>
        );
      
    
  };

  return (
    <div >
      {renderPage()}
    </div>
  );
};

export default Dashboard;
