import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./authentication/registerpage";
import Login from "./authentication/loginpage";
import Homepage from "./homepage";
import AdminDashboard from "./admin/admindashboard";
import UserNavbar from "./user/usernavbar";
import AddProblem from "./admin/addproblem";
import ProblemList from "./admin/problemlist";
import ProblemSolvePage from "./admin/problemsolving"; 
import EditProblem from "./admin/EditProblem";
import UserProblemList from "./user/userProblemList";
import SubmissionsPage from "./admin/submissions";
import CompilerPage from "./admin/compiler";
import Contests from './user/contests';
import AdminContests from './admin/admincontests';

// import the page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/*if user not logged in*/}
        <Route path="/solve/:problemId" element={<ProblemSolvePage />} />

        {/* Admin routes individually declared */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/addproblem" element={<AddProblem />} />
        <Route path="/admin/problemlist" element={<ProblemList />} />
        <Route path="/admin/solve/:problemId" element={<ProblemSolvePage />} />
        <Route path="/admin/edit/:problemId" element={<EditProblem />} />
        <Route path="/admin/compiler" element={<CompilerPage />} />
        <Route path="/admin/contests" element={<AdminContests />} />

      <Route path="/user/navbar" element={<UserNavbar />} />
        <Route path="/user/problems" element={<UserProblemList />} />
        <Route path="/user/solve/:problemId" element={<ProblemSolvePage />} />
        <Route path="/user/compiler" element={<CompilerPage />} />
        <Route path="/user/contests" element={<Contests />} />


    <Route path="/submissions/:problemId/:userId" element={<SubmissionsPage />} />

        

      </Routes>
    </BrowserRouter>
  );
}


export default App;
