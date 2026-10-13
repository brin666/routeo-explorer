import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {PROJECT,MATERIALS,load,routeId,placeName,canonical,sourceById,copyPhoto,localSource,writeModule,saveJson,hash,read} from './batch01-material-utils.mjs';
import {ROUTES,JOURNEYS} from '../routes-data.js';

const photographs=load('可用照片索引.json'),rules=load('官方规则_父级合并.json');
const photoUpdates={},facts={},sources={},adopted=[],held=[],ruleSummary=[],quoteIssues=[];
const addSource=(id,s)=>{if(!s?.url)return;const list=sources[id]||=[];if(!list.some(v=>v.url===s.url))list.push(s);};
const normalizeText=s=>String(s||'').replace(/\s+/g,'').replace(/[“”]/g,'"');
const activeRoutes=new Map(ROUTES.map(r=>[r.id,r]));

for(const p of photographs){
 const id=routeId(p.route_id),name=placeName(p.stop),route=activeRoutes.get(id);
 if(!route||!route.map.points.some(s=>s.name===name)){held.push({city:p.city,stop:name,reason:'景点名不匹配当前主线'});continue;}
 if(/historical entrance\/closure/i.test(p.parent_ready_scope||'')){held.push({city:p.city,stop:name,reason:'历史封闸入口图，仅保留在资料中'});continue;}
 const file=localSource(p.file);if(!file||!existsSync(file))throw Error('Reviewed photo missing: '+name);
 const source=canonical(p.source_url);if(!source){held.push({city:p.city,stop:name,reason:'缺公开来源'});continue;}
 const existing=(JOURNEYS[id]?.photoCandidates?.[name]||[]).filter(v=>!v.image?.includes('/batch01-reference-photos/')).find(v=>{
  const path=resolve(PROJECT,v.image);return existsSync(path)&&hash(path)===p.sha256;
 });
 const stored=existing?{image:existing.image,originalSha256:p.sha256}:copyPhoto(p.file,{folder:'batch01-reference-photos',slug:id.split('-')[0],expectedHash:p.sha256});
 const rawCaption=({'白堤':'白堤现场题牌','曲院风荷':'曲院风荷御碑题名','牛角岭公园':'牛角岭题名石','孤山路':'孤山路临湖视角','近日楼':'近日楼外观与题名','什刹海':'什刹海公共湖岸 · 银锭桥','江汉路步行街':'江汉路沿街实景'})[name]||name+'实景';
 const ledgerSource=sourceById(p.parent_source_id||p.ledger_id);
 const photo={...stored,title:rawCaption,source,artist:p.author||'来源公开署名',sourceTitle:ledgerSource?.label||rawCaption,
  sourceDate:p.published_at_visible||'未知',captureDate:p.capture_date_visible||null,identityEvidence:Array.isArray(p.identity_basis)?p.identity_basis.join('；'):p.identity_basis||'',
  license:p.license_visible||p.rights_note||'使用状态随原来源记录保留',materialBatch:'Routeo补齐_20261013_批次01',originalFile:p.original_file?String(p.original_file).split(/[/\\]/).pop():String(p.file).split(/[/\\]/).pop(),
  imageScope:p.parent_ready_scope||'',rasterSize:p.pixels,referenceKind:/identity-detail/.test(p.parent_ready_scope||'')?'identity-detail':'scene',
  ...(/reuse/.test(p.reuse_or_new||'')?{reuseExisting:true}:{})};
 ((photoUpdates[id]||={})[name]||=[]).push(photo);
 adopted.push({routeId:id,city:p.city,stop:name,image:photo.image,reused:Boolean(existing),originalSha256:p.sha256});
 addSource(id,{label:ledgerSource?.label||rawCaption+' · '+photo.artist,url:source});
}

const labels={ticket_types:'门票参考',reservation:'预约／购票',opening_hours:'开放参考',stop_admission:'停止入场',last_admission:'停止入馆',public_entrance:'公众入口',official_entry:'查询入口',public_access:'通行参考',entrance_identity:'入口位置',public_scope_reference:'观赏范围',public_connection_reference:'步行衔接',public_connection_evidence:'步行衔接',address:'地址',location:'位置',access_scope:'参观范围',photography:'摄影规则',lighting_reference:'灯光参考',opening_hours_reference:'开放参考',reservation_reference:'预约参考',ticket_types_reference:'票务参考',last_admission_reference:'停止入场',restrictions:'通行限制',museum_branch:'馆区',reservation_cutoff:'预约截止',combo_ticket:'联票范围'};
function displayValue(key,value){
 if(typeof value==='string')return value;
 if(!value||typeof value!=='object')return '';
 if(key==='ticket_types')return [Number.isFinite(value.single_standard_cny)?`单票${value.single_standard_cny}${value.unit||'元'}`:'',Number.isFinite(value.full_cny)?`全价${value.full_cny}元`:'',Number.isFinite(value.half_cny)?`半价${value.half_cny}元`:'',Number.isFinite(value.combo_cny)?`联票${value.combo_cny}元（${(value.combo_scope||[]).join('、')}）`:'',Number.isFinite(value.day_cny)?`日间${value.day_cny}元`:'',Number.isFinite(value.night_with_show_cny)?`含演出夜间${value.night_with_show_cny}元`:'',Number.isFinite(value.night_without_show_cny)?`不含演出夜间${value.night_without_show_cny}元`:''].filter(Boolean).join('；');
 const valueLabels={morning:'上午',afternoon:'下午',Apr_1_to_Oct_31:'4月至10月',Nov_1_to_Mar_31:'11月至3月',Apr_to_Oct:'4月至10月',Nov_to_Mar:'11月至3月',day:'日间',Apr_to_Nov_night:'4月至11月夜间',Dec_to_Mar_night:'12月至3月夜间'};
 return Object.entries(value).filter(([k,v])=>valueLabels[k]&&typeof v==='string').map(([k,v])=>valueLabels[k]+' '+v).join('；');
}
for(const r of rules){
 const id=routeId(r.route_id),name=placeName(r.attraction||r.name),route=activeRoutes.get(id);
 if(!route?.map.points.some(s=>s.name===name)){ruleSummary.push({routeId:id,stop:name,status:'unmatched'});continue;}
 const normalized=[];
 for(const [key,f] of Object.entries(r.fields||{})){
  const status=f.state||f.status,evidence=[];
  for(const e of f.evidence||[]){
   const source=sourceById(e.source_id);if(!source?.url)continue;
   const path=e.evidence_file||e.evidence_path;
   let literalVerified=false;
   if(path){const file=localSource(path);literalVerified=existsSync(file)&&normalizeText(readFileSync(file,'utf8')).includes(normalizeText(e.quote));}
   if(e.quote&&!literalVerified)quoteIssues.push({routeId:id,stop:name,key,reason:'引用片段未在对应本地正文匹配'});
   evidence.push({source:source.label,url:source.url,quote:e.quote||'',publishedAt:e.publication_date||null,literalVerified,tier:e.tier||f.source_type||null});
  }
  const scope=f.temporal_scope||f.current_validity||f.scope||'';
  const historical=/historical_only|expired|historical_|^old_/.test(scope+' '+key);
  const displayed=displayValue(key,f.value);
  normalized.push({key,label:labels[key]||key,status,value:f.value??null,displayValue:displayed,scope,historical,
   sourceType:f.source_type||null,evidence,note:f.note||'',displayEligible:status==='found'&&!historical&&Boolean(labels[key])&&Boolean(displayed)&&evidence.some(e=>e.literalVerified)});
 }
 const priority=['ticket_types','reservation','opening_hours','stop_admission','last_admission','public_entrance','address','location','access_scope','public_scope_reference','public_access','entrance_identity','opening_hours_reference','reservation_reference','ticket_types_reference','photography','public_connection_reference','official_entry'];
 const rank=key=>priority.includes(key)?priority.indexOf(key):priority.length;
 const displayFields=normalized.filter(f=>f.displayEligible).sort((a,b)=>rank(a.key)-rank(b.key)).slice(0,4);
 const summary=displayFields.map(f=>f.label+'：'+f.displayValue).join('；');
 const missing=normalized.filter(f=>['not_found','unknown'].includes(f.status)).map(f=>labels[f.key]||f.key);
 const record={state:r.state||r.status,summary:summary?summary+'。当日临时安排与余量请出发前确认。':'',fields:normalized,
  displayFields:displayFields.map(f=>f.key),missingFields:missing,unverified:r.important_unverified||r.unverified||[]};
 (facts[id]||={})[name]=record;
 for(const f of displayFields)for(const e of f.evidence.filter(e=>e.literalVerified))addSource(id,{label:route.city+' · '+name+' · '+f.label,url:e.url});
 ruleSummary.push({routeId:id,stop:name,state:record.state,displayed:displayFields.length,referenceFields:normalized.filter(f=>f.status==='found').length});
}

const geoFile='D:/routeo/tools/batch20/kunming-batch01-query.json';
let geo=null;
if(existsSync(geoFile)){
 const query=read(geoFile);
 if(query.selectedPoint&&query.segments?.length===2){
  const archive=read(resolve(PROJECT,'assets/routes/batch20/kunming-b20-amap-reference.json'));
  const prior=archive.points.find(p=>p.name==='近日楼');
  const point={...prior,...query.selectedPoint,url:'https://uri.amap.com/marker?position='+query.selectedPoint.coordinate.join(',')+'&name='+encodeURIComponent('近日楼南门')};
  archive.points=archive.points.map(p=>p.name==='近日楼'?point:p);
  archive.segments=archive.segments.map(s=>query.segments.find(n=>n.from===s.from&&n.to===s.to)||s);
  archive.routeQueriedAt=query.routeQueriedAt;
  archive.materialUpdate={batch:'20261013-batch01',pointMethod:'exact-named-gate-geocoding',addressCorroboration:'携程景点对应地址敬德巷6号；仅地址旁证',accessStatus:'公众通行与门禁未实走'};
  saveJson('assets/routes/batch20/kunming-b20-amap-reference-batch01.json',archive);
  const calibration=read(resolve(PROJECT,'assets/routes/batch20/kunming-b20-calibration-v1.json'));
  geo={point,segments:query.segments,segmentPaths:calibration.segmentPaths,queriedAt:query.routeQueriedAt,archive:'./assets/routes/batch20/kunming-b20-amap-reference-batch01.json'};
  addSource('kunming-b20-city-day',{label:'高德 · 近日楼南门参考位置',url:point.url});
 }
}
writeModule('assets/routes/20261013-batch01-materials.js',{BATCH01_PHOTOS_BY_ROUTE:photoUpdates,BATCH01_FACTS_BY_ROUTE:facts,BATCH01_SOURCES_BY_ROUTE:sources,BATCH01_KUNMING_GEO:geo});
saveJson('assets/routes/20261013-batch01-material-adoption.json',{updatedAt:new Date().toISOString(),adopted,held,ruleSummary,quoteIssues,kunmingGeoResolved:Boolean(geo)});
console.log(JSON.stringify({photoRecords:adopted.length,newPhotos:adopted.filter(p=>!p.reused).length,reused:adopted.filter(p=>p.reused).length,held,
 ruleRows:ruleSummary.length,pointsWithDisplayFacts:ruleSummary.filter(r=>r.displayed).length,displayedFields:ruleSummary.reduce((n,r)=>n+(r.displayed||0),0),quoteIssues:quoteIssues.length,kunmingGeoResolved:Boolean(geo)}));
