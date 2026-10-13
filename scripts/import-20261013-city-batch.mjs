import {readFileSync,writeFileSync,existsSync,mkdirSync,copyFileSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const argument=(name)=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
const task=resolve(argument('--workdir')||'D:/routeo/tools/batch20'),project=resolve(fileURLToPath(new URL('../',import.meta.url))),material=resolve(argument('--materials')||'D:/小红书数据采集/20城市一日路线_20261013');
const read=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const plans=['plans-01-07.json','plans-08-14.json','plans-15-20.json'].flatMap(f=>read(task+'/'+f));
const generated=[],journeys={},pending=[],summary=[];
const colors=['#dc965b','#68a5ac','#629e7e','#d4a358','#ba8174','#7d98b1','#ae9b73','#668f7c','#dbab6a'];
const palette={nanjing:'#cc9667',chengdu:'#ba8263',xian:'#bd8958',beijing:'#bf9059',chongqing:'#cb8664',luoyang:'#d29c61',wuhan:'#83a8a4',guangzhou:'#81a174',changsha:'#b38f71',shanghai:'#729db0',suzhou:'#8caa8c',hangzhou:'#6da7a1',qingdao:'#6fa9ba',jinan:'#a0ac74',xiamen:'#db9c71',shenzhen:'#74a796',tianjin:'#b1967c',fuzhou:'#8bae8e',kunming:'#b99b6d',guiyang:'#849e83'};
const canonical=value=>{try{const u=new URL(value);if(!['https:','http:'].includes(u.protocol))return '';const m=u.pathname.match(/\/(?:explore|discovery\/item)\/([a-f0-9]+)/);if(u.hostname.replace(/^www\./,'')==='xiaohongshu.com'&&m)return 'https://www.xiaohongshu.com/explore/'+m[1];return u.href;}catch{return '';}};
const noteUrl=id=>'https://www.xiaohongshu.com/explore/'+id;
const distance=m=>m>=1000?'约 '+(m/1000).toFixed(1)+' km':'约 '+Math.max(10,Math.round(m/10)*10)+' m';
const straight=(a,b)=>{if(!Array.isArray(a)||!Array.isArray(b))return null;const r=x=>x*Math.PI/180,dlat=r(b[1]-a[1]),dlon=r(b[0]-a[0]),v=Math.sin(dlat/2)**2+Math.cos(r(a[1]))*Math.cos(r(b[1]))*Math.sin(dlon/2)**2;return 6371000*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v));};
function copyPhoto(photo,plan,index,localIndex){
 const relative=photo.relativeFile.startsWith(plan.folder+'/')?photo.relativeFile:plan.folder+'/'+photo.relativeFile;
 const source=resolve(material,relative),boundary=resolve(material);
 if(!source.startsWith(boundary+'\\')&&!source.startsWith(boundary+'/'))throw Error('Photo path outside material directory');
 if(!existsSync(source))throw Error('Selected photograph missing: '+relative);
 const rel='assets/routes/b20-reference-photos/'+plan.slug+'/'+(index+1)+'-'+photo.noteId+'-'+(localIndex+1)+extname(source),target=join(project,rel);mkdirSync(resolve(target,'..'),{recursive:true});
 if(!existsSync(target)||statSync(source).size!==statSync(target).size||statSync(source).mtimeMs>statSync(target).mtimeMs)copyFileSync(source,target);
 return {image:'./'+rel,title:photo.title,source:noteUrl(photo.noteId),artist:photo.artist,sourceTitle:photo.noteTitle,sourceDate:photo.displayDate||'未知',identityEvidence:photo.identityEvidence,license:'使用状态未确认',originalFile:relative};
}
function recommended(options,plan){
 const keys=Object.keys(options);if(!keys.length)return {mode:null,text:'站间交通待核对，请按出发时地图与入口安排'};
 if(options.walk?.meters<=1800)return {mode:'walk',text:'短距离步行衔接；另留游览、休息和排队时间'};
 const stairs=['nanjing','chongqing','guangzhou','guiyang'].includes(plan.slug);
 const ranked=keys.filter(k=>!stairs||k!=='cycle').map(k=>({k,cost:options[k].seconds+(k==='cycle'?600:0)})).sort((a,b)=>a.cost-b.cost);
 const mode=(ranked[0]||{k:keys[0]}).k;
 return {mode,text:mode==='cycle'?'骑行转场较省时；另留取还车时间，步行街与公园按现场规则推行':mode==='transit'?'公交 / 地铁转场较省时；候车、班次和实际入口出发前确认':'步行转场；坡道、台阶和临时通行以现场为准'};
}
for(const plan of plans){
 const id=plan.slug+'-b20-city-day',stem='assets/routes/batch20/'+plan.slug+'-b20',prefix=join(project,stem);
 const geo=read(task+'/geography/'+plan.slug+'.json'),layout=read(prefix+'-layout.json');
 const ready=existsSync(prefix+'-artwork-v1.webp')&&existsSync(prefix+'-calibration-v1.json');
 const photos={},references={};
 plan.stops.forEach((s,i)=>{photos[s.name]=(s.photos||[]).map((p,j)=>copyPhoto(p,plan,i,j));references[s.name]=(s.references||[]).map(n=>({...n,url:canonical(n.url||noteUrl(n.noteId))})).filter(n=>n.url);});
 const counts=plan.stops.map(s=>({name:s.name,photos:photos[s.name].length})),sourceIds=[...new Set(Object.values(references).flat().map(r=>r.noteId).filter(Boolean))];
 const missing=plan.stops.map(s=>({stop:s.name,photos:photos[s.name].length,items:plan.missing?.find(m=>m.stop===s.name)?.items||[],access:s.access,...(!geo.points.find(p=>p.placeKey===s.placeKey)?.coordinate?{geographicPoint:'真实点位待核，不能以临近店铺坐标替代'}:{})}));
 const archive={city:plan.city,slug:plan.slug,routeId:id,collectionFolder:plan.folder,originalRouteKind:read(join(material,plan.folder,'route_analysis.json')).route_kind,generatedAt:new Date().toISOString(),landmarkPhotoCount:counts.reduce((n,s)=>n+s.photos,0),stops:counts,routeWarnings:plan.routeWarnings,legacyOverlap:plan.legacyOverlap,sourceNoteIds:sourceIds,missing,illustrationReady:ready};
 writeFileSync(prefix+'-adoption.json',JSON.stringify(archive,null,2));
 const publicGeo={...geo,points:geo.points.filter(p=>plan.stops.some(s=>s.placeKey===p.placeKey))};
 writeFileSync(prefix+'-amap-reference.json',JSON.stringify(publicGeo,null,2));
 if(!ready){pending.push(plan.city);summary.push({...archive,status:'artwork-in-progress'});continue;}
 const art=read(prefix+'-calibration-v1.json'),width=art.width||art.sourceDetailSize?.width,height=art.height||art.sourceDetailSize?.height;
 if(!width||!height)throw Error('Artwork dimensions missing: '+plan.slug);
 const rawMarkers=art.markers||art.anchors||[];
 const markers=plan.stops.map((s,i)=>{const p=rawMarkers.find(m=>m.placeKey===s.placeKey||m.name===s.name)||rawMarkers[i];if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))throw Error('Calibrated landmark missing: '+plan.city+'/'+s.name);return {...p,name:s.name,placeKey:s.placeKey,experienceKey:s.experienceKey,poiId:geo.points.find(p=>p.placeKey===s.placeKey)?.poiId||null,color:colors[i%colors.length],labelPlacement:p.labelPlacement||(p.x>width*.6?'above-left':'above-right'),coordinateStatus:geo.points.find(p=>p.placeKey===s.placeKey)?.coordinate?'visual-anchor-on-generated-artwork':'visual-draft-geography-pending'};});
 const paths=art.segmentPaths||art.segments?.map(s=>s.path)||[];
 const pathAt=i=>typeof paths[i]==='string'?paths[i]:paths[i]?.path||'';
 const overall=art.route||paths.map((p,i)=>pathAt(i)).join(' ');
 if(!overall)throw Error('Calibrated route missing: '+plan.slug);
 const sources=[];const seen=new Set();const add=(label,url)=>{url=canonical(url);if(url&&!seen.has(url)){sources.push({label,url});seen.add(url);}};
 for(const s of plan.stops)for(const n of references[s.name])add(n.title+(n.author?' · '+n.author:''),n.url);
 for(const p of publicGeo.points)if(p.url)add('高德 · '+p.name,p.url);
 const legs=plan.stops.slice(0,-1).map((s,i)=>{
  const next=plan.stops[i+1],origin=publicGeo.points.find(p=>p.placeKey===s.placeKey),dest=publicGeo.points.find(p=>p.placeKey===next.placeKey),segment=geo.segments?.find(g=>g.from===origin?.name&&g.to===dest?.name),options={};
  for(const [mode,v] of Object.entries(segment?.options||{})){if(v.status!=='complete'||!Number.isFinite(v.time)||!Number.isFinite(v.distance)||v.time<0||v.distance<0)continue;options[mode]={label:{walk:'步行',cycle:'骑行',transit:'公交 / 地铁'}[mode],duration:'约 '+Math.max(1,Math.ceil(v.time/60))+' 分钟',distance:distance(v.distance),seconds:v.time,meters:v.distance,path:pathAt(i),source:'高德站间路线查询',queriedAt:'2026-10-13',detail:mode==='walk'?'POI或归档入口间机算，不含园内游览、门禁和排队':mode==='cycle'?'周边道路机算，另留取还车时间；步行街与公园按现场规则':'公交与地铁含接驳；当日候车、班次及站口另核'};}
  const pick=recommended(options,plan),d=straight(origin?.routeCoordinate||origin?.coordinate,dest?.routeCoordinate||dest?.coordinate);
  return {from:s.name,to:next.name,recommendedMode:pick.mode,recommendation:pick.text,straightLineDistance:d===null?'':distance(d),options,...(!Object.keys(options).length?{status:'pending'}:{})};
 });
 const totals=legs.reduce((n,l)=>n+(l.options[l.recommendedMode]?.meters||0),0),allLegs=legs.every(l=>l.options[l.recommendedMode]);
 const artwork={image:'./'+stem+'-artwork-v1.webp',width,height,route:overall,markers,sourceDetailSize:{width,height},rasterSize:{width,height},reference:{coordinateSystem:'GCJ-02',queriedAt:'2026-10-13',archive:'./'+stem+'-amap-reference.json',points:publicGeo.points.map(p=>({name:p.name,poiName:p.poiName,poiId:p.poiId,coordinate:p.coordinate,routeCoordinate:p.routeCoordinate,status:p.coordinate?'POI-location-reference':'pending',url:p.url})),illustratedRouteStatus:'道路视觉示意；高德真实交通节点单独归档，不作逐点投影导航'}};
 const title=plan.title.replace(new RegExp('^'+plan.city+'[｜|·：: ]+'),'');
 const route={id,city:plan.city,region:'中国',place:'中国 · '+plan.city,flag:'cn',title,days:1,tags:plan.tags.slice(0,4),theme:plan.slug,image:artwork.image,accent:palette[plan.slug],intro:plan.intro,quote:plan.quote,map:{kind:'city-garden',maxZoom:1.25,route:overall,roads:[],contours:[],points:markers.map((m,i)=>({name:m.name,x:m.x/width*1200,y:m.y/height*675,color:m.color,role:i===0?'start':i===markers.length-1?'end':null,labelSide:m.x>width*.6?'left':'right',labelY:'above',hideCardLabel:true}))},storyArtwork:artwork,snapshots:[],story:plan.stops.map(s=>({day:1,time:s.time,title:s.name,body:s.description})),guideSources:sources};
 const practical=plan.practical.map(p=>Array.isArray(p)?p:[p.term,p.value]);
 practical.push(['时间与票务','时间轴是行程建议，原作者到访时间另存；票价、预约及临时开放以出发时官方信息为准。'],['地图与交通','插画用于理解站点关系；站间时间是高德机算参考，不含景区内部游览、排队和临时管制。'],['餐饮','具体分店、人均与菜单资料待补；沿途用餐单独留出时间。']);
 const journey={eyebrow:plan.slug.toUpperCase()+' · CITY DAY',duration:'1 日',distance:allLegs?distance(totals)+'转场':'站间距离待核',stopTimes:plan.stops.map(s=>s.time),stopTags:plan.stops.map(()=>plan.tags.slice(0,2)),previewImages:plan.stops.map(s=>photos[s.name][0]?.image||null),previewMissingBehavior:'hide',stopAccess:plan.stops.map(s=>({heading:'门票与预约',value:s.access})),legs,routeNote:'插画虚线为道路关系示意；导航请使用当日地图。',photoTitle:plan.city+'沿途实景',photoIntro:'按行程顺序翻看实景照片，翻完一站自动进入下一站。下方可查看作者与参考笔记；暂缺照片的地点会跳过。',photoCandidates:photos,photoReferences:references,dining:plan.dining||[],diningNote:'具体分店与消费来源正在补充。',practical,sources,labelPlacements:markers.map(m=>m.labelPlacement),collectionContext:{routeKind:archive.originalRouteKind,routeWarnings:plan.routeWarnings,timeRecords:plan.stops.map(s=>({name:s.name,time:s.time,authorTime:s.authorTime,timeSource:s.timeSource})),missing,legacyOverlap:plan.legacyOverlap},dataSupplement:{updatedAt:'2026-10-13',sourceNotes:sourceIds.length,sourceNoteIds:sourceIds,landmarkPhotoCount:archive.landmarkPhotoCount,diningPhotoCount:0,selectedPhotoCount:archive.landmarkPhotoCount,missing:missing.flatMap(m=>m.items.map(v=>m.stop+'：'+v))}};
 journey.mobileStartAtFirst=true;
 journey.routeBasisNote=archive.originalRouteKind==='researcher_subset'?'参考笔记中的路线保留原顺序、删减部分停留后编排；时间轴为建议安排，请按体力和开放情况调整。':archive.originalRouteKind==='author_day_segment'?'按作者当日游览段编排，前一晚活动和机场接驳另行安排；时间轴为建议时刻。':'景点顺序参考作者的同日路线，具体时刻请按出行日、排队和交通调整。';
 const covered=counts.filter(s=>s.photos);
 if(!covered.length)journey.photoIntro='这些地点的实景照片正在补充。下方可先查看当前景点的参考笔记。';
 else if(covered.length===1)journey.photoIntro='目前可看'+covered[0].name+'的实景照片，其余地点正在补充；下方可查看作者和参考笔记。';
 plan.stops.forEach((s,i)=>{if(!publicGeo.points.find(p=>p.placeKey===s.placeKey)?.coordinate)journey.stopAccess[i].value+=' 具体地标位置仍待核，请在出行前按官方地址确认。';});
 writeFileSync(prefix+'-data.js','// Generated from locally reviewed notes; geographic coordinates and artwork pixels are separate.\nexport const ROUTE = '+JSON.stringify(route,null,2)+';\nexport const JOURNEY = '+JSON.stringify(journey,null,2)+';\n');
 generated.push(route);journeys[id]=journey;summary.push({...archive,status:'integrated',routeId:id});
}
const imports=generated.map(r=>`import { ROUTE as ${r.id.split('-')[0]}Route, JOURNEY as ${r.id.split('-')[0]}Journey } from "./batch20/${r.id.split('-')[0]}-b20-data.js";`).join('\n');
writeFileSync(project+'/assets/routes/batch20-data.js',imports+'\nexport const BATCH20_ROUTES = ['+generated.map(r=>r.id.split('-')[0]+'Route').join(',')+'];\nexport const BATCH20_JOURNEYS = {'+generated.map(r=>JSON.stringify(r.id)+':'+r.id.split('-')[0]+'Journey').join(',')+'};\n');
writeFileSync(project+'/assets/routes/batch20-adoption-index.json',JSON.stringify({updatedAt:new Date().toISOString(),cities:summary,integrated:generated.length,pending},null,2));
const handoff=['# 20城路线制作与逐景点补齐清单','','项目：`D:\\daily\\routeo-explorer`','资料：`D:\\小红书数据采集\\20城市一日路线_20261013`','',`本轮接入 ${generated.length} 条新路线；原四条保留。候选照片共 ${summary.reduce((n,s)=>n+s.landmarkPhotoCount,0)} 张，未把资料日期当成照片拍摄年，也未把作者历史票价当现价。`, '','## 城市总览','','| 城市 | 新路线 | 实景照片 | 地图状态 |','| --- | --- | --- | --- |',...summary.map((s,i)=>`| ${s.city} | ${plans[i].title} | ${s.landmarkPhotoCount} | ${s.status==='integrated'?'已接入':'制作中'} |`),''];
for(let i=0;i<plans.length;i++){const p=plans[i],s=summary[i];handoff.push('## '+p.city+' / '+s.routeId,'',p.stops.map(v=>v.name).join(' → '),'','| 景点 | 已采用 | 仍需补什么 |','| --- | --- | --- |');for(const m of s.missing)handoff.push(`| ${m.stop} | ${m.photos}张 | ${(m.items.length?m.items:['无额外必补项']).join('；').replaceAll('|','／')}${m.geographicPoint?'；'+m.geographicPoint:''} |`);handoff.push('','餐饮：尚缺可确认的具体分店、地址、人均出处和菜单照片；不把泛餐品或作者一次花费写成门店人均。','','路线说明：'+(p.routeWarnings||[]).join('；'),'');}
handoff.push('## 转交给采集 Agent 的提示词','','```text','请读取 D:\\daily\\routeo-explorer\\handoffs\\2026-10-13-batch20-missing-materials.md。只收集资料，不修改项目代码。','按目标城市与具体景点，先看“已采用”列，补“仍需补什么”，不重复采集同一张路线海报。','每个地点优先提供1–3张能确认地点的独立实景角度；泛街景、跨城图、只换作者或机位不能伪造新体验。','餐饮要匹配准确分店与地址，人均注明平台或记录出处；菜单单价、套餐、个人消费分别列，不推测。','票务与预约优先当前官方原文，无法取得就标待核，不把采集日期或只有月日的帖子补成年份。','保留原图水印、原始链接、作者、图号、拍摄/发布日期（未知写未知）、地点身份依据。','按城市/景点/分店建文件夹，输出安全索引和未找到项；不要把临时访问令牌或账号信息放进交付索引。','地图POI与交通由制作Agent处理，近日楼等明确缺少地理身份的点可提供官方地址旁证。','```','');
mkdirSync(project+'/handoffs',{recursive:true});writeFileSync(project+'/handoffs/2026-10-13-batch20-missing-materials.md',handoff.join('\n'));
console.log(JSON.stringify({integrated:generated.length,pending,landmarkPhotos:summary.reduce((n,s)=>n+s.landmarkPhotoCount,0),stops:plans.reduce((n,p)=>n+p.stops.length,0)}));
