import {
	createBrowserRouter
} from "react-router-dom";
import Home from "../Components/Home/Home";
import Comments from "../Components/Comments/Comments";
import SignUp from "../Components/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Layout from "../Components/Layout/Layout";
import EditProfile from "../Components/EditProfile/EditProfile";
import All_Members from "../Components/All_Members/All_Members";
import ManageFamily from "../Components/ManageFamily/ManageFamily";
import AdminRoute from "./AdminRoute";
import AuthRoute from "./AuthRoute";
import RequestMember from "../Components/RequestMember/RequestMember";


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
				element: <PrivateRoute><Comments></Comments></PrivateRoute>
			},
			{
				path: "/all_users",
				element: <PrivateRoute><All_Members></All_Members></PrivateRoute>
			},
			{
				path: "/request-member",
				element: <PrivateRoute><RequestMember /></PrivateRoute>
			},
			{
				path: "/admin",
				element: <AdminRoute><ManageFamily /></AdminRoute>
			}
		]
	},
	{
		path: '/signup',
		element: <SignUp></SignUp>
	},
	{
		path: '/edit_profile',
		element: <AuthRoute><EditProfile /></AuthRoute>
	},

]);


export default router
