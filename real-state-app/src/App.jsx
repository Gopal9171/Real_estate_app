// import Navbar from "./components/navbar/Navbar";
import ProfilePage from './routes/profilePage/profilePage'
import ProfileUpdatePage from './routes/profileUpdatePage.jsx/profileUpdatePage';
import HomePage from "./routes/homePage/homePage"
import ListPage from './routes/listPage/listPage';
import {Layout,RequireAuth} from "./routes/layout/layout"
import {
  createBrowserRouter,
  RouterProvider

} from "react-router-dom";
import SinglePage from './routes/singlePage/SinglePage';
import Register from './routes/register/register';
import Login from './routes/login/login';
import NewPostPage from './routes/newPostPage/newPostPage';
import { listPageLoader, profilePageLoader, singlePageLoader } from './lib/loaders';
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader:listPageLoader,
          
        },
        {
          path:"/:id",
          element:<SinglePage/>,
          loader:singlePageLoader,
        },
       
        {
          path:"/register",
          element:<Register/>
        },
        {
          path:"/login",
          element:<Login/>
        }
      ],
    },
    {
      path:"/",
      element:<RequireAuth/>,
      children:[
        {
          path:"/profile",
          element:<ProfilePage/>,
          loader:profilePageLoader
        },
        {
          path:"/profile/update",
          element:<ProfileUpdatePage/>
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
      ]
    }
  
  ]);

  return <RouterProvider router={router} />;
}
export default App;