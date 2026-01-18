import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./AuthUser/Register";
import SetupName from "./AuthUser/SetupName";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import RootRouter from "./Components/RootRouter";
import SellerBlocker from "./Components/SellerBlocker";
import AdminBlocker from "./Components/AdminBlocker";

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
import SellerBookings from "./AuthSeller/SellerBookings";
import SellerProtectedRoute from "./Components/SellerProtectedRoute";

// USER PAGES
import UserShows from "./Pages/UserShows";
import MoviePage from "./Pages/MoviePage";
import SeatPage from "./Pages/SeatPage";
import PaymentPage from "./Pages/PaymentPage";
import SuccessPage from "./Pages/SuccessPage";
import BuyTicketsPage from "./Pages/BuyTicketsPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import MovieReviewsPage from "./Pages/MovieReviewsPage";

// ADMIN
import SuperAdminDashboard from "./SuperAdmin/SuperAdminDashboard";
import AdminSellers from "./SuperAdmin/AdminSellers";
import AdminTheatres from "./SuperAdmin/AdminTheatres";
import AdminScreens from "./SuperAdmin/AdminScreens";
import AdminShows from "./SuperAdmin/AdminShows";
import AdminBookings from "./SuperAdmin/AdminBookings";
import AdminRoute from "./Components/AdminRoute";

function App() {
  return (
    <>
      <Toaster position="bottom-center" />

      <BrowserRouter>
        {/* 🔒 ADMIN BLOCKER */}
        <AdminBlocker>
          {/* 🔒 SELLER BLOCKER */}
          <SellerBlocker>
            <Routes>
              {/* ROOT */}
              <Route path="/" element={<RootRouter />} />
              <Route path="/movie/:name" element={<MoviePage />} />
              <Route path="/seats/:id" element={<SeatPage />} />
              <Route path="/pay" element={<PaymentPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/buytickets/:movieName" element={<BuyTicketsPage />} />
              <Route path="/profile" element={<MyBookingsPage />} />
              <Route path="/movie/:name/reviews" element={<MovieReviewsPage />} />

              {/* USER AUTH */}
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              <Route
                path="/setup-name"
                element={
                  <ProtectedRoute>
                    <SetupName />
                  </ProtectedRoute>
                }
              />

              <Route path="/shows" element={<UserShows />} />

              {/* SELLER */}
              <Route path="/seller/signin" element={<SellerLogin />} />
              <Route path="/seller/onboard" element={<SellerOnboard />} />

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

              {/* ADMIN */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <SuperAdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/sellers"
                element={
                  <AdminRoute>
                    <AdminSellers />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/theatres"
                element={
                  <AdminRoute>
                    <AdminTheatres />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/screens"
                element={
                  <AdminRoute>
                    <AdminScreens />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/shows"
                element={
                  <AdminRoute>
                    <AdminShows />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <AdminBookings />
                  </AdminRoute>
                }
              />
            </Routes>
          </SellerBlocker>
        </AdminBlocker>
      </BrowserRouter>
    </>
  );
}

export default App;
