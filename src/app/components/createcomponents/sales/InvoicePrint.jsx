import React from 'react';

const InvoicePrint = ({ singleDataJson, paperSize = 'A4' }) => {
  const isA5 = paperSize === 'A5';

  // Page dimensions in mm
  const pageWidth = isA5 ? '148mm' : '210mm';
  const pageHeight = isA5 ? '210mm' : '297mm';

  // Responsive typography & spacing
  const baseFontSize = isA5 ? '11px' : '13px';
  const smallFontSize = isA5 ? '9px' : '11px';
  const headerFontSize = isA5 ? '20px' : '24px';
  const grandTotalFontSize = isA5 ? '16px' : '20px';
  const padding = isA5 ? '6mm' : '10mm';
  const cellPadding = isA5 ? '4px 6px' : '8px 10px';
  const logoSize = isA5 ? '48px' : '60px';

  // Items row minimum height (prevents huge empty space)
  const itemsMinHeight = isA5 ? '140px' : '220px';

  const dateFormatted = singleDataJson?.date_wise_selling
    ? new Date(singleDataJson.date_wise_selling).toLocaleDateString('en-GB').replace(/\//g, '-')
    : '—';

  return (
    <div
      style={{
        width: pageWidth,
        minHeight: pageHeight,
        maxHeight: pageHeight,           // prevents overflow on small paper
        padding: padding,
        boxSizing: 'border-box',
        fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
        fontSize: baseFontSize,
        color: '#000',
        backgroundColor: '#fff',
        border: '1px solid #000',        // only for screen preview
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ width: '22%', textAlign: 'center', verticalAlign: 'top' }}>
              <div
                style={{
                  border: '2px solid #000',
                  borderRadius: '50%',
                  width: logoSize,
                  height: logoSize,
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: isA5 ? '14px' : '16px',
                }}
              >
                சுரபி
              </div>
              <div
                style={{
                  fontSize: smallFontSize,
                  marginTop: '6px',
                  background: '#333',
                  color: '#fff',
                  padding: '2px 4px',
                  fontWeight: 'bold',
                }}
              >
                ஸ்ரீ சுரபி அக்ரி சென்டர்
              </div>
            </td>

            <td style={{ textAlign: 'center', padding: '0 8px' }}>
              <h2 style={{ margin: 0, fontSize: headerFontSize, fontWeight: 800, letterSpacing: '0.8px' }}>
                SRI SURABI AGRI CENTRE
              </h2>
              <p style={{ margin: '4px 0', fontSize: baseFontSize, lineHeight: 1.3 }}>
                425, Mysore Trunk Road, RangaSamuthiram,<br />
                Sathyamangalam-638402<br />
                Ph No : 04295222446
              </p>
              <p style={{ margin: '2px 0', fontSize: smallFontSize }}>
                FL No: ERD/STY/R-142/2018-21, S.L.No:1728/EDE/2015,<br />
                P.L.No:STY41/2016-17
              </p>
              <strong style={{ fontSize: baseFontSize }}>
                GSTIN : 33BDXPC4945B1ZM
              </strong>
            </td>

            <td style={{ width: '14%', textAlign: 'right', fontWeight: 'bold', fontSize: baseFontSize }}>
              Cash
            </td>
          </tr>
        </tbody>
      </table>

      {/* INVOICE title + No + Date + To */}
      <div style={{ margin: '10px 0 6px', border: '1px solid #000', borderTop: 'none' }}>
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: isA5 ? '13px' : '14px',
            padding: '4px',
            borderBottom: '1px solid #000',
            textDecoration: 'underline',
          }}
        >
          INVOICE
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
          <div style={{ flex: '1', padding: cellPadding, fontWeight: 'bold', borderRight: '1px solid #000' }}>
            No : {singleDataJson?.invoiceNo || '19065'}
          </div>
          <div style={{ flex: '1', padding: cellPadding, fontWeight: 'bold' }}>
            Date : {dateFormatted}
          </div>
        </div>

        <div style={{ padding: cellPadding, position: 'relative', minHeight: '38px' }}>
          <span style={{ fontWeight: 'bold' }}>To:</span>{' '}
          <strong>
            {singleDataJson?.trader_name || 'SHANMUGAM.ATHIYAPPA KAVUNDAN PUTHUR'}
          </strong>
          <div style={{ position: 'absolute', right: '8px', top: '8px', fontWeight: 'bold' }}>
            PH No : {singleDataJson?.phone || '9865044455'}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
        <thead>
          <tr style={{ background: '#f8f8f8', textAlign: 'center', fontSize: isA5 ? '10.5px' : '12px' }}>
            <th style={{ borderRight: '1px solid #000', width: '14%', padding: cellPadding }}>HSN</th>
            <th style={{ borderRight: '1px solid #000', width: '42%', padding: cellPadding }}>Particulars</th>
            <th style={{ borderRight: '1px solid #000', width: '10%', padding: cellPadding }}>Qty / Pcs</th>
            <th style={{ borderRight: '1px solid #000', width: '10%', padding: cellPadding }}>Rate</th>
            <th style={{ borderRight: '1px solid #000', width: '8%', padding: cellPadding }}>Tax%</th>
            <th style={{ width: '16%', padding: cellPadding }}>Taxable Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ verticalAlign: 'top', minHeight: itemsMinHeight }}>
            <td style={{ borderRight: '1px solid #000', padding: cellPadding, textAlign: 'center' }}>
              {singleDataJson?.hsn || '38089199'}
            </td>
            <td style={{ borderRight: '1px solid #000', padding: cellPadding, fontWeight: 'bold' }}>
              {singleDataJson?.flower_type_name || 'KUNOICHI - 250 ML'} {/* ← change field name if needed */}
            </td>
            <td style={{ borderRight: '1px solid #000', padding: cellPadding, textAlign: 'center' }}>
              {singleDataJson?.quantity || '10'}
            </td>
            <td style={{ borderRight: '1px solid #000', padding: cellPadding, textAlign: 'right' }}>
              {Number(singleDataJson?.per_quantity || 1).toFixed(2)}
            </td>
            <td style={{ borderRight: '1px solid #000', padding: cellPadding, textAlign: 'center' }}>
              18.0
            </td>
            <td style={{ padding: cellPadding, textAlign: 'right' }}>
              {Number(singleDataJson?.sub_amount || 10).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ border: '1px solid #000', borderTop: 'none', marginTop: '-1px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #000', fontWeight: 'bold' }}>
          <div style={{ flex: '1', padding: cellPadding, borderRight: '1px solid #000' }}>
            E&OE.  Total Qty :
          </div>
          <div style={{ flex: '1', padding: cellPadding, textAlign: 'center' }}>
            {singleDataJson?.quantity || '10'}
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1', borderRight: '1px solid #000' }}>
            <div style={{ padding: cellPadding }}>Total Before Tax</div>
            <div style={{ padding: cellPadding }}>CGST</div>
            <div style={{ padding: cellPadding }}>SGST</div>
          </div>

          <div style={{ flex: '1.6', textAlign: 'right', padding: '6px 8px' }}>
            <div>{Number(singleDataJson?.total_before_tax || 2923.72).toFixed(2)}</div>
            <div>{Number(singleDataJson?.cgst || 263.14).toFixed(2)}</div>
            <div>{Number(singleDataJson?.sgst || 263.14).toFixed(2)}</div>
          </div>

          <div style={{ flex: '1.4', textAlign: 'right', padding: '8px', borderLeft: '1px solid #000' }}>
            <div style={{ fontSize: smallFontSize, color: '#444', marginBottom: '8px' }}>
              Rounded off .01
            </div>
            <div style={{ fontSize: grandTotalFontSize, fontWeight: 'bold' }}>
              Grand Total : ₹ {Number(singleDataJson?.grand_total || 3450).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <div style={{ padding: '6px 8px', fontWeight: 'bold', border: '1px solid #000', borderTop: 'none' }}>
        Rs: Three Thousand Four Hundred And Fifty Only.
      </div>

      {/* Terms + Signatures */}
      <table style={{ width: '100%', border: '1px solid #000', borderTop: 'none', fontSize: smallFontSize }}>
        <tbody>
          <tr>
            <td style={{ width: '55%', padding: '8px', lineHeight: 1.5 }}>
              1. GOOD ONCE SOLD CANNOT BE TAKEN BACK OR EXCHANGED<br />
              2. SUBJECT TO SATHYAMANGALAM JURISDICTION.<br /><br />
              <span style={{ textDecoration: 'overline', fontWeight: 'bold' }}>
                Customer Signature
              </span>
            </td>
            <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'top' }}>
              <div style={{ marginBottom: '40px', fontWeight: 'bold' }}>
                For SRI SURABI AGRI CENTRE
              </div>
              <div style={{ fontWeight: 'bold' }}>Authorised Signatory</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Declaration */}
      <div style={{ textAlign: 'center', fontSize: isA5 ? '9px' : '11px', marginTop: '10px', fontStyle: 'italic' }}>
        இந்த பில்லில் உள்ள பொருள் விஷம் என்பது தெரியும் இதனை பயிர் பாதுகாப்பிற்கு மட்டும் பயன்படுத்துவேன் என உறுதி கூறுகிறேன்.
      </div>

      <div style={{ textAlign: 'center', fontSize: smallFontSize, marginTop: '8px' }}>
        Page 1
      </div>
    </div>
  );
};

export default InvoicePrint;