// Component Imports
import UserView from "../../../components/createcomponents/UserView";

export const metadata = {
  title: "SDM TRADER",
};


const Action = () => {
  return <UserView Header = {'Trader'} route_back = {'/all-traders'} userType = {2} userNames = {'Trader'}/>;
};

export default Action;
