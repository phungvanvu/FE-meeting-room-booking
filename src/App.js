// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./LoginPage";
// import Home from "./Home";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/Login" element={<Login />} />
//         <Route path="/Home" element={<Home />} />
//         <Route path="*" element={<Login />} />
//       </Routes>
//     </Router>
//   );
// }
import React from "react";
import BookRoomPage from "./BookRoomPage";

function App() {
  return <BookRoomPage />;
}

export default App;
