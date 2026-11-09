import fs from 'node:fs/promises';
const [output='artifacts/pages-receipt.json',jobName='deploy']=process.argv.slice(2);
const repo=process.env.GITHUB_REPOSITORY,run=process.env.GITHUB_RUN_ID;
if(!repo||!run||process.env.GITHUB_REF_NAME!=='main')throw new Error('Production main context required');
let step;
for(let attempt=0;attempt<6;attempt++){
 const response=await fetch(`https://api.github.com/repos/${repo}/actions/runs/${run}/jobs?filter=latest&per_page=100`,{headers:{Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Cannot read deployment receipt');
 const data=await response.json();step=data.jobs.find(j=>j.name===jobName)?.steps.find(s=>s.name==='Deploy to GitHub Pages'&&s.conclusion==='success'&&s.completed_at);
 if(step)break;await new Promise(r=>setTimeout(r,2000));
}
if(!step)throw new Error('Successful Pages step has no verified timestamp');
const receipt={version:1,branch:'main',conclusion:'success',published_at:step.completed_at,run_id:Number(run),commit:process.env.GITHUB_SHA};await fs.mkdir('artifacts',{recursive:true});await fs.writeFile(output,JSON.stringify(receipt,null,2)+'\n');
