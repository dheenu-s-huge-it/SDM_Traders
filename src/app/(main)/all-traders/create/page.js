// Component Imports
import UserCreate from "../../../components/createcomponents/UserCreate";

export const metadata = {
  title: "SDM TRADER",
};

const Action = () => {
  return <UserCreate Header = {'Trader'} route_back = {'/all-traders'} userType = {3} userNames = {'Trader'}/>;
};

export default Action;
