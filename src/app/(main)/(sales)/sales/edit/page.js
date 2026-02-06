import SalesEdit from "../../../../components/createcomponents/sales/SalesEdit";

export const metadata = {
  title: "SDM SALES",
};

const Action = () => {
  return <SalesEdit Header = {'Sales'} route_back = {'/sales'}/>;
};

export default Action;