import {writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {PROJECT,load,read,saveJson} from './batch01-material-utils.mjs';
import {ROUTES,JOURNEYS} from '../routes-data.js';
import {BATCH01_PHOTOS_BY_ROUTE,BATCH01_FACTS_BY_ROUTE} from '../assets/routes/20261013-batch01-materials.js';

const routes=ROUTES.filter(r=>r.id.includes('-b20-'));
const original=read(resolve(PROJECT,'assets/routes/batch20-adoption-index.json'));
const materialAdoption=read(resolve(PROJECT,'assets/routes/20261013-batch01-material-adoption.json'));
const diningAdoption=read(resolve(PROJECT,'assets/routes/20261013-batch01-dining-adoption.json'));
const sourcePhotoIndex=load('可用照片索引.json');
const oldFood=ROUTES.filter(r=>!r.id.includes('-b20-')).flatMap(r=>JOURNEYS[r.id].dining);
const newFood=routes.flatMap(r=>JOURNEYS[r.id].dining);
const pendingPhotos=[],tasks=[];
const humanKeys={public_scope:'公共观赏范围',public_access:'公众通行',public_entrance:'公众入口',temporary_restrictions:'临时限制',current_restrictions:'当前通行限制',photography:'摄影规则',opening_hours:'开放时段',reservation:'预约',ticket_types:'票种与费用',last_admission:'停止入场',stop_admission:'停止入场',entrance_identity:'入口身份'};
const cities=routes.map(r=>{
 const story=JOURNEYS[r.id],prior=original.cities.find(c=>c.routeId===r.id);
 const stops=r.map.points.map(p=>{
  const photos=story.photoCandidates[p.name]||[],facts=story.stopFacts?.[p.name];
  const supplemented=BATCH01_PHOTOS_BY_ROUTE[r.id]?.[p.name]||[];
  const gaps=[];
  if(!photos.length){gaps.push('可确认地点的独立实景照片');pendingPhotos.push({city:r.city,stop:p.name});}
  if(supplemented.some(photo=>photo.referenceKind==='identity-detail'))gaps.push('可选：景观全貌，目前新增图主要为题名细节');
  if(supplemented.some(photo=>photo.rasterSize&&Math.max(...photo.rasterSize)<=800))gaps.push('可选：更高清的同地点照片');
  const identityTask=({'chongqing-b20-city-day|少年宫':'滑梯唯一机构、设施和成人使用许可','luoyang-b20-city-day|东西大街':'沿街图具体街段身份','shenzhen-b20-city-day|深圳湾万象城A区':'A区门头、导视、楼层与入口','kunming-b20-city-day|巡津新村':'墙绘所在具体公共街口与边界','wuhan-b20-city-day|汉口江滩':'近期正常开放的公共岸段风景；历史封闸图仅存资料'})[r.id+'|'+p.name];
  if(identityTask)gaps.push(identityTask);
  const unknown=(facts?.fields||[]).filter(f=>['unknown','not_found'].includes(f.status)&&humanKeys[f.key]).map(f=>humanKeys[f.key]);
  if(unknown.length)gaps.push('待核：'+[...new Set(unknown)].join('、'));
  if(facts?.unverified?.length)gaps.push(...facts.unverified);
  if(!gaps.length)gaps.push('出行当天临时安排与现场通行仍需确认');
  const row={city:r.city,routeId:r.id,name:p.name,photos:photos.length,displayedFacts:facts?.displayFields?.length||0,gaps};tasks.push(row);
  return {name:p.name,photos:photos.length};
 });
 const missing=tasks.filter(t=>t.routeId===r.id).map(t=>({stop:t.name,photos:t.photos,items:t.gaps,access:story.stopAccess[r.map.points.findIndex(p=>p.name===t.name)]?.value||''}));
 return {...prior,updatedAt:new Date().toISOString(),landmarkPhotoCount:stops.reduce((n,s)=>n+s.photos,0),stops,missing,
  routeWarnings:story.collectionContext?.routeWarnings||prior.routeWarnings,status:'integrated',diningCount:story.dining.length,
  materialUpdate:'20261013-batch01',factSources:story.sources.length};
});
const totals={activeRoutes:ROUTES.length,newRoutes:routes.length,newStops:tasks.length,newScenePhotos:cities.reduce((n,c)=>n+c.landmarkPhotoCount,0),photoCoveredStops:tasks.filter(t=>t.photos).length,emptyPhotoStops:pendingPhotos,
 newDiningBranches:newFood.length,newDiningPhotos:newFood.reduce((n,d)=>n+d.photos.length,0),oldDiningBranches:oldFood.length,oldDiningPhotos:oldFood.reduce((n,d)=>n+d.photos.length,0),
 factsShownPoints:materialAdoption.ruleSummary.filter(r=>r.displayed).length,factsShownFields:materialAdoption.ruleSummary.reduce((n,r)=>n+(r.displayed||0),0),
 geographicReferences:routes.reduce((n,r)=>n+r.storyArtwork.reference.points.filter(p=>p.coordinate).length,0),trafficAlternatives:routes.reduce((n,r)=>n+JOURNEYS[r.id].legs.reduce((m,l)=>m+Object.keys(l.options).length,0),0)};
saveJson('assets/routes/batch20-adoption-index.json',{updatedAt:new Date().toISOString(),cities,integrated:routes.length,pending:[],materialUpdate:'20261013-batch01'});
saveJson('assets/routes/20261013-batch01-adoption-summary.json',{updatedAt:new Date().toISOString(),totals,cities,pendingDining:diningAdoption.pending,heldImages:materialAdoption.held});
const csv=[['城市','路线ID','景点','已接入照片','展示参考字段数','剩余资料任务'],...tasks.map(t=>[t.city,t.routeId,t.name,t.photos,t.displayedFacts,t.gaps.join('；')])];
const quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';
writeFileSync(resolve(PROJECT,'handoffs/2026-10-13-batch01-remaining-materials.csv'),'\uFEFF'+csv.map(row=>row.map(quote).join(',')).join('\r\n')+'\r\n');
const doc=['# 批次01已接入与剩余缺口','','核查日期：2026-10-13；以下为实际页面使用的数据，区别于仅采集资料。','',
 `新20条路线：96处景点，${totals.newScenePhotos}张实景参考，${totals.photoCoveredStops}处有照片；仍空：${pendingPhotos.map(p=>p.city+' '+p.stop).join('、')}。`,
 `接入${totals.newDiningBranches}家新分店参考和${totals.newDiningPhotos}张餐饮照片；旧13店当前${totals.oldDiningPhotos}张餐饮照片，保留原价格冲突与未知菜单版本。`,
 `${totals.factsShownPoints}处景点展示${totals.factsShownFields}个有原文依据的常规参考字段；其余证据和未核项一并进入复制给Agent的资料。`,
 `近日楼补到高德命名南门，95处旧参考增至${totals.geographicReferences}处。前后两段步行约230米/4分钟、150米/3分钟；有效骑行一并列出，公交返回缺少有效数值，未填入页面。全批有效交通备选${totals.trafficAlternatives}项。`,'',
 '## 下一轮优先级','','1. 重庆临华路：主线公共街面/公众站位的可定位实景。',
 '2. 少年宫滑梯、洛阳东西大街原图、深圳湾万象城A区、巡津新村墙绘：补精确机构/街段/导视身份。',
 '3. 白堤、曲院风荷、牛角岭的景观全貌；低分辨率图片可选换高清；汉口江滩补正常公共岸段风景，未用2020封闸历史图作主图。',
 '4. 当日库存、临时限制、公众入口和现场连通仍按逐字段补核。已有官方常规字段不再从零找。',
 '5. 青岛花神海、天津慕民、昆明Tree Tomato仍只留采集线索，待准确分店/门牌和可信人均后接入。',
 '6. 新17店仍缺部分菜单版本、日期、人均或分店照片；旧13店的菜单现价和鹤鸣20/25冲突继续按下表处理。','',
 '## 逐景点清单','',
 '| 城市 | 景点 | 已接入实景 | 仍需补齐 |','| --- | --- | ---: | --- |',
 ...tasks.map(t=>`| ${t.city} | ${t.name} | ${t.photos} | ${t.gaps.join('；').replaceAll('|','／').replace(/\n/g,' ')} |`),'',
 '## 餐饮仍缺','',
 '| 城市 | 分店 | 已接入图库 | 仍需补齐 |','| --- | --- | ---: | --- |',
 ...ROUTES.flatMap(r=>(JOURNEYS[r.id].dining||[]).map(d=>`| ${r.city} | ${d.name.replaceAll('|','／')} | ${d.photos.length} | ${(d.missingMaterials||['当前菜单/营业以到店前核对为准']).join('；').replaceAll('|','／')} |`)),
 '', '采集侧原始缺口表保留英文键用于匹配，页面不显示这些实现键。菜单参考、平台人均、历史账单与套餐继续分开。',
 '', '## 给采集Agent','', '```text','先读 D:\\daily\\routeo-explorer\\handoffs\\2026-10-13-batch01-remaining-materials.md。页面已采用36处补位照片和17家分店，不重复收集同样文件。',
 '按对应CSV找精确缺项；优先临华路、四项身份、景观全貌/高清升级，以及具体分店菜单/人均。',
 '当前近日楼地址、命名南门点位和前后机算交通已取得；继续补官方门牌和公众通行即可，不再重复用附近商户坐标定位。',
 '每张图保留作者、原链接、水印、具体地点/分店与身份依据；拍摄年未知写未知。每项价格保留单位、适用票种和出处。',
 '只采集整理，不改代码、不重绘20张地图；返回已找到、待核实、未找到与文件索引。','```','',
 '## 本次采用边界','','原20张地图、三幕、虚线与照片连续翻页继续沿用。新增照片、常规信息、餐饮与来源进入共用数据；没有用现价未明的菜单冒充当前价格，没有把品牌设计稿当指定分店菜单。',
 '已查看桌面与390px窄屏页面及菜单弹窗；窄屏预览不等于真机。没有运行自动化测试，没有上传或部署。',''];
writeFileSync(resolve(PROJECT,'handoffs/2026-10-13-batch01-remaining-materials.md'),doc.join('\n'));
writeFileSync(resolve(PROJECT,'handoffs/2026-10-13-batch01-update-log.md'),['# 2026-10-13 批次01更新日志','',
 '- 新20条路线新增38张可展示照片，2张旧图补身份证据；实景合计114张，覆盖95/96处景点。',
 `- 新17家分店参考接入${totals.newDiningPhotos}张餐饮图，其中4张菜单/价牌参考；广州云汇天地补入4张独立餐品图。青岛、天津、昆明3条店铺线索仍待实体核对。`,
 '- 旧13店新增4张餐饮图，合计50张；八百里秦川补携程人均来源。',
 '- 39处景点接入79个有本地对应原文的常规参考字段；来源和未核项进入复制提示词。',
 '- 近日楼使用高德地理编码明确命名的南门参考，不使用附近诊所/酒店POI；补两段有效步行/骑行。',
 '- 采用记录与逐景点缺口重新生成。20张插画地图、共享动画与页面布局沿用原版。','',
 '预览：苏州、广州科学城、昆明、北京及旧广州/西安的桌面、窄屏、照片与餐饮弹窗；没有自动化测试或外部发布。',''].join('\n'));
console.log(JSON.stringify(totals));
