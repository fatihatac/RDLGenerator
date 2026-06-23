// Structural test for buildMatrix.js
// Validates XML output structure without requiring a test framework
// Run: node src/utils/builders/__tests__/buildMatrix.structural.test.js

import { buildMatrix } from '../buildMatrix.js';
import { XMLBuilder } from 'fast-xml-parser';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ ${message}`);
    failed++;
  }
}

function xmlBuilder() {
  return new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: '@_',
    suppressEmptyNode: true,
  });
}

// =====================
// Test 1: Row hierarchy — no Group on ungrouped rows, empty detail
// =====================
console.log('\n--- Test 1: Row Hierarchy ---');

const config1 = {
  id: 'test1',
  rowGroups: [
    { name: 'SicilNo', mappedField: 'sicilNo', width: 60 },
    { name: 'AdSoyad', mappedField: null, width: 100 },
  ],
  columnGroups: [],
  staticColumns: [
    { name: 'Durum', mappedField: 'durum', width: 30 },
  ],
  dataSourceId: 'Data1',
};

const result1 = buildMatrix(config1, { Data1: 'DataSet1' });
const xml1 = xmlBuilder().build(result1);

// a) No RowGroup_1_Static in output (ungrouped row has no Group)
assert(!xml1.includes('RowGroup_1_Static'), 'No RowGroup_1_Static (ungrouped row has no Group name)');

// b) No Group Name="Details" in output
assert(!xml1.includes('Details'), 'No Group Name="Details" in output');

// c) Only RowGroup_0 appears (the grouped row)
assert(xml1.includes('RowGroup_0'), 'RowGroup_0 appears (grouped row)');

// =====================
// Test 2: Column hierarchy — flat TablixMembers
// =====================
console.log('\n--- Test 2: Column Hierarchy ---');

const config2 = {
  id: 'test2',
  rowGroups: [{ name: 'R', mappedField: 'r', width: 30 }],
  columnGroups: [{ name: 'Gun', mappedField: 'gun', width: 30 }],
  staticColumns: [
    { name: 'Durum', mappedField: 'durum', width: 30 },
    { name: 'W', mappedField: 'normalGunToplam', width: 20 },
  ],
  dataSourceId: 'Data1',
};

const result2 = buildMatrix(config2, { Data1: 'DataSet1' });
const xml2 = xmlBuilder().build(result2);

// a) Count TablixMember occurrences in TablixColumnHierarchy section
const colHierarchySection = xml2.match(/<TablixColumnHierarchy>([\s\S]*?)<\/TablixColumnHierarchy>/);
if (colHierarchySection) {
  const section = colHierarchySection[1];
  const tablixMemberMatches = section.match(/<TablixMember>/g);
  const memberCount = tablixMemberMatches ? tablixMemberMatches.length : 0;
  assert(memberCount === 3, `Column hierarchy has 3 TablixMember siblings (found ${memberCount})`);
} else {
  assert(false, 'TablixColumnHierarchy section found');
}

// b) Grouped member has Group but no child TablixMembers
// The grouped member (Gun) should have Group element but no nested TablixMembers
const groupMemberPattern = /<TablixMember>[\s\S]*?<Group[^>]*>[\s\S]*?<\/Group>[\s\S]*?<\/TablixMember>/;
assert(groupMemberPattern.test(xml2), 'Grouped column member has Group element');

// Check that there's no nested TablixMembers inside the first grouped TablixMember
// (the grouped member should only have Group + SortExpressions + TablixHeader, no children)
const colGroupSection = xml2.match(/ColGroup_0[\s\S]*?<\/TablixMember>/);
if (colGroupSection) {
  const groupContent = colGroupSection[0];
  const hasNestedTablixMembers = /<TablixMembers>[\s\S]*?<\/TablixMembers>/.test(groupContent);
  assert(!hasNestedTablixMembers, 'Grouped column member has NO nested TablixMembers');
}

// c) Static member appears directly under TablixMembers (has StaticCol_0 name)
assert(xml2.includes('StaticCol_0'), 'Static column member StaticCol_0 found at top level');

// =====================
// Test 3: Corner — 1 TablixCornerRow with N cells
// =====================
console.log('\n--- Test 3: Corner Structure ---');

const config3 = {
  id: 'test3',
  rowGroups: [
    { name: 'SicilNo', mappedField: 'sicilNo', width: 60 },
    { name: 'AdSoyad', mappedField: null, width: 100 },
  ],
  columnGroups: [],
  staticColumns: [{ name: 'Durum', mappedField: 'durum', width: 30 }],
  dataSourceId: 'Data1',
};

const result3 = buildMatrix(config3, { Data1: 'DataSet1' });
const xml3 = xmlBuilder().build(result3);

// a) Count TablixCornerRow elements — should be exactly 1
const cornerRowMatches = xml3.match(/<TablixCornerRow>/g);
assert(cornerRowMatches && cornerRowMatches.length === 1, `Exactly 1 TablixCornerRow element (found ${cornerRowMatches ? cornerRowMatches.length : 0})`);

// b) Count TablixCornerCell elements — should be 2 (matching rowGroups.length)
const cornerCellMatches = xml3.match(/<TablixCornerCell>/g);
assert(cornerCellMatches && cornerCellMatches.length === 2, `2 TablixCornerCell elements (found ${cornerCellMatches ? cornerCellMatches.length : 0})`);

// c) Corner cells contain the row group names (via convertTitleCase with Turkish locale)
assert(xml3.includes('Sicilno'), 'First corner cell contains Sicilno');
assert(xml3.includes('Adsoyad'), 'Second corner cell contains Adsoyad');

// =====================
// Test 4: Body cells — no =Fields!null.Value
// =====================
console.log('\n--- Test 4: Body Cells ---');

const config4 = {
  id: 'test4',
  rowGroups: [{ name: 'R', mappedField: 'r', width: 30 }],
  columnGroups: [],
  staticColumns: [
    { name: 'X', mappedField: null, width: 20 },
    { name: 'Y', mappedField: 'someField', width: 20 },
  ],
  dataSourceId: 'Data1',
};

const result4 = buildMatrix(config4, { Data1: 'DataSet1' });
const xml4 = xmlBuilder().build(result4);

// a) No =Fields!null.Value anywhere
assert(!xml4.includes('Fields!null'), 'No =Fields!null.Value in output');

// b) Static column with mappedField="someField" has =Fields!someField.Value
assert(xml4.includes('Fields!someField'), 'Column with mappedField has =Fields!someField.Value');

// c) Static column with mappedField=null has empty Value element
// With suppressEmptyNode: true, empty string becomes <Value/>
assert(xml4.includes('<Value/>') || xml4.includes('<Value></Value>'), 'Null mappedField column has empty Value element');

// =====================
// Summary
// =====================
console.log(`\n=== Results: ${passed} passed, ${failed} failed, ${passed + failed} total ===`);
process.exit(failed > 0 ? 1 : 0);
