import parseAndExtractJsonInfo from "./parseAndExtractJsonInfo.js";
import getDataType from "./getDataType.js"; 
import { flattenData } from "./flattenData.js";

const buildDataSection = (dataItem, dataSetName) => {
  if (
    !dataItem ||
    !dataItem.value
  ) {
    return {};
  }

  const { parsedData, error } = parseAndExtractJsonInfo(dataItem.value);

  if (error || !parsedData) {
    console.error("Error parsing dataItem JSON in buildDataSection:", error);
    return {};
  }

  const flattenedData = flattenData(parsedData);

  if (flattenedData.length === 0) {
    return {};
  }

  const allKeys = Object.keys(flattenedData[0]);

  const fields = allKeys.map((key) => {
    const typeName = getDataType(flattenedData[0][key]);
    return {
      Field: {
        "@_Name": key,
        DataField: key,
        "rd:TypeName": typeName,
      },
    };
  });

  const queryColumns = allKeys.map((key) => ({
    Column: { "@_Name": key, "@_IsDuplicate": "False", "@_IsSelected": "True" },
  }));

  const connectStringData = {
    Data: JSON.stringify(flattenedData),
    DataMode: "inline",
    URL: "",
  };

  return {
    DataSources: {
      DataSource: {
        "@_Name": `${dataItem.id}`,
        ConnectionProperties: {
          DataProvider: "JSON",
          ConnectString: JSON.stringify(connectStringData),
        },
        "rd:ImpersonateUser": "false",
      },
    },
    DataSets: {
      DataSet: {
        "@_Name": dataSetName,
        Fields: { Field: fields.map((f) => f.Field) },
        Query: {
          DataSourceName: `${dataItem.id}`,
          CommandType: "Text",
          CommandText: '{"Name":"Result","Columns":[]}',
          QueryDesignerState: {
            "@_xmlns":
              "http://schemas.microsoft.com/ReportingServices/QueryDefinition/Relational",
            Tables: {
              Table: {
                "@_Name": "Result",
                "@_Schema": "",
                Columns: { Column: queryColumns.map((c) => c.Column) },
                SchemaLevels: {
                  SchemaInfo: { "@_Name": "Result", "@_SchemaType": "Table" },
                },
              },
            },
          },
        },
      },
    },
  };
};

export default buildDataSection;