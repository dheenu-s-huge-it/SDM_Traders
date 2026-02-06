// import pdfMake from "pdfmake/build/pdfmake";
// import "./vfs_fonts";
// import moment from "moment";

// pdfMake.fonts = {
//   TiroTamilRegular: {
//     normal: "TiroTamil-Regular.ttf",
//     bold: "TiroTamil-Regular.ttf",
//   },
//   Roboto: {
//     normal: "Roboto-Regular.ttf",
//     bold: "Roboto-Bold.ttf",
//   },
// };

// const isTamil = (text) => {
//   const tamilRegex = /[\u0B80-\u0BFF]/;
//   return tamilRegex.test(text);
// };

// const getColumnWidths = (tableHead, tableBody) => {
//   const baseColumnWidth = (text) => {
//     const length = text.length;
//     if (text === "UID") {
//       return "9%";
//     } else if (text === "S.No") {
//       return "9%";
//     } else if (text === "Date") {
//       return "18%";
//     } else if (text === "INM") {
//       return "15%";
//     } else if (text === "EXP") {
//       return "15%";
//     } else if (text === "T.INM") {
//       return "15%";
//     } else if (text === "T.EXP") {
//       return "15%";
//     } else if (text === "DOJ") {
//       return "18%";
//     } else if (text === "F.Name") {
//       return "30%";
//     } else if (text === "T.Name") {
//       return "20%";
//     } else {
//       if (length <= 5) return "10%";
//       if (length <= 10) return "15%";
//       if (length <= 15) return "20%";
//       return "25%";
//     }
//   };

//   const columnWidth = tableHead.map((header, index) => {
//     if (index === tableHead.length - 1) {
//       return "30%";
//     }
//     return baseColumnWidth(header.text);
//   });

//   const totalWidth = columnWidth.reduce(
//     (acc, width) => acc + parseInt(width),
//     0
//   );

//   if (totalWidth > 100) {
//     const scaleFactor = 100 / totalWidth;
//     return columnWidth.map(
//       (width) => `${(parseInt(width) * scaleFactor).toFixed(2)}%`
//     );
//   } else if (totalWidth < 100) {
//     const remainingWidth = 100 - totalWidth;
//     const extraPerColumn = remainingWidth / columnWidth.length;
//     return columnWidth.map(
//       (width) => `${(parseInt(width) + extraPerColumn).toFixed(2)}%`
//     );
//   }

//   return columnWidth;
// };

// const MarketPDFGenerate = async ({
//   tableBody,
//   PDFData,
//   title,
//   name,
//   summaryFields,
// }) => {
//   const currentDate = new Date().toLocaleDateString();

//   const tableHead = Object.keys(PDFData[0] || []).map((key) => ({ text: key }));

//   const baseFontSize = 7;
//   const titleFontSize = 9;
//   const columnWidth = getColumnWidths(tableHead, tableBody);
//   const summaryData = {};

//   if (PDFData && summaryFields) {
//     PDFData.forEach((item) => {
//       summaryFields?.forEach((field) => {
//         const fieldValue = isNaN(Number(item[field])) ? 0 : Number(item[field]);
//         console.log(fieldValue);
//         summaryData[field] = (summaryData[field] || 0) + fieldValue;
//       });
//     });
//   }

//   const totalRow = tableHead.map((header) => {
//     if (summaryFields?.includes(header.text)) {
//       let totalValue = summaryData[header.text]
//         ? summaryData[header.text].toFixed(2)
//         : "0.00";
//       if (header.text === "C.Balance") {
//         const lastRowIndex = 0;
//         totalValue =
//           lastRowIndex >= 0
//             ? PDFData[lastRowIndex][header.text] || "0.00"
//             : "0.00";
//       }

//       return {
//         text: totalValue,
//         font: "Roboto",
//         alignment: "left",
//         fontSize: baseFontSize,
//         bold: true,
//         fillColor: "#f2f2f2",
//       };
//     }

//     return {
//       text: "",
//       fontSize: baseFontSize,
//       bold: true,
//       fillColor: "#f2f2f2",
//     };
//   });

//   const processText = (text, isBold = false) => ({
//     text,
//     font: isTamil(text) ? "TiroTamilRegular" : "Roboto",
//     alignment: "left",
//     fontSize: baseFontSize,
//     ...(isBold && { bold: true }),
//   });

//   const processText2 = (text) => ({
//     text,
//     font: isTamil(text) ? "TiroTamilRegular" : "Roboto",
//     alignment: "center",
//     fontSize: titleFontSize,
//     margin: [0, 10, 0, 0],
//   });

//   const processHeaderText = (text) => ({
//     text,
//     font: isTamil(text) ? "TiroTamilRegular" : "Roboto",
//     alignment: "left",
//     fontSize: baseFontSize,
//     bold: true,
//     italics: false,
//     fillColor: "#f2f2f2",
//   });

//   const tableBodyWithStyles = tableBody.map((row) =>
//     row.map((item, columnIndex) => {
//       const headerText = tableHead[columnIndex]?.text; // Get corresponding header text
//       const isAvalBalColumn = headerText === "Aval Bal"; // Check if it's "Aval Bal" column
//       return processText(item, isAvalBalColumn); // Apply bold style if it's "Aval Bal"
//     })
//   );

//   const docDefinition = {
//     pageSize: "A4",
//     pageOrientation: "landscape",
//     pageMargins: [20, 15, 15, 20],
//     content: [
//       processText2("சத்தி மலர் சாகுபடி விவசாயிகள் தலைமை சங்கம்"),
//       processText2("சத்தியமங்கலம்"),
//       {
//         columns: [
//           {
//             text: ` ${name}`,
//             alignment: "center",
//             font: "Roboto",
//             fontWeight: "bold",
//             fontSize: baseFontSize + 3,
//             margin: [0, 10, 0, 0],
//           },
//         ],
//       },
//       {
//         style: "tableExample",
//         table: {
//           headerRows: 1,
//           widths: columnWidth,
//           body: [
//             tableHead.map((item) => processHeaderText(item.text)), // Table header
//             ...tableBodyWithStyles, // Table data
//             ...(Object.keys(summaryData).length ? [totalRow] : []), // Add total row as the last row
//           ],
//         },
//         layout: {
//           hLineWidth: () => 1,
//           vLineWidth: () => 1,
//           hLineColor: () => "#D3D3D3",
//           vLineColor: () => "#D3D3D3",
//           paddingLeft: () => 2,
//           paddingRight: () => 2,
//           paddingTop: () => 2,
//           paddingBottom: () => 2,
//         },
//       },
//       {
//         text: "உழவன் உழைத்தால் உலகம் வாழும் !!!",
//         font: isTamil("உழவன் உழைத்தால் உலகம் வாழும் !!!")
//           ? "TiroTamilRegular"
//           : "Roboto",
//         fontSize: 8,
//         alignment: "center",
//         margin: [0, 20, 0, 0],
//       },
//     ].filter(Boolean),
//     defaultStyle: {
//       font: "Roboto",
//     },
//     styles: {
//       header: {
//         fontSize: titleFontSize,
//         bold: true,
//         italics: false,
//         margin: [0, 20, 0, 10],
//         fontWeight: "900",
//       },
//       subheader: {
//         fontSize: titleFontSize - 2,
//         margin: [0, 10, 0, 10],
//       },
//       small: {
//         fontSize: baseFontSize - 2,
//       },
//       tableExample: {
//         margin: [0, 10, 0, 0],
//       },
//       tableHeader: {
//         bold: true,
//         fontSize: 7,
//         fillColor: "#d9edf7",
//         alignment: "left",
//         padding: 5,
//       },
//       tableCell: {
//         fontSize: 7,
//         alignment: "left",
//         padding: 5,
//       },
//     },
//   };

//   pdfMake.createPdf(docDefinition).download(`${title}-${currentDate}.pdf`);
// };

// export default MarketPDFGenerate;


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
    } else if (text === "INM") {
      return "15%";
    } else if (text === "EXP") {
      return "15%";
    } else if (text === "T.INM") {
      return "15%";
    } else if (text === "T.EXP") {
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

// Helper function to find merge groups and calculate rowspan
const calculateMergeGroups = (tableBody, tableHead) => {
  const mergeGroups = [];
  const mergeColumns = ["S.No", "Date", "Total Qty", "Total T.Amt"];
  
  let currentGroup = [];
  let currentMergeKey = null;
  
  tableBody.forEach((row, rowIndex) => {
    // Create a key based on merge columns (excluding empty values)
    const mergeKey = mergeColumns.map((col, colIndex) => {
      const headerIndex = tableHead.findIndex(h => h.text === col);
      return headerIndex !== -1 ? row[headerIndex] : '';
    }).filter(val => val !== '').join('|');
    
    if (mergeKey !== currentMergeKey || mergeKey === '') {
      if (currentGroup.length > 0) {
        mergeGroups.push({
          startRow: currentGroup[0],
          endRow: currentGroup[currentGroup.length - 1],
          rowSpan: currentGroup.length
        });
      }
      currentGroup = [rowIndex];
      currentMergeKey = mergeKey;
    } else {
      currentGroup.push(rowIndex);
    }
  });
  
  // Don't forget the last group
  if (currentGroup.length > 0) {
    mergeGroups.push({
      startRow: currentGroup[0],
      endRow: currentGroup[currentGroup.length - 1],
      rowSpan: currentGroup.length
    });
  }
  
  return mergeGroups;
};

const MarketPDFGenerate = async ({
  tableBody,
  PDFData,
  title,
  name,
  summaryFields,
}) => {
  const currentDate = new Date().toLocaleDateString();

  const tableHead = Object.keys(PDFData[0] || []).map((key) => ({ text: key }));

  const baseFontSize = 7;
  const titleFontSize = 9;
  const columnWidth = getColumnWidths(tableHead, tableBody);
  const summaryData = {};

  if (PDFData && summaryFields) {
    PDFData.forEach((item) => {
      summaryFields?.forEach((field) => {
        const fieldValue = isNaN(Number(item[field])) ? 0 : Number(item[field]);
        summaryData[field] = (summaryData[field] || 0) + fieldValue;
      });
    });
  }

  const totalRow = tableHead.map((header) => {
    if (summaryFields?.includes(header.text)) {
      let totalValue = summaryData[header.text]
        ? summaryData[header.text].toFixed(2)
        : "0.00";
      if (header.text === "C.Balance") {
        const lastRowIndex = 0;
        totalValue =
          lastRowIndex >= 0
            ? PDFData[lastRowIndex][header.text] || "0.00"
            : "0.00";
      }

      return {
        text: totalValue,
        font: "Roboto",
        alignment: "left",
        fontSize: baseFontSize,
        bold: true,
        fillColor: "#f2f2f2",
      };
    }

    return {
      text: "",
      fontSize: baseFontSize,
      bold: true,
      fillColor: "#f2f2f2",
    };
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

  
   const processText3 = (text) => ({
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
    italics: false,
    fillColor: "#f2f2f2",
  });

  // Calculate merge groups
  const mergeGroups = calculateMergeGroups(tableBody, tableHead);
  const mergeColumns = ["S.No", "Date", "Total Qty", "Total T.Amt"];
  
  // Process table body with merging
  const tableBodyWithStyles = tableBody.map((row, rowIndex) => {
    return row.map((item, columnIndex) => {
      const headerText = tableHead[columnIndex]?.text;
      const isAvalBalColumn = headerText === "Aval Bal";
      const isMergeColumn = mergeColumns.includes(headerText);
      
      // Find if this row is part of a merge group
      const mergeGroup = mergeGroups.find(group => 
        rowIndex >= group.startRow && rowIndex <= group.endRow
      );
      
      let cellStyle = processText(item, isAvalBalColumn);
      
      // Handle merging for specific columns
      if (isMergeColumn && mergeGroup && mergeGroup.rowSpan > 1) {
        if (rowIndex === mergeGroup.startRow) {
          // First row of merge group - show content with rowSpan
          cellStyle.rowSpan = mergeGroup.rowSpan;
        } else {
          // Subsequent rows of merge group - don't render (will be merged)
          return null;
        }
      }
      
      return cellStyle;
    }).filter(cell => cell !== null); // Remove null cells (merged cells)
  });

  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [20, 15, 15, 20],
    content: [
      processText2("S.D.M. Mahendran"),
       processText2("Sathyamangalam Erode"),
      processText3("9442498222"),
      {
        columns: [
          {
            text: ` ${name}`,
            alignment: "center",
            font: "Roboto",
            fontWeight: "bold",
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
            ...tableBodyWithStyles, // Table data with merged cells
            ...(Object.keys(summaryData).length ? [totalRow] : []), // Add total row as the last row
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
        text: "",
        font: isTamil("")
          ? "TiroTamilRegular"
          : "Roboto",
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
        italics: false,
        margin: [0, 20, 0, 10],
        fontWeight: "900",
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

export default MarketPDFGenerate;