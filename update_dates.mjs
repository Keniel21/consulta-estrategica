import XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:\\\\Users\\\\carol\\\\OneDrive\\\\Documentos\\\\PROJETO CONSULTA\\\\Lista_cooperativas_vertical.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['AderenciaServicos'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
const rows = data.slice(1);

const serviceNameMap = {
  'Auto': 'Seguro Automóvel',
  'Residencial': 'Seguro Residencial',
  'Empresarial': 'Seguro Empresarial',
  'Condominio': 'Seguro Condominio',
  'MaqEquip': 'Seguro Maq/Equip',
  'Rural': 'Seguro Rural',
  'Vida': 'Seguro Vida'
};

function excelToDate(serial) {
   if (!serial) return '2024-01-01';
   const utc_days  = Math.floor(serial - 25569);
   const utc_value = utc_days * 86400;                                        
   const date = new Date(utc_value * 1000);
   return date.toISOString().split('T')[0];
}

let values = [];
for (const row of rows) {
  const code = String(row[0]).padStart(4, '0');
  const service = row[2];
  const dateSerial = row[4];
  const name = serviceNameMap[service] || service;
  const dateStr = excelToDate(dateSerial);
  
  values.push(`('${code}', '${name}', '${dateStr}'::date)`);
}

const sql = `
UPDATE products 
SET start_date = v.start_date
FROM (VALUES 
  ${values.join(',\\n  ')}
) AS v(code, name, start_date)
JOIN cooperatives c ON c.code = v.code
WHERE products.cooperative_id = c.id AND products.name = v.name;
`;

fs.writeFileSync('update_dates_bulk.sql', sql, 'utf8');
console.log('Gerou update_dates_bulk.sql com', values.length, 'valores');
