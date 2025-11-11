//import React, { useState } from "react";

import { useState } from "react";

const ReportTitleGenerator = () => {
  const [reportTitle,setReportTitle] = useState("")

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>1. Rapor Başlığını Girin</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
          placeholder="Rapor Başlığını Girin"
          style={{
            width: "100%",
            padding: "10px",
            boxSizing: "border-box",
            fontSize: "16px",
          }}
        />
      </div>
    </div>
  );
};

export default ReportTitleGenerator;
