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
// import Layout from "../themes";

interface LayoutProps {
  children: ReactNode; // Define children type as ReactNode
}

function Layout({ children }: LayoutProps) {
  return <div className="md:mx-44">{children}</div>;
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
              <ITRMainPage />
            </Layout>
          ),
        },
        {
          path: "addPanCardDetail",
          element: (
            <Layout>
              <AddPan />
            </Layout>
          ),
        },
        {
          path: "uploadForm16",
          element: (
            <Layout>
              <UploadForm16 />
            </Layout>
          ),
        },
        {
          path: "personalDetail",
          element: (
            <Layout>
              <PersonalDetail />
            </Layout>
          ),
        },
        {
          path: "incomeSources",
          element: (
            <Layout>
              <IncomeSources />
            </Layout>
          ),
        },
        {
          path: "incomeInterest",
          element: (
            <Layout>
              <IncomeInterest />
            </Layout>
          ),
        },
        {
          path: "capitalGain",
          element: (
            <Layout>
              <CapitalGainSubMain />
            </Layout>
          ),
        },
        {
          path: "income-house-property",
          element: (
            <Layout>
              <HousePropMain />
            </Layout>
          ),
        },
        {
          path: "self-occupied-property",
          element: (
            <Layout>
              <SelfProperty />
            </Layout>
          ),
        },
        {
          path: "rental-property",
          element: (
            <Layout>
              <RentProperty />
            </Layout>
          ),
        },
        {
          path: "dividend-income",
          element: (
            <Layout>
              <DividentIncome />
            </Layout>
          ),
        },
        {
          path: "income-professional-freelancing-business",
          element: (
            <Layout>
              <ProSubSection />
            </Layout>
          ),
        },
        {
          path: "professional-income",
          element: (
            <Layout>
              <ProfessionalIncome />
            </Layout>
          ),
        },
        {
          path: "bussiness-income",
          element: (
            <Layout>
              <BussinessIncome />
            </Layout>
          ),
        },
        {
          path: "book-of-account-dashboard",
          element: (
            <Layout>
              <ProfBussinessSection />
            </Layout>
          ),
        },
        {
          path: "profit-and-loss-boa",
          element: (
            <Layout>
              <ProfitLoss />
            </Layout>
          ),
        },
        {
          path: "balance-sheet-boa",
          element: (
            <Layout>
              <BalanceSheet />
            </Layout>
          ),
        },
        {
          path: "financial-particulars",
          element: (
            <Layout>
              <FinanceSubSection />
            </Layout>
          ),
        },
        {
          path: "virtual-assets",
          element: (
            <Layout>
              <VirtualAssestSubMain />
            </Layout>
          ),
        },
        {
          path: "other-income",
          element: (
            <Layout>
              <OtherIncomeSubSection />
            </Layout>
          ),
        },
        {
          path: "exempt-other-income",
          element: (
            <Layout>
              <ExemptIncome />
            </Layout>
          ),
        },
        {
          path: "agri-income",
          element: (
            <Layout>
              <AgriIncome />
            </Layout>
          ),
        },
        {
          path: "bussiness-fund",
          element: (
            <Layout>
              <BussinessFundIncome/>
            </Layout>
          ),
        },
        {
          path: "tax-saving",
          element: (
            <Layout>
              <TaxSaving/>
            </Layout>
          ),
        },
        {
          path: "tax-summary",
          element: (
            <Layout>
              <TaxSummary/>
            </Layout>
          ),
        },
        {
          path: "add-deprectation",
          element: (
            <Layout>
              <DeprectationEntry/>
            </Layout>
          ),
        },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;

