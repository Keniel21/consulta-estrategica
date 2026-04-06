import XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:\\\\Users\\\\carol\\\\OneDrive\\\\Documentos\\\\PROJETO CONSULTA\\\\Lista_cooperativas_vertical.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['AderenciaServicos'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log(JSON.stringify(data.slice(0, 3), null, 2));
