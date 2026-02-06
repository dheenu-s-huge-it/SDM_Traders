// Component Imports
import UserEdit from "../../../components/createcomponents/UserEdit";

export const metadata = {
  title: "SDM TRADER",
};


const Action = () => {
  return <UserEdit Header = {'Trader'} route_back = {'/all-traders'} userType = {2} userNames = {'Trader'}/>;
};

export default Action;
