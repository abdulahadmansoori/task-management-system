import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import Login from "../pages/auth/Login";
import { NotFound } from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import withAuthRedirect from "./withAuthRedirect";
import { User } from "../pages/Users";
import { Project } from "../pages/Projects";
import { Task } from "../pages/Task";
import { useAuth } from "../contexts/authContext";


export default function Router() {
  const { getRole } = useAuth();
  const role = getRole()
  const AuthRequiredLogin = withAuthRedirect(Login);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthRequiredLogin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/tasks" element={<Task />} />
          {role == 'admin' && <Route path="/users" element={<User />} />}
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
