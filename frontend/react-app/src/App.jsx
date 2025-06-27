import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./authentication/registerpage";
import Login from "./authentication/loginpage";
import Homepage from "./homepage";
import AdminDashboard from "./admin/admindashboard";
import UserDashboard from "./user/userdashboard";
import AddProblem from "./admin/addproblem";
import ProblemList from "./admin/problemlist";
import ProblemSolvePage from "./admin/problemsolving"; 
import EditProblem from "./admin/EditProblem";
import UserProblemList from "./user/userProblemList";
// import the page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        {/* Admin routes individually declared */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/addproblem" element={<AddProblem />} />
        <Route path="/admin/problemlist" element={<ProblemList />} />
        <Route path="/admin/solve/:problemId" element={<ProblemSolvePage />} />
        <Route path="/admin/edit/:problemId" element={<EditProblem />} />

      <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/problems" element={<UserProblemList />} />
        <Route path="/user/solve/:problemId" element={<ProblemSolvePage />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App;
