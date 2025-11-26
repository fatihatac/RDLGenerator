const buildDataSection = (dataItem, tableItem, dataSetName) => {
  if (
    !dataItem ||
    !tableItem ||
    !dataItem.jsonKeys ||
    dataItem.jsonKeys.length === 0
  ) {
    return {};
  }

  // Fields
  const fields = dataItem.jsonKeys.map((key) => {
    const mappedColumn = tableItem.columns.find(
      (col) => col.mappedField === key
    );
    const typeName = mappedColumn ? mappedColumn.dataType : "System.String";
    return {
      Field: {
        "@_Name": key,
        DataField: key,
        "rd:TypeName": typeName,
      },
    };
  });

  // Query Columns
  const queryColumns = dataItem.jsonKeys.map((key) => ({
    Column: { "@_Name": key, "@_IsDuplicate": "False", "@_IsSelected": "True" },
  }));

  // Connection String
  const connectStringData = {
    Data: dataItem.value,
    DataMode: "inline",
    URL: "",
  };

  return {
    DataSources: {
      DataSource: {
        "@_Name": "DataSource1",
        ConnectionProperties: {
          DataProvider: "JSON",
          ConnectString: JSON.stringify(connectStringData), // Builder otomatik escape yapacaktır
        },
        "rd:ImpersonateUser": "false",
      },
    },
    DataSets: {
      DataSet: {
        "@_Name": dataSetName,
        Fields: { Field: fields.map((f) => f.Field) },
        Query: {
          DataSourceName: "DataSource1",
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

export default buildDataSection