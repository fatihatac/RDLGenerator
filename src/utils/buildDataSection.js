import { getDataType } from "./getDataType.js";
import parseAndExtractJsonInfo from "./parseAndExtractJsonInfo.js";

const buildDataSection = (allDataSources) => {
  if (!allDataSources || allDataSources.length === 0) {
    return {};
  }

  const dataSourcesXml = allDataSources.map(ds => {
    const connectStringData = {
      Data: ds.value,
      DataMode: "inline",
      URL: "",
    };
    return {
      "@_Name": `${ds.id}`,
      ConnectionProperties: {
        DataProvider: "JSON",
        ConnectString: JSON.stringify(connectStringData),
      },
      "rd:ImpersonateUser": "false",
    };
  });

  const dataSetsXml = allDataSources.map(ds => {
    const { parsedData } = parseAndExtractJsonInfo(ds.value);
    const firstRow = parsedData?.[0];

    // Fields for this specific DataSet
    const fields = (ds.jsonKeys || []).map((key) => ({
      "@_Name": key,
      DataField: key,
      "rd:TypeName": getDataType(firstRow?.[key]),
    }));

    // Query Columns for this specific DataSet
    const queryColumns = (ds.jsonKeys || []).map((key) => ({
      "@_Name": key,
      "@_IsDuplicate": "False",
      "@_IsSelected": "True",
    }));

    return {
      "@_Name": `DataSet_${ds.id}`, // Unique DataSet name
      Fields: { Field: fields },
      Query: {
        DataSourceName: `${ds.id}`, // Link to the correct DataSource
        CommandType: "Text",
        CommandText: '{"Name":"Result","Columns":[]}',
        QueryDesignerState: {
          "@_xmlns": "http://schemas.microsoft.com/ReportingServices/QueryDefinition/Relational",
          Tables: {
            Table: {
              "@_Name": "Result",
              "@_Schema": "",
              Columns: { Column: queryColumns },
              SchemaLevels: {
                SchemaInfo: { "@_Name": "Result", "@_SchemaType": "Table" },
              },
            },
          },
        },
      },
    };
  });

  return {
    DataSources: {
      DataSource: dataSourcesXml,
    },
    DataSets: {
      DataSet: dataSetsXml,
    },
  };
};

export default buildDataSection;