"use client";
import React, { useState } from "react";
import Tabs from "../../../../components/container/ReportsTab";
import SalesCreate from "../../../../components/createcomponents/sales/SalesCreate";
import SalesCreateMultiple from "../../../../components/createcomponents/sales/SalesCreateMultiple";

const Action = () => {
  const [tabValue, setTabValue] = useState(1);
  const tabs = [
    {
      value: 1,
      name: "Single Sale Order",
      content: <SalesCreate Header={'Sales'} route_back={'/sales'} />,
    },
    {
      value: 2,
      name: "Multiple Sales Order",
      content: <SalesCreateMultiple Header={'Sales'} route_back={'/sales'} />,
    },
  ];
  return (
    <>
      <Tabs tabs={tabs} tabValue={tabValue} setTabValue={setTabValue} />
    </>
  );
};

export default Action;
