import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./AuthUser/Register";
import SetupName from "./AuthUser/SetupName";

import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import RootRouter from "./Components/RootRouter";

// SELLER AUTH
import SellerLogin from "./AuthSeller/SellerLogin";
import SellerOnboard from "./AuthSeller/SellerOnboard";
import SellerDashboard from "./AuthSeller/SellerDashboard";

// SELLER PAGES
import AddTheatre from "./AuthSeller/Add-theatre";
import AddScreen from "./AuthSeller/Add-Screen";
import AddShow from "./AuthSeller/Add-Show";
import TheaterList from "./AuthSeller/TheaterList";
import ScreenList from "./AuthSeller/ScreenList";
import ShowsList from "./AuthSeller/ShowsList";
import UserShows from "./Pages/UserShows";
import MoviePage from "./Pages/MoviePage";
import SeatPage from "./Pages/SeatPage";
import PaymentPage from "./Pages/PaymentPage";
import SuccessPage from "./Pages/SuccessPage";
import BuyTicketsPage from "./Pages/BuyTicketsPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import SellerBookings from "./AuthSeller/SellerBookings";
import SuperAdminDashboard from "./SuperAdmin/SuperAdminDashboard";
import SellerProtectedRoute  from './Components/SellerProtectedRoute'
// ================= SUPER ADMIN =================
import AdminSellers from "./SuperAdmin/AdminSellers";
// import PendingSellers from "./SuperAdmin/PendingSellers";
import AdminTheatres from "./SuperAdmin/AdminTheatres";
import AdminScreens from "./SuperAdmin/AdminScreens";
import AdminShows from "./SuperAdmin/AdminShows";
import AdminBookings from "./SuperAdmin/AdminBookings";
// import AdminRevenue from "./SuperAdmin/AdminRevenue";

function App() {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2200,
          style: {
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            borderRadius: "6px",
            padding: "10px 14px",
            fontSize: "14px",
          },
        }}
      />

      <BrowserRouter>
        <Routes>
          {/* ROOT */}
          <Route path="/" element={<RootRouter />} />
          <Route path="/movie/:name" element={<MoviePage />} />
          <Route path="/seats/:id" element={<SeatPage />} />
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/buytickets/:movieName" element={<BuyTicketsPage />} />
          <Route path="/profile" element={<MyBookingsPage />} />
          {/* SELLER AUTH */}
          <Route path="/seller/signin" element={<SellerLogin />} />
          <Route path="/seller/onboard" element={<SellerOnboard />} />
          {/* ================= SUPER ADMIN ROUTES ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sellers"
            element={
              <ProtectedRoute role="admin">
                <AdminSellers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/theatres"
            element={
              <ProtectedRoute role="admin">
                <AdminTheatres />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/screens"
            element={
              <ProtectedRoute role="admin">
                <AdminScreens />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shows"
            element={
              <ProtectedRoute role="admin">
                <AdminShows />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute role="admin">
                <AdminBookings />
              </ProtectedRoute>
            }
          />

          {/* SELLER DASHBOARD */}
          <Route
            path="/seller/dashboard"
            element={
              <SellerProtectedRoute>
                <SellerDashboard />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="/seller/bookings"
            element={
              <SellerProtectedRoute>
                <SellerBookings />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="/seller/theatres"
            element={
              <SellerProtectedRoute>
                <TheaterList />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/screens"
            element={
              <SellerProtectedRoute>
                <ScreenList />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/shows"
            element={
              <SellerProtectedRoute>
                <ShowsList />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="/seller/screens/:theatreId"
            element={
              <SellerProtectedRoute>
                <ScreenList />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="/seller/shows/:theatreId"
            element={
              <SellerProtectedRoute>
                <ShowsList />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="/seller/add-theatre"
            element={
              <SellerProtectedRoute>
                <AddTheatre />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="/seller/add-screen/:theatreId"
            element={
              <SellerProtectedRoute>
                <AddScreen />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="/seller/add-show/:theatreId"
            element={
              <SellerProtectedRoute>
                <AddShow />
              </SellerProtectedRoute>
            }
          />

          {/* USER AUTH */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/shows" element={<UserShows />} />
          <Route
            path="/setup-name"
            element={
              <ProtectedRoute>
                <SetupName />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
