import {
	createBrowserRouter
} from "react-router-dom";
import Home from "../Components/Home/Home";
import Comments from "../Components/Comments/Comments";


const router = createBrowserRouter([
	{
		path: "/",
		element: <Home></Home>,
	},
	{
		path: "/comments",
		element: <Comments></Comments>
	}
]);


export default router