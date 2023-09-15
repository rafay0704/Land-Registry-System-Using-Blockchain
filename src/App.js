import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Navbar and Footer Components
import Navbar from "./Navbar";
import Footer from "./Footer";

// Login Components
import LoginScreen from "./LoginsPages";

// About, Contact, and Join Components
import AboutUs from "./About";
import ContactUs from "./Contact";
import JoinUs from "./Join";

// Dashboard Data Components
import UserCount from "./Dashboard Data/UserCount";
import LandCount from "./Dashboard Data/LandCount";
import TransferCount from "./Dashboard Data/TransferCount";
import InspectorCount from "./Dashboard Data/InspectorCount";

// State Management Components
import TransactionHistory from "./StateMangement/TransactionHistory";

// Admin Components
import Admin from "./Admin/Admin";
import Dashboard from "./Admin/Dashboard";
import Protected from "./Admin/Protected";
import AddLandInspector from "./Admin/AddLandInspector";
import AllLandInspector from "./Admin/AllLandInspector";
import ChnageAdmin from "./Admin/ChnageAdmin";

// Inspector Components
import Inspector from "./Inspector/Inspector";
import IDashboard from "./Inspector/Dashboard";
import IProtected from "./Inspector/Protected";
import IVerifyland from "./Inspector/Verifyland";
import IVerifyuser from "./Inspector/Verifyuser";
import ITransferOwnership from "./Inspector/TransferOwnership";
import ITransfer from "./Inspector/Transfer";

// User Components
import Registration from "./User/Registration";
import ULogin from "./User/Login";
import UDashboard from "./User/Dashboard";
import ULandGallery from "./User/LandGallery";
import UProtected from "./User/Protected";
import UAddLand from "./User/AddLand";
import DrawLand from "./User/DrawLand";
import UMyLand from "./User/myLand";
import ULandDetail from "./User/LandDetail";
import myRequest from "./User/myRequests";
import RecivedRequest from "./User/RecivedRequest";

// App Component definition is the same...

const App = () => {
  const path = {
    Inspector: true,
    Admin: true,
    User: true,
  };
  

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="home">
              <Navbar />

              <LoginScreen />
              <AboutUs />

              <JoinUs />
              <ContactUs />
              <br></br>
              <br></br>
              <div>
                <TransactionHistory />
              </div>

              <br></br>

              <div>
                <Footer />
              </div>
            </div>
          }
        ></Route>
        {path.Inspector && (
          <Route path="Inspectorlogin" element={<Inspector />} />
        )}
        {/* <Route
          path="landDetails"
          element={(() => {
            switch (path) {
              case path.Inspector:
                return <IProtected Component={ULandDetail} />;
              case path.User:
                return <UProtected Component={ULandDetail} />;
              default:
                return <UProtected Component={ULandDetail} />;
            }
          })()}
        /> */}

        <Route path="landDetails" element={<ULandDetail />} />
        <Route path="/user-count" element={<UserCount />} />
        <Route path="/land-count" element={<LandCount />} />
        <Route path="/transfer-count" element={<TransferCount />} />
        <Route path="/inspector-count" element={<InspectorCount />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route
          path="Inspector-dashboard"
          element={<IProtected Component={IDashboard} />}
        />
        (
        <Route
          path="verifyland"
          element={<IProtected Component={IVerifyland} />}
        />
        <Route
          path="verifyuser"
          element={<IProtected Component={IVerifyuser} />}
        />
        <Route
          path="transferownership"
          element={<IProtected Component={ITransferOwnership} />}
        />
        <Route path="Transfer" element={<IProtected Component={ITransfer} />} />
        ){path.Admin && <Route path="Adminlogin" element={<Admin />} />}
        {path.User && <Route path="Userlogin" element={<ULogin />} />}


        <Route
          path="user-dashboard"
          element={<UProtected Component={UDashboard} />}
        />
        <Route
          path="landgallery"
          element={<UProtected Component={ULandGallery} />}
        />
        <Route
          path="myBuyRequest"
          element={<UProtected Component={myRequest} />}
        />
      
        <Route path="myLand" element={<UProtected Component={UMyLand} />} />
        <Route path="addland" element={<UProtected Component={UAddLand} />} />
        <Route
          path="recivedrequest"
          element={<UProtected Component={RecivedRequest} />}
        />
        <Route
          path="addlocation"
          element={<UProtected Component={DrawLand} />}
        />
        <Route path="registration" element={<Registration />} />
        <Route path="dashboard" element={<Protected Component={Dashboard} />} />
        <Route
          path="alllandinspector"
          element={<Protected Component={AllLandInspector} />}
        />
        <Route
          path="addlandinspector"
          element={<Protected Component={AddLandInspector} />}
        />
        <Route
          path="changeAdmin"
          element={<Protected Component={ChnageAdmin} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
