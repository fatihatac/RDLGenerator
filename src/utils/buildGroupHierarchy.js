function buildGroupHierarchy(groups, sums) {
  if (!groups?.length) {
    return {
      TablixMembers: {
        TablixMember: [
          { KeepWithGroup: "After" },
          { Group: { "@_Name": "Details" } },
          ...(sums?.length ? [{ KeepWithGroup: "Before" }] : [])
        ]
      }
    };
  }

  const group = groups[0];

  return {
    TablixMembers: {
      TablixMember: [
        {
          TablixHeader: {
            Size: "72pt"
          },
          TablixMembers: { TablixMember: {} }
        },
        {
          Group: {
            "@_Name": group.name,
            GroupExpressions: {
              GroupExpression: `=Fields!${group.mappedField}.Value`
            }
          },
          SortExpressions:{
            SortExpression:{
                Value:`=Fields!${group.mappedField}.Value`
            }
          },
          TablixMembers: {
            TablixMember: [
              { Group: { "@_Name": "Details" } },
              ...(sums?.length ? [{ KeepWithGroup: "Before" }] : [])
            ]
          }
        }
      ]
    }
  };
}

export { buildGroupHierarchy };
