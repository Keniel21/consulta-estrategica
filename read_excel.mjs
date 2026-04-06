import XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:\\Users\\carol\\OneDrive\\Documentos\\PROJETO CONSULTA\\Lista_cooperativas_vertical.xlsx';
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

const serviceAreaMap = {
  'Auto': 'Automóveis',
  'Residencial': 'Patrimonial',
  'Empresarial': 'Empresarial',
  'Condominio': 'Condomínio',
  'MaqEquip': 'Equipamentos',
  'Rural': 'Agronegócio',
  'Vida': 'Vida'
};

const serviceIconMap = {
  'Auto': 'Car',
  'Residencial': 'Home',
  'Empresarial': 'Briefcase',
  'Condominio': 'Building2',
  'MaqEquip': 'Wrench',
  'Rural': 'Tractor',
  'Vida': 'HeartPulse'
};

// Group by cooperative
const coops = {};
for (const row of rows) {
  const code = String(row[0]);
  const service = row[2];
  const responsible = row[3];
  if (!coops[code]) coops[code] = [];
  coops[code].push({ service, responsible });
}

// Generate SQL
let sql = '';

for (const [code, products] of Object.entries(coops)) {
  for (const p of products) {
    const name = serviceNameMap[p.service] || p.service;
    const area = serviceAreaMap[p.service] || p.service;
    const icon = serviceIconMap[p.service] || 'ShieldCheck';
    const resp = p.responsible.replace(/'/g, "''");
    
    sql += `INSERT INTO products (cooperative_id, name, area, icon, responsible) SELECT id, '${name}', '${area}', '${icon}', '${resp}' FROM cooperatives WHERE code = '${code}';\n`;
  }
}

fs.writeFileSync('insert_products.sql', sql, 'utf8');
console.log(`Generated ${Object.values(coops).flat().length} INSERT statements`);
