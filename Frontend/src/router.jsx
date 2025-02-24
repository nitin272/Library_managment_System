import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from './Pages/Home/Home';
import Books from "./Pages/Browsebook/Books";
import AddBooks from "./Pages/Addbooks/AddBooks";
import BookDetail from "./Pages/Bookdetail/BookDetail";
import Error from "./Pages/Error/Error";
import BookPage from "./Components/BookPage";
import Dashboard from "./Pages/Admin/Dashboard";
import Login from './Pages/Login/Login';
import DashboardOverview from "./Pages/Admin/DashboardOverview";
import Members from './Pages/Admin/Members';
import AddMember from './Pages/Admin/AddMember';
import IssueBook from './Pages/Admin/IssueBook';
import Booksdata from './Components/Booksdata';
import BookStatistics from './Pages/Admin/BookStatistics';
import MembershipManagement from './Pages/Admin/MembershipManagement';

const router = createBrowserRouter([
    {
        path:'/',
        element:<App />,
        children:[
            {
                path:'/',
                element:<Home />
            },
            {
                path:'/login',
                element:<Login />
            },
            {
                path:'/browsebook',
                element:<Books />
            },
            {
                path:'/addbooks',
                element:<AddBooks />
            },
            {
                path:'/book/:id',
                element:<BookDetail />
            },
            {
                path:'/books/:catergory',
                element:<BookPage />
            },
            {
                path:'/admin',
                element:<Dashboard />,
                children:[
                    {
                        path:'dashboard',
                        element:<DashboardOverview />
                    },
                    {
                        path:'members',
                        element:<Members />
                    },
                    {
                        path:'add-member',
                        element:<AddMember />
                    },
                    {
                        path:'books',
                        element:<Booksdata title="All Books" />
                    },
                    {
                        path:'books/add',
                        element:<AddBooks />
                    },
                    {
                        path:'issue-book',
                        element:<IssueBook />
                    },
                    {
                        path:'statistics',
                        element:<BookStatistics />
                    },
                    {
                        path:'memberships',
                        element:<MembershipManagement />
                    }
                ]
            },
        ],
        errorElement:<Error />
    },
    
])

export default router;