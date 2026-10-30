import fs from 'node:fs';
import path from 'node:path';
import {exportCustomerFreight} from './customer-freight-export.mjs';
const args=process.argv.slice(2);const source=args[args.indexOf('--source')+1];const output=args[args.indexOf('--output')+1];
if(!args.includes('--source')||!args.includes('--output')||!source||!output)throw Error('Use --source INTERNAL_FILE --output PUBLIC_FILE');
const result=exportCustomerFreight(JSON.parse(fs.readFileSync(source,'utf8')));
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(result));
console.log(JSON.stringify({customerRows:result.rows.length,ports:result.coverage.length,period:result.period,internalFieldsExported:false}));
