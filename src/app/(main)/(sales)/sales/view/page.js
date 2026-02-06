import SalesView from "../../../../components/createcomponents/sales/SalesView";

export const metadata = {
  title: "SDM SALES",
};

const Action = () => {
  return <SalesView Header = {'Sales'} route_back = {'/sales'}/>;
};

export default Action;