import {
	createBrowserRouter
} from "react-router-dom";
import Home from "../Components/Home/Home";
import Comments from "../Components/Comments/Comments";
import SignUp from "../Components/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Layout from "../Components/Layout/Layout";
import EditProfile from "../Components/EditProfile/EditProfile";


const router = createBrowserRouter([
	{
		path: "/",
		// element: <PrivateRoute><Home></Home></PrivateRoute>,
		element: <Layout></Layout>,
		children: [
			{
				path: '/',
				element: <PrivateRoute><Home></Home></PrivateRoute>
			},
			
			{
				path: "/comments",
				element: <Comments></Comments>
			}
		]
	},
	{
		path: '/signup',
		element: <SignUp></SignUp>
	},
	{
		path: '/edit_profile',
		element: <EditProfile></EditProfile>
	},

]);


export default router