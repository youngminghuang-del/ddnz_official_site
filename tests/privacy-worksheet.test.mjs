import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import test from 'node:test';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const source=fs.readFileSync(__dirname+'/../src/lib/privacyWorksheet.mjs','utf8').replace('export function bindPrivacyWorksheet()', 'function bindPrivacyWorksheet()')+'\nbindPrivacyWorksheet();';
async function scenario({protocol='https:',value='+12025550123',responseOk=true,result={ok:true},networkFail=false,method='WhatsApp'}){
 const nodes={};function node(id){return nodes[id]||= {value:'',hidden:true,disabled:false,textContent:'',events:{},addEventListener(k,f){this.events[k]=f},setCustomValidity(v){this.error=v},click(){this.clicked=true}}}
 const form=node('#lead-form');form.action='https://formspree.io/f/mdabvqbd';form.elements={_gotcha:{value:''}};form.prepend=()=>{};
 form.reportValidity=()=>!node('#contact-value').error;
 node('#contact-method').value=method;node('#contact-value').value=value;let calls=0,payload;
 const sandbox={document:{querySelector:node,documentElement:{lang:'en'},createElement:()=>node('created')},location:{protocol,origin:'https://test.invalid',pathname:'/draft'},FormData:class { *[Symbol.iterator](){yield ['contact_method',method];yield ['contact_value',value]}},AbortController,setTimeout,clearTimeout,fetch:async (url,opts)=>{calls++;payload=JSON.parse(opts.body);if(networkFail)throw Error('offline');return {ok:responseOk,json:async()=>result}}};
 vm.runInNewContext(source,sandbox);await form.events.submit({preventDefault(){}});return {nodes,calls,payload};
}
test('privacy worksheet unlocks only after accepted lead submission',async()=>{
 let s=await scenario({});assert.equal(s.calls,1);assert.equal(s.nodes['#download-area'].hidden,false);assert(s.nodes['#download-link'].clicked);assert.equal(s.payload.contact_value,'+12025550123');
 for(const opts of [{responseOk:false},{result:{ok:false}},{networkFail:true}]){s=await scenario(opts);assert.equal(s.nodes['#download-area']?.hidden??true,true);assert(!s.nodes['#download-link']?.clicked)}
 s=await scenario({protocol:'file:'});assert.equal(s.calls,0);assert.equal(s.nodes['#download-area'].hidden,false);assert(!s.nodes['#download-link'].clicked);
 for(const value of ['123','+       ','']){s=await scenario({value});assert.equal(s.calls,0)}
 s=await scenario({value:'buyer@example.test',method:'Email'});assert.equal(s.payload.email,'buyer@example.test');
 console.log('PASS: success-only unlock; HTTP/application/network failures stay locked; local preview sends nothing; invalid contacts rejected; email mapped. No network requests were made.');
});
