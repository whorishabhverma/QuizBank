import './App.css';
import Home from './Components/LandingPage/Home';
// import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Components/LoginSignup/Login';
import Register from './Components/LoginSignup/Register';
import HomeNew from './Components/LandingPage/HomeNew';
import About from './Components/LandingPage/About';
import Contact from './Components/LandingPage/Contact';
import LoginContextProvider from './Context/LoginContextProvider';
import UserQuizContextProvider from './Context/UserQuizContextProvider';
import CreateQuiz from './Components/QuizCreation/CreateQuiz';
import QuizContextProvider from './Context/QuizContextProvider';
import UserDash from './Components/UserDashboard/UserDash';
import AdminQuizDetail from './Components/AdminDashboard/AdminQuizDetail';
import AdminDash from './Components/AdminDashboard/AdminDash';
import Instruction from './Components/UserDashboard/Instruction';
import QuizTest from './Components/UserQuiz/QuizTest';
import Submitted from './Components/UserQuiz/Submitted';
import Result from './Components/Results/Result';
import Leaderboard from './Components/Results/Leaderboard';
import NavBar from './Components/LandingPage/Navbar';



function App() {
  // const [currentForm,serCurrentForm]=useState('login');
  return (
    // <AdminDash />
    <LoginContextProvider>
    <Router>
      <NavBar />
      <Routes>
        <Route index path='/' element={<HomeNew />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/admin' element={<AdminDash/>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/custom-quiz' element={<QuizContextProvider><CreateQuiz /></QuizContextProvider>}></Route>
        <Route path='/user' element={<UserDash />}></Route>
        <Route path='/detail-quiz' element={<AdminQuizDetail />}></Route>
        <Route path='/instruction' element={<Instruction />}></Route>
        <Route path='/quiz' element={ <UserQuizContextProvider><QuizTest /></UserQuizContextProvider>}></Route>
        <Route path='/submitted' element={<Submitted />}></Route>
        <Route path='/result' element={<Result />}></Route>
        <Route path='/leaderboard' element={<Leaderboard />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
      </Routes>
    </Router>
    </LoginContextProvider>
  );
}

export default App;
