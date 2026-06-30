import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { ProductList } from "@/pages/Products/ProductList";
import { ProductEditor } from "@/pages/Products/ProductEditor";
import { Categories } from "@/pages/Categories";
import { Brands } from "@/pages/Brands";
import { Reviews } from "@/pages/Reviews";
import { Media } from "@/pages/Media";
import { Inventory } from "@/pages/Inventory";
import { Analytics } from "@/pages/Analytics";
import { Settings } from "@/pages/Settings";
import { Login } from "@/pages/Auth/Login";
import { Register } from "@/pages/Auth/Register";
import { useAuthStore } from "@/store/useAuthStore";

import { ThemeProvider } from "@/components/ThemeProvider";

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductEditor />} />
            <Route path="products/:id" element={<ProductEditor />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="media" element={<Media />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
