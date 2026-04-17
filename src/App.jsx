import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Companies from "./pages/Companies";
import CompanyCreate from "./pages/CompanyCreate";
import CompanyView from "./pages/CompanyView";
import ContactView from "./pages/ContactView";
import Users from "./pages/Users";
import WabaAccount from "./pages/WabaAccount";
import WabaAccountCreate from "./pages/WabaAccountCreate";
import UserCreate from "./pages/UserCreate";
import Logs from "./pages/Logs";
import SettingsLayout from "./layout/SettingsLayout";
import Conversations from "./pages/Conversations";
import NotFound from "./pages/NotFound";
import GuestRoute from "./auth/GuestRoute";
import Tags from "./pages/Tags";
import QuickReplies from "./pages/QuickReplies";
import "./services/echo";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute requireSuperadmin={true} />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="companies/create" element={<CompanyCreate />} />
            <Route path="companies/:id" element={<CompanyView />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/create" element={<UserCreate />} />
            {/*<Route path="/users/:id" element={<UserView />} />*/}
            <Route path="/waba-accounts" element={<WabaAccount />} />
            <Route path="/waba-accounts/create" element={<WabaAccountCreate />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactView />} />
            <Route path="/settings" element={<SettingsLayout />}>
              <Route path="/settings/tags" element={<Tags />} />
              <Route path="/settings/quick-replies" element={<QuickReplies />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;