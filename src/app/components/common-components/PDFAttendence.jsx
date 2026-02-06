import pdfMake from "pdfmake/build/pdfmake";
import "./vfs_fonts";
import moment from "moment";

pdfMake.fonts = {
  TiroTamilRegular: {
    normal: "TiroTamil-Regular.ttf",
    bold: "TiroTamil-Regular.ttf",
  },
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Bold.ttf",
  },
};

const isTamil = (text) => {
  const tamilRegex = /[\u0B80-\u0BFF]/;
  return tamilRegex.test(text);
};

const getColumnWidths = (tableHead, tableBody) => {
  const baseColumnWidth = (text) => {
    const length = text.length;
    if (text === "UID") {
      return "9%";
    } else if (text === "S.No") {
      return "9%";
    } else if (text === "Date") {
      return "18%";
    } else if (text === "EMAIL ID") {
      return "36%";
    } else if (text === "AREA") {
      return "30%";
    } else if (text === "PHONE") {
      return "15%";
    } else if (text === "Time") {
      return "15%";
    } else if (text === "DOJ") {
      return "18%";
    } else if (text === "F.Name") {
      return "30%";
    } else if (text === "T.Name") {
      return "20%";
    } else {
      if (length <= 5) return "10%";
      if (length <= 10) return "15%";
      if (length <= 15) return "20%";
      return "25%";
    }
  };

  const columnWidth = tableHead.map((header, index) => {
    if (index === tableHead.length - 1) {
      return "30%";
    }
    return baseColumnWidth(header.text);
  });

  const totalWidth = columnWidth.reduce(
    (acc, width) => acc + parseInt(width),
    0
  );

  if (totalWidth > 100) {
    const scaleFactor = 100 / totalWidth;
    return columnWidth.map(
      (width) => `${(parseInt(width) * scaleFactor).toFixed(2)}%`
    );
  } else if (totalWidth < 100) {
    const remainingWidth = 100 - totalWidth;
    const extraPerColumn = remainingWidth / columnWidth.length;
    return columnWidth.map(
      (width) => `${(parseInt(width) + extraPerColumn).toFixed(2)}%`
    );
  }

  return columnWidth;
};

const PDFAttendence = async ({ tableBody, PDFData, title, name, summaryFields }) => {
    const currentDate = new Date().toLocaleDateString();
    const tableHead = Object.keys(PDFData[0] || []).map((key) => ({ text: key }));
    const baseFontSize = 7;
    const titleFontSize = 9;
    const columnWidth = getColumnWidths(tableHead, tableBody);
    const summaryData = {};
  
    if (PDFData && summaryFields) {
      PDFData.forEach((item) => {
        summaryFields?.forEach((field) => {
          const fieldValue = Number(item[field] || 0);
          summaryData[field] = (summaryData[field] || 0) + fieldValue;
        });
      });
    }
  
  const totalRow = tableHead.map((header) => {
  if (summaryFields?.includes(header.text)) {
    return {
      text: summaryData[header.text] ? summaryData[header.text].toFixed(2) : "0.00",
      font: isTamil(header.text) ? "TiroTamilRegular" : "Roboto",
      alignment: "left",
      fontSize: baseFontSize,
      bold: true,
      fillColor: "#f2f2f2",
    };
  }
  return { text: "", fontSize: baseFontSize, bold: true, fillColor: "#f2f2f2" };
});

  
    const processText = (text, isBold = false) => ({
      text,
      font: isTamil(text) ? "TiroTamilRegular" : "Roboto",
      alignment: "left",
      fontSize: baseFontSize,
      ...(isBold && { bold: true }),
    });
  
    const processText2 = (text) => ({
      text,
      font: isTamil(text) ? "TiroTamilRegular" : "Roboto",
      alignment: "center",
      fontSize: titleFontSize,
      margin: [0, 10, 0, 0],
    });
  
    const processHeaderText = (text) => ({
      text,
      font: isTamil(text) ? "TiroTamilRegular" : "Roboto",
      alignment: "left",
      fontSize: baseFontSize,
      bold: true,
      fillColor: "#f2f2f2",
    });
  
    // Construct tableBodyWithStyles to include total rows under each employee_nick_name
    const tableBodyWithStyles = [];
  
    PDFData.forEach((row) => {
      let rowData = Object.keys(row).map((key) => processText(row[key]));
      
      // Add row to table
      tableBodyWithStyles.push(rowData);
  
      // Add the total row under each employee_nick_name if applicable
      if (row["_employeeTotals"]) {
        let totalRow = Object.keys(row["_employeeTotals"]).map((nickName) => ({
          text: `Total: ${row["_employeeTotals"][nickName]}`,
          font: isTamil(nickName) ? "TiroTamilRegular" : "Roboto",
          alignment: "center",
          fontSize: baseFontSize,
          bold: true,
          fillColor: "#f2f2f2",
        }));
  
        tableBodyWithStyles.push(totalRow);
      }
    });
  
    const docDefinition = {
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [20, 15, 15, 20],
      content: [
        processText2("சத்தி மலர் சாகுபடி விவசாயிகள் தலைமை சங்கம்"),
        processText2("சத்தியமங்கலம்"),
        {
          columns: [
            {
              text: ` ${name}`,
              alignment: "center",
              font: "Roboto",
              fontSize: baseFontSize + 3,
              margin: [0, 10, 0, 0],
            },
          ],
        },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: columnWidth,
            body: [
              tableHead.map((item) => processHeaderText(item.text)), // Table header
              ...tableBodyWithStyles, // Table data with total rows
              // Summary total row at the bottom
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => "#D3D3D3",
            vLineColor: () => "#D3D3D3",
            paddingLeft: () => 2,
            paddingRight: () => 2,
            paddingTop: () => 2,
            paddingBottom: () => 2,
          },
        },
        {
          text: "உழவன் உழைத்தால் உலகம் வாழும் !!!",
          font: isTamil("உழவன் உழைத்தால் உலகம் வாழும் !!!") ? "TiroTamilRegular" : "Roboto",
          fontSize: 8,
          alignment: "center",
          margin: [0, 20, 0, 0],
        },
      ].filter(Boolean),
      defaultStyle: {
        font: "Roboto",
      },
      styles: {
        header: {
          fontSize: titleFontSize,
          bold: true,
          margin: [0, 20, 0, 10],
        },
        subheader: {
          fontSize: titleFontSize - 2,
          margin: [0, 10, 0, 10],
        },
        small: {
          fontSize: baseFontSize - 2,
        },
        tableExample: {
          margin: [0, 10, 0, 0],
        },
        tableHeader: {
          bold: true,
          fontSize: 7,
          fillColor: "#d9edf7",
          alignment: "left",
          padding: 5,
        },
        tableCell: {
          fontSize: 7,
          alignment: "left",
          padding: 5,
        },
      },
    };
  
    pdfMake.createPdf(docDefinition).download(`${title}-${currentDate}.pdf`);
  };
  

export default PDFAttendence;
