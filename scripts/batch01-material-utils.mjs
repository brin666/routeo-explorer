import {readFileSync,writeFileSync,mkdirSync,existsSync,copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname,extname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';

export const PROJECT=resolve(fileURLToPath(new URL('../',import.meta.url)));
const materialsArgumentIndex=process.argv.indexOf('--materials');
export const MATERIALS=resolve((materialsArgumentIndex>=0?process.argv[materialsArgumentIndex+1]:null)||'D:/小红书数据采集/Routeo补齐_20261013_批次01');
export const cleanPath=p=>String(p||'').replaceAll('\\','/').replace(/\/+/g,'/');
export const read=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
export const load=name=>read(resolve(MATERIALS,name));
export const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
export const ledger=new Map(load('sources-ledger.json').sources.map(s=>[s.id,s]));
export const canonical=value=>{
 try{const u=new URL(value);if(!['http:','https:'].includes(u.protocol))return '';
  const m=u.pathname.match(/\/(?:explore|discovery\/item)\/([a-f0-9]+)/);
  if(u.hostname.replace(/^www\./,'')==='xiaohongshu.com'&&m)return 'https://www.xiaohongshu.com/explore/'+m[1];
  for(const k of [...u.searchParams.keys()])if(/xsec|token|cookie|signature|access|session|utm_|msource/i.test(k))u.searchParams.delete(k);
  return u.href;
 }catch{return '';}
};
export const sourceById=id=>{const s=ledger.get(id);return s?{label:s.title||new URL(s.url).hostname,url:canonical(s.url)}:null;};
export const routeId=id=>({'CD-01':'chengdu-cd01-city-day','NJ-01':'nanjing-nj01-qinhuai-day','XA-01':'xian-xa01-qujiang-day','nanjing-nj01':'nanjing-nj01-qinhuai-day','xian-xa01':'xian-xa01-qujiang-day'}[id]||id);
export const placeName=name=>({'小麦岛旁侧大陆海岸':'小麦岛旁侧海岸','IFS熊猫':'IFS 熊猫','圣心大教堂':'石室圣心大教堂','沙面':'沙面岛','上下九':'上下九步行街','中华门':'中华门城堡','夫子庙/秦淮河':'夫子庙 · 秦淮河','大唐芙蓉园':'大唐芙蓉园（可选）','大唐不夜城/开元广场':'大唐不夜城 · 开元广场'}[name]||name);
export function localSource(p,namespace=''){
 const raw=cleanPath(p);if(!raw)return null;
 const target=resolve(/^[A-Za-z]:\//.test(raw)?raw:resolve(MATERIALS,namespace,raw));
 // Reviewed batch files and explicitly reused originals stay inside the material root.
 const boundary=resolve(MATERIALS,'..');if(!target.toLowerCase().startsWith(boundary.toLowerCase()+'\\'))throw Error('Source image outside collection root');
 return target;
}
export function copyPhoto(p,{folder,slug,namespace='',expectedHash}={}){
 const source=localSource(p,namespace);if(!source||!existsSync(source))return null;
 const sha=hash(source);if(expectedHash&&sha!==expectedHash)throw Error('Reviewed image bytes changed: '+relative(MATERIALS,source));
 const rel=`assets/routes/${folder}/${slug}/${sha.slice(0,16)}${extname(source).toLowerCase()}`;
 const dest=resolve(PROJECT,rel);mkdirSync(dirname(dest),{recursive:true});
 if(!existsSync(dest)||hash(dest)!==sha)copyFileSync(source,dest);
 return {image:'./'+rel,originalSha256:sha,materialFile:cleanPath(relative(resolve(MATERIALS,'..'),source))};
}
export function writeModule(file,exports){
 mkdirSync(dirname(resolve(PROJECT,file)),{recursive:true});
 const text='// Curated local material update. Unknown dates and prices remain explicit.\n'+Object.entries(exports).map(([name,value])=>'export const '+name+' = '+JSON.stringify(value,null,2)+';').join('\n')+'\n';
 writeFileSync(resolve(PROJECT,file),text);
}
export function saveJson(file,value){mkdirSync(dirname(resolve(PROJECT,file)),{recursive:true});writeFileSync(resolve(PROJECT,file),JSON.stringify(value,null,2)+'\n');}
export function sourcesFrom(ids=[]){return [...new Map(ids.map(sourceById).filter(s=>s?.url).map(s=>[s.url,s])).values()];}
