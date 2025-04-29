import { useRoutes } from "react-router-dom";
import DashboardOverview1 from "../pages/DashboardOverview1";
import DashboardOverview2 from "../pages/DashboardOverview2";
import DashboardOverview3 from "../pages/DashboardOverview3";
import DashboardOverview4 from "../pages/DashboardOverview4";
import Categories from "../pages/Categories";
import AddProduct from "../pages/AddProduct";
import ProductList from "../pages/ProductList";
import ProductGrid from "../pages/ProductGrid";
import TransactionList from "../pages/TransactionList";
import TransactionDetail from "../pages/TransactionDetail";
import SellerList from "../pages/SellerList";
import SellerDetail from "../pages/SellerDetail";
import Reviews from "../pages/Reviews";
import Inbox from "../pages/Inbox";
import FileManager from "../pages/FileManager";
import PointOfSale from "../pages/PointOfSale";
import Chat from "../pages/Chat";
import Post from "../pages/Post";
import Calendar from "../pages/Calendar";
import CrudDataList from "../pages/CrudDataList";
import CrudForm from "../pages/CrudForm";
import UsersLayout1 from "../pages/UsersLayout1";
import UsersLayout2 from "../pages/UsersLayout2";
import UsersLayout3 from "../pages/UsersLayout3";
import ProfileOverview1 from "../pages/ProfileOverview1";
import ProfileOverview2 from "../pages/ProfileOverview2";
import ProfileOverview3 from "../pages/ProfileOverview3";
import WizardLayout1 from "../pages/WizardLayout1";
import WizardLayout2 from "../pages/WizardLayout2";
import WizardLayout3 from "../pages/WizardLayout3";
import BlogLayout1 from "../pages/BlogLayout1";
import BlogLayout2 from "../pages/BlogLayout2";
import BlogLayout3 from "../pages/BlogLayout3";
import PricingLayout1 from "../pages/PricingLayout1";
import PricingLayout2 from "../pages/PricingLayout2";
import InvoiceLayout1 from "../pages/InvoiceLayout1";
import InvoiceLayout2 from "../pages/InvoiceLayout2";
import FaqLayout1 from "../pages/FaqLayout1";
import FaqLayout2 from "../pages/FaqLayout2";
import FaqLayout3 from "../pages/FaqLayout3";
import Login from "../pages/ImportantPage/Login";
import Register from "../pages/ImportantPage/Register";
import ErrorPage from "../pages/ErrorPage";
import UpdateProfile from "../pages/UpdateProfile";
import ChangePassword from "../pages/ChangePassword";
import RegularTable from "../pages/RegularTable";
import Tabulator from "../pages/Tabulator";
import Modal from "../pages/Modal";
import Slideover from "../pages/Slideover";
import Notification from "../pages/Notification";
import Tab from "../pages/Tab";
import Accordion from "../pages/Accordion";
import Button from "../pages/Button";
import ProgressBar from "../pages/ProgressBar";
import Tooltip from "../pages/Tooltip";
import Dropdown from "../pages/Dropdown";
import Typography from "../pages/Typography";
import Icon from "../pages/Icon";
import LoadingIcon from "../pages/LoadingIcon";
import RegularForm from "../pages/RegularForm";
import Datepicker from "../pages/Datepicker";
import TomSelect from "../pages/TomSelect";
import FileUpload from "../pages/FileUpload";
import WysiwygEditor from "../pages/WysiwygEditor";
import Validation from "../pages/Validation";
import Chart from "../pages/Chart";
import Slider from "../pages/Slider";
import ImageZoom from "../pages/ImageZoom";
import HomePage from "../pages/ImportantPage/HomePage"
import AddPan from "../pages/ImportantPage/FileITR/AddPan"
import UploadForm16 from "../pages/ImportantPage/FileITR/UploadForm16"
import PersonalDetail from "../pages/ImportantPage/FileITR/Personal Detail";
import IncomeSources from "../pages/ImportantPage/FileITR/IncomeSources";
import ITRMainPage from "../pages/ImportantPage/FileITR/ITRMainPage";
import TaxSummary from "../pages/ImportantPage/FileITR/TaxSummary";
import TaxSaving from "../pages/ImportantPage/FileITR/TaxSaving";
import IncomeInterest from "@/ImportantComponent/IncomeSourcesComponent/IncomeInterest";
import CapitalGainSubMain from "@/ImportantComponent/CaptialGainComponent/CapitalGainSubMain";
import HousePropMain from "@/ImportantComponent/HousePropertyComponent/HousePropMain";
import SelfProperty from "@/ImportantComponent/HousePropertyComponent/SelfProperty";
import RentProperty from "@/ImportantComponent/HousePropertyComponent/RentProperty";
import DividentIncome from "@/ImportantComponent/HousePropertyComponent/DividentComponent/DivdentIcome";
import ProSubSection from "@/ImportantComponent/ProfessionBussinessIncome/ProfSubSection";
import ProfessionalIncome from "@/ImportantComponent/ProfessionBussinessIncome/ProfessionalIncome";
import BussinessIncome from "@/ImportantComponent/ProfessionBussinessIncome/BussinesIncome";
import Main from "@/main/main";
import ProfBussinessSection from "@/ImportantComponent/ProfessionBussinessIncome/ProffBussinessSection";
import ProfitLoss from "@/ImportantComponent/ProfessionBussinessIncome/AccountMaintain/ProfitLoss";
import FinanceSubSection from "@/ImportantComponent/FinancialParticular/FinanceSubSection";
import BalanceSheet from "@/ImportantComponent/ProfessionBussinessIncome/AccountMaintain/BalanceSheet";
import { ReactNode } from "react";
import VirtualAssestSubMain from "@/ImportantComponent/VirtualAsssetComponent/VirtualAssestSubMain";
import DeprectationEntry from "@/ImportantComponent/ProfessionBussinessIncome/AccountMaintain/DeprectationEntry";
import OtherIncomeSubSection from "@/ImportantComponent/HousePropertyComponent/OtherIncomeComponent/OtherIncomeSubSection";
import ExemptIncome from "@/ImportantComponent/HousePropertyComponent/OtherIncomeComponent/ExemptCom/ExempIncom";
import AgriIncome from "@/ImportantComponent/HousePropertyComponent/OtherIncomeComponent/AgriIncome";
import BussinessFundIncome from "@/ImportantComponent/HousePropertyComponent/OtherIncomeComponent/BussinessFundncome";
import TaxDeduction from "@/ImportantComponent/TaxSavingComponent/TaxDeduction/TaxDeduction";
import TaxDashboard from "@/ImportantComponent/TaxSavingComponent/TaxDeduction/TaxDashboard";
import Sliderbar from "@/Layout/Sidebar";
import TaxDonation80G from "@/ImportantComponent/TaxSavingComponent/TaxDeduction/TaxDonation80G";
import DonationRurual from "@/ImportantComponent/TaxSavingComponent/TaxDeduction/DonationRurual";
import DonationParty from "@/ImportantComponent/TaxSavingComponent/TaxDeduction/DonationParty";
import TaxPaidSub from "@/ImportantComponent/TaxSavingComponent/TaxPaid/TaxPaidSub";
import NonSalaryForm from "@/ImportantComponent/TaxSavingComponent/TaxPaid/Component/NonSalaryForm";
import TDSRentForm from "@/ImportantComponent/TaxSavingComponent/TaxPaid/Component/TDSRentForm";
import TaxCollectedForm from "@/ImportantComponent/TaxSavingComponent/TaxPaid/Component/TaxCollectedForm";
import TaxLossSub from "@/ImportantComponent/TaxSavingComponent/TaxLoss/TaxLossSub";
import Form16Manually from "@/ImportantComponent/IncomeSourcesComponent/Form16Manually/Form16Manually";
import UserDetailLayout from "@/utils/UserDetailLayout";
import RequiredAuth from "@/route/RequiredAuth";
import AdminDashboard from "@/pages/ImportantPage/AdminDashboard/AdminDashboard";
import RequiredAdmin from "@/route/RequiredAdmin";
import AllGSTData from "@/pages/ImportantPage/AdminDashboard/AllGstindata";
import AdminDashboardLayout from "@/Layout/AdminDashboardLayout";
import AdminUser from "@/pages/ImportantPage/AdminDashboard/AdminUser";
// import Layout from "../themes";

interface LayoutProps {
  children: ReactNode; // Define children type as ReactNode
}

function Layout({ children }: LayoutProps) {
  return <div className="">{children}</div>;
}


function Router() {
  const routes = [
    {
      path: "/",
      element: <Main></Main>,
      children: [
        {
          path: "/",
          element: (
            <Layout>
              <HomePage />
            </Layout>
          ),
        },
        {
          path: "/login",
          element: (
            <Layout>
              <Login />
            </Layout>
          ),
        },
        {
          path: "/register",
          element: (
            <Layout>
              <Register />
            </Layout>
          ),
        },
        {
          path: "/admin",
          element: (
  
              <RequiredAdmin>
              <AdminDashboardLayout />
              </RequiredAdmin>
            
          ),
          children: [
            {
              index: true, // this means /admin will load Dashboard by default
              element: (
                <RequiredAdmin>
              <AdminDashboard/>
                </RequiredAdmin>
              ),
            },
            {
              path: "all-gst-data",
              element: (
             
                  <RequiredAdmin>
    
                  <AllGSTData/>
                  </RequiredAdmin>
             
              ),
            },
            {
              path: "users",
              element: (
             
                  <RequiredAdmin>
    
                  <AdminUser/>
                  </RequiredAdmin>
             
              ),
            },

          ],
        },
        {
          path: "/tes",
          element: (
            <Layout>
              <FileUpload />
            </Layout>
          ),
        },
      ],
    },
    {
      path: "/fileITR",
      element: <Main></Main>,
      children: [
        {
          path: "",
          element: (
            <Layout>
                <RequiredAuth>

              <ITRMainPage />
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "incomeSources/fill-detail",
          element: (
            <UserDetailLayout
            backLink="/fileITR/incomeSources"
            nextLink="/fileITR/incomeSources/incomeInterest"
          >
              <RequiredAuth>

              <Form16Manually/>
              </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "addPanCardDetail",
          element: (
            <Layout>
                <RequiredAuth>
              <AddPan />
              </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "uploadForm16",
          element: (
            <Layout>
                <RequiredAuth>

              <UploadForm16 />
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "personalDetail",
          element: (
            <Layout>
              <RequiredAuth>
              <PersonalDetail />
              </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "incomeSources",
          element: (
            <Layout>
                <RequiredAuth>

              <IncomeSources />
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "incomeSources/incomeInterest",
          element: (
            <UserDetailLayout
          backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
          >
              <RequiredAuth>

              <IncomeInterest />
              </RequiredAuth>
           </UserDetailLayout>
          ),
        },
        {
          path: "incomeSources/capitalGain",
          element: (
            <UserDetailLayout
          backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
          >
              <RequiredAuth>

              <CapitalGainSubMain />
              </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "incomeSources/income-house-property",
          element: (
            <UserDetailLayout
          backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
          >
              <RequiredAuth>

              <HousePropMain />
              </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "incomeSources/self-occupied-property/:propertyIndex",
          element: (
          //   <UserDetailLayout
          // backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
          // >
          <RequiredAuth>  

              <SelfProperty />
          </RequiredAuth>
          // </UserDetailLayout>
            
          ),
        },
        {
          path: "incomeSources/rental-property/:propertyIndex",
          element: (
            <UserDetailLayout
            backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
            >
                <RequiredAuth>

              <RentProperty />
                </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "incomeSources/dividend-income",
          element: (
            <UserDetailLayout
            backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
            >
                <RequiredAuth>

              <DividentIncome />
                </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "incomeSources/income-professional-freelancing-business",
          element: (
            <UserDetailLayout
            backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
            >
                <RequiredAuth>

              <ProSubSection />
                </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "incomeSources/professional-income",
          element: (
            // <UserDetailLayout
            // backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
            // >
                <RequiredAuth>

              <ProfessionalIncome />
                </RequiredAuth>
            // </UserDetailLayout>
          ),
        },
        {
          path: "incomeSources/bussiness-income",
          element: (
            // <Layout>
                <RequiredAuth>

              <BussinessIncome />
                </RequiredAuth>
            // </Layout>
          ),
        },
        {
          path: "incomeSources/book-of-account-dashboard",
          element: (
        
                <RequiredAuth>

              <ProfBussinessSection />
                </RequiredAuth>
           
          ),
        },
        {
          path: "profit-and-loss-boa",
          element: (
            <Layout>
                <RequiredAuth>

              <ProfitLoss />
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "balance-sheet-boa",
          element: (
            <Layout>
                <RequiredAuth>

              <BalanceSheet />
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "incomeSources/financial-particulars",
          element: (
            <Layout>
                <RequiredAuth>

              <FinanceSubSection />
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "incomeSources/virtual-assets",
          element: (
            <UserDetailLayout
            backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
            >
                <RequiredAuth>

              <VirtualAssestSubMain />
                </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "incomeSources/other-income",
          element: (
            <UserDetailLayout
            backLink="/fileITR/incomeSources" nextLink="/fileITR/incomeInterest"
            >
                <RequiredAuth>

              <OtherIncomeSubSection />
                </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "exempt-other-income",
          element: (
            <Layout>
                <RequiredAuth>

              <ExemptIncome />
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "agri-income",
          element: (
            <Layout>
                <RequiredAuth>
                  
              <AgriIncome />
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "bussiness-fund",
          element: (
            <Layout>
                <RequiredAuth>

              <BussinessFundIncome/>
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "tax-summary",
          element: (
            <Layout>
                <RequiredAuth>

              <TaxSummary/>
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "add-deprectation",
          element: (
            <Layout>
                <RequiredAuth>

              <DeprectationEntry/>
                </RequiredAuth>
            </Layout>
          ),
        },
      ],
    },
    {
      path: "/tax-saving",
      element: <Main></Main>,
      children: [
        {
          path: "",
          element: (
            <Layout>
                <RequiredAuth>

              <TaxSaving />
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "dashboard",
          element: (
            <UserDetailLayout
            backLink="/tax-saving"
            nextLink="/tax-saving"
          >
              <RequiredAuth>

              <TaxDashboard/>
              </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "deduction-80g",
          element: (
            <UserDetailLayout
            backLink="/tax-saving/dashboard"
            nextLink="/tax-saving"
          >
                <RequiredAuth>

              <TaxDonation80G/>
                </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "deduction-80gga",
          element: (
            <UserDetailLayout
            backLink="/tax-saving/dashboard"
            nextLink="/tax-saving"
          >
                <RequiredAuth>

              <DonationRurual/>
                </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "contri-party",
          element: (
            <UserDetailLayout
            backLink="/tax-saving/dashboard"
            nextLink="/tax-saving"
          >
                <RequiredAuth>

              <DonationParty/>
                </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "tds-nonsalary",
          element: (
            <Layout>
                <RequiredAuth>

              <NonSalaryForm/>
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "tds-rent",
          element: (
            <Layout>
                <RequiredAuth>

              <TDSRentForm/>
                </RequiredAuth>
            </Layout>
          ),
        },
        {
          path: "tax-paid",
          element: (
            <UserDetailLayout
            backLink="/tax-saving"
            nextLink="/tax-saving"
          >
<RequiredAuth>

              <TaxPaidSub/>
</RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "other-tax",
          element: (
            <UserDetailLayout
            backLink="/tax-saving"
            nextLink="/fileITR/tax-summary"
          >
                <RequiredAuth>

              <TaxLossSub/>
                </RequiredAuth>
            </UserDetailLayout>
          ),
        },
        {
          path: "tax-collected",
          element: (
            <Layout>
                <RequiredAuth>

              <TaxCollectedForm/>
                </RequiredAuth>
            </Layout>
          ),
        },
     
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;

