"use client";
import React, { useState, useEffect, useRef } from "react";
import Tabs from "../../../components/container/ReportsTab";
import GroupReport from "../../../components/report_tables/trader_report/GroupReport";
import RateWiseReport from "../../../components/report_tables/trader_report/RateWiseReport";
import TraderStatement from "../../../components/report_tables/trader_report/TraderStatement";

const Action = () => {
  useEffect(() => {
    document.title = "SDM TRADER REPORT";
  }, []);

  const TableComponents = () => {
    if (tabsValue === 1) {
      return <TraderStatement />;
    } else if (tabsValue === 2) {
      return <GroupReport />;
    }else if (tabsValue === 3) {
      return <RateWiseReport/>;
    }
  };

  const [tabsValue, settabsValue] = useState(1);

  const TabContent = ({ value }) => {
    useEffect(() => {
      settabsValue(value);
    }, [value]);

    return <>{TableComponents()}</>;
  };

  const tabs = [
    {
      value: 1,
      name: "Trader Statement",
      content: <TabContent value={1} />,
    },
    {
      value: 2,
      name: "Group Wise Report",
      content: <TabContent value={2} />,
    },
    {
      value: 3,
      name: "Rate Wise Report",
      content: <TabContent value={3} />,
    },
  ];

  return (
    <>
      <Tabs tabs={tabs} tabValue={tabsValue} setTabValue={settabsValue} />
    </>
  );
};

export default Action;
