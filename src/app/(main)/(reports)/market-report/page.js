"use client";
import React, { useState, useEffect, useRef } from "react";
import Tabs from "../../../components/container/ReportsTab";
import DetailedView from "../../../components/report_tables/market_report/DetailedView";
import QtyView from "../../../components/report_tables/market_report/QtyView";

const Action = () => {
  useEffect(() => {
    document.title = "SDM MARKET REPORT";
  }, []);

  const TableComponents = () => {
    if (tabsValue === 1) {
      return <DetailedView />;
    } else if (tabsValue === 2) {
      return <QtyView />;
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
      name: "Day Wise Report",
      content: <TabContent value={1} />,
    },
    // {
    //   value: 2,
    //   name: "QTY View",
    //   content: <TabContent value={2} />,
    // },
  ];

  return (
    <>
      <Tabs tabs={tabs} tabValue={tabsValue} setTabValue={settabsValue} />
    </>
  );
};

export default Action;
