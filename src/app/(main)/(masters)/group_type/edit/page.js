// Component Imports
import EditGroupTypeMaster from "../../../../components/createcomponents/masters/EditGroupTypeMaster";

export const metadata = {
  title: "SDM Group TYPE",
}; 

const Action = () => {
  return <EditGroupTypeMaster Header = {'Group Type'} route_back = {'/group_type'}/>;
};

export default Action;
