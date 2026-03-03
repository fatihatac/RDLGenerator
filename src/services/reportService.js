import { generateRDL, handleDataUpdateSideEffects } from "../utils";

export const downloadReportFile = (reportItems, fileName) => {
  const titleItem = reportItems.find((item) => item.type === "title");
  const reportTitle =
    titleItem && titleItem.value ? titleItem.value : "TaslakRapor";
  const finalReportName =
    fileName && fileName.trim() !== "" ? fileName.trim() : reportTitle;

  const rdlContent = generateRDL(reportItems);
  const blob = new Blob([rdlContent], { type: "application/xml" });
  const objectUrl = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.download = `${finalReportName.toUpperCase()}.rdl`;

  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Cleanup to prevent memory leaks
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(objectUrl);
};

export const processDataSideEffects = (
  dataItemId,
  reportItems,
  updateReportItemsCallback,
) => {
  const targetDataItem = reportItems.find((item) => item.id === dataItemId);

  if (targetDataItem) {
    const updatedReportItems = handleDataUpdateSideEffects(
      targetDataItem,
      reportItems,
    );
    updateReportItemsCallback(updatedReportItems);
  }
};
