import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Required for Pie Chart
} from "chart.js";


import "./dashboard.css";
import "../../Components/Navbar/navbar.css";
import productData from "../../Products/Products.json";

// Register required components
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
  // const [user, setUser] = useState("");
  // const [currentPage, setCurrentPage] = useState("dashboard");
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  const totalProducts = productData.products.length;
  const lowStockItems = productData.products.filter(
    (item) => item.quantity <= 10 && item.quantity > 0
  ).length;
  const outOfStockItems = productData.products.filter(
    (item) => item.quantity === 0
  ).length;
  const inStockItems = totalProducts - outOfStockItems;

  // Prepare bar chart data
  const categoryQuantities = productData.products.reduce((acc, product) => {
    const category = product.category;
    acc[category] = (acc[category] || 0) + product.quantity;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(categoryQuantities), // Categories
    datasets: [
      {
        label: "Total Quantity by Category",
        data: Object.values(categoryQuantities), // Quantities
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare pie chart data for stock levels
  const pieChartData = {
    labels: ["In Stock", "Low Stock", "Out of Stock"],
    datasets: [
      {
        label: "Stock Overview",
        data: [inStockItems, lowStockItems, outOfStockItems],
        backgroundColor: ["#4caf50", "#ffc107", "#f44336"], // Colors for each section
        hoverOffset: 4,
      },
    ],
  };

  const renderPage = () => {
        return (
          <div>
            <div className="metrics">
              <div className="metric">
                <h3>Total Products</h3>
                <p style={{color:"green"}}>{totalProducts}</p>
              </div>
              <div className="metric">
                <h3>Low Stock Items</h3>
                <p style={{color:"orange"}}>{lowStockItems}</p>
              </div>
              <div className="metric">
                <h3>Out of Stock Items</h3>
                <p style={{color:"red"}}>{outOfStockItems}</p>
              </div>
            </div>
            <div className="chart-wrapper">
              {/* Bar Chart on the Left */}
              <div className="chart-container">
                <h3>Product Quantity by Category</h3>
                <Bar data={barChartData} />
              </div>

              {/* Pie Chart on the Right */}
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
      {/* <Navbar
        user={user}
        onNavClick={setCurrentPage}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      /> */}
      {renderPage()}
    </div>
  );
};

export default Dashboard;
