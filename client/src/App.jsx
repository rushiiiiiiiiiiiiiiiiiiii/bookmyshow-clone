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
          <Route path="/seller/bookings" element={<SellerBookings />} />

          {/* SELLER DASHBOARD */}
          <Route path="/seller/dashboard" element={<SellerDashboard />} />

          {/* THEATRES */}
          <Route path="/seller/theatres" element={<TheaterList />} />

          {/* PER-THEATRE ROUTES (IMPORTANT FIX) */}
          <Route path="/seller/screens/:theatreId" element={<ScreenList />} />
          <Route path="/seller/shows/:theatreId" element={<ShowsList />} />

          {/* GLOBAL ROUTES (OPTIONAL VIEW) */}
          <Route path="/seller/screens" element={<ScreenList />} />
          <Route path="/seller/shows" element={<ShowsList />} />

          {/* CREATION */}
          <Route path="/seller/add-theatre" element={<AddTheatre />} />
          <Route path="/seller/add-screen/:theatreId" element={<AddScreen />} />
          <Route path="/seller/add-show/:theatreId" element={<AddShow />} />

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
