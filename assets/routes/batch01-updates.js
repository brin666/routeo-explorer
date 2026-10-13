import {BATCH01_PHOTOS_BY_ROUTE,BATCH01_FACTS_BY_ROUTE,BATCH01_SOURCES_BY_ROUTE,BATCH01_KUNMING_GEO} from './20261013-batch01-materials.js';
import {BATCH01_DINING_BY_ROUTE,BATCH01_LEGACY_DINING_UPDATES} from './20261013-batch01-dining.js';

const uniqueSources=list=>[...new Map(list.filter(s=>s?.url).map(s=>[s.url,s])).values()];
const uniquePhotos=list=>[...new Map(list.map(p=>[p.originalSha256||p.image,p])).values()];
const distance=m=>m>=1000?'约 '+(m/1000).toFixed(1)+' km':'约 '+Math.max(10,Math.round(m/10)*10)+' m';
const straight=(a,b)=>{if(!a||!b)return null;const rad=x=>x*Math.PI/180,dlat=rad(b[1]-a[1]),dlon=rad(b[0]-a[0]),v=Math.sin(dlat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dlon/2)**2;return 6371000*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v));};

export function applyBatch01Updates(routes,journeys){
 for(const route of routes){
  const id=route.id,story=journeys[id];if(!story)continue;
  const photos=BATCH01_PHOTOS_BY_ROUTE[id]||{};
  const points=route.map.points;
  for(const [name,additions] of Object.entries(photos)){
   const current=story.photoCandidates?.[name]||[],byImage=new Map(current.map(p=>[p.image,p]));
   for(const p of additions)if(byImage.has(p.image))byImage.set(p.image,{...byImage.get(p.image),...p});
   const newPhotos=additions.filter(p=>!current.some(c=>c.image===p.image||c.originalSha256===p.originalSha256));
   story.photoCandidates[name]=uniquePhotos([...newPhotos,...current.map(p=>byImage.get(p.image))]);
   const index=points.findIndex(p=>p.name===name);if(index>=0&&story.photoCandidates[name].length)story.previewImages[index]=story.photoCandidates[name][0].image;
  }
  if(Object.keys(photos).length){
   const count=Object.values(story.photoCandidates).reduce((n,p)=>n+p.length,0);
   const covered=points.filter(p=>story.photoCandidates[p.name]?.length).length;
   story.photoIntro=covered===points.length?'沿行程顺序翻看各站实景，继续翻动会进入下一站。点击照片可放大查看。':`已有${covered}处景点的实景参考，按行程顺序连续翻看；其余地点照片正在补充。`;
   if(story.dataSupplement)story.dataSupplement.landmarkPhotoCount=count;
   if(story.collectionContext?.routeWarnings)story.collectionContext.routeWarnings=story.collectionContext.routeWarnings.filter(s=>!/(四个公园照片暂空|五站本轮没有采用|近日楼、敬德巷和铁皮巷现有实景归属不足|只采用西泠桥转角一张|主线.*拼图|照片只采用西泠桥)/.test(s));
  }
  const facts=BATCH01_FACTS_BY_ROUTE[id]||{};
  story.stopFacts={...(story.stopFacts||{}),...facts};
  for(const [name,record] of Object.entries(facts)){
   const index=points.findIndex(p=>p.name===name);if(index<0||!record.summary)continue;
   story.stopAccess[index]={...(story.stopAccess[index]||{}),heading:'门票、预约与到达',value:record.summary};
  }
  if(id==='suzhou-b20-city-day'){
   route.story[0].body='先看苏州博物馆的白墙、几何屋顶与水景，按预约时段入馆参观。预约与开放参考见下方说明，展期和当日余量请按出行日期核对。';
   route.story[1].body='在拙政园看水面、庭院、亭廊和园林空间的层次。分时预约参考见下方说明；票种与当日开放安排请在出发前确认，入园后按体力选择游览范围。';
  }
  story.sources=uniqueSources([...(story.sources||[]),...(BATCH01_SOURCES_BY_ROUTE[id]||[])]);
  if(BATCH01_DINING_BY_ROUTE[id])story.dining=BATCH01_DINING_BY_ROUTE[id];
  for(const update of BATCH01_LEGACY_DINING_UPDATES[id]||[]){
   const restaurant=story.dining?.find(r=>r.name===update.name||r.id===update.id);if(!restaurant)continue;
   restaurant.photos=uniquePhotos([...(update.photos||[]),...(restaurant.photos||[])]).sort((a,b)=>(a.kind==='menu'?0:1)-(b.kind==='menu'?0:1));
   if(update.perPerson){restaurant.perPerson=update.perPerson;restaurant.price=`参考人均 ¥${update.perPerson.value}（${update.perPerson.source}）`;restaurant.url=update.perPerson.url;restaurant.source=update.perPerson.source;}
   restaurant.materialNotes=update.materialNotes;restaurant.missingMaterials=update.missingMaterials;
   restaurant.note=[restaurant.note,...(update.materialNotes||[])].filter(Boolean).join('；');
   story.sources=uniqueSources([...story.sources,...(update.sourceLinks||[])]);
  }
  if(story.dining?.length){
   const sourceLinks=story.dining.flatMap(r=>[{label:r.name+' · 消费参考',url:r.perPerson?.url||r.url},...(r.sourceLinks||[]).map(s=>typeof s==='string'?{label:r.name+' · 来源',url:s}:s)]);
   story.sources=uniqueSources([...story.sources,...sourceLinks]);
   story.diningNote='沿途具体分店参考；人均保留来源，菜单版本与营业以出行时为准。';
  }
  if(story.dataSupplement){
   story.dataSupplement.diningPhotoCount=(story.dining||[]).reduce((n,r)=>n+(r.photos||[]).length,0);
   story.dataSupplement.selectedPhotoCount=story.dataSupplement.landmarkPhotoCount+story.dataSupplement.diningPhotoCount;
   story.dataSupplement.materialUpdate='20261013-batch01';
   story.dataSupplement.missing=points.flatMap(p=>[
    ...(!story.photoCandidates[p.name]?.length?[p.name+'：仍缺可确认地点的实景照片']:[]),
    ...(facts[p.name]?.unverified||[]).map(note=>p.name+'：'+note)
   ]);
  }
  if(id.includes('-b20-')){
   story.practical=story.practical.map(([term,value])=>term==='照片出处'?[term,'实景按地点整理，照片下方保留作者与来源；拍摄季节不代表出行当天。']:term==='时间安排'?[term,'行程时刻为可调整的建议，按开放情况、停留与休息安排。']:/门票|预约/.test(term)?[term,'部分景点已有常规说明，详见各站信息与核对来源；临时调整和当日余量仍需出发前确认。']:term==='餐饮'&&story.dining?.length?[term,'已有沿线具体分店参考；人均注明出处，菜单版本和当日营业请另行确认。']:[term,value]);
   story.materialUpdate={batch:'20261013-batch01',photoCount:Object.values(story.photoCandidates).reduce((n,p)=>n+p.length,0),factPoints:Object.keys(facts).length};
  }
 }
 if(BATCH01_KUNMING_GEO){
  const route=routes.find(r=>r.id==='kunming-b20-city-day'),story=journeys[route?.id];
  if(route&&story){
   const geo=BATCH01_KUNMING_GEO,reference=route.storyArtwork.reference;
   reference.archive=geo.archive;reference.queriedAt=geo.queriedAt;
   reference.points=reference.points.map(p=>p.name==='近日楼'?{...p,...geo.point,status:'named-gate-geocoding-reference'}:p);
   const marker=route.storyArtwork.markers.find(p=>p.name==='近日楼');if(marker)marker.coordinateStatus='visual-anchor-on-generated-artwork';
   for(const segment of geo.segments){
    const leg=story.legs.find(l=>l.from===segment.from&&l.to===segment.to);if(!leg)continue;
    const index=story.legs.indexOf(leg),options={};
    const calibrationPath=geo.segmentPaths?.[index]||Object.values(story.legs[index]?.options||{})[0]?.path;
    // All alternatives share the calibrated illustrative path; their actual nodes remain in the reference archive.
    for(const [mode,v] of Object.entries(segment.options||{})){
     if(v.status!=='complete'||!Number.isFinite(v.time)||!Number.isFinite(v.distance))continue;
     const path=typeof calibrationPath==='string'?calibrationPath:calibrationPath?.path||route.map.segmentPaths?.[index]||'';
     options[mode]={label:{walk:'步行',cycle:'骑行',transit:'公交 / 地铁'}[mode],duration:'约 '+Math.max(1,Math.ceil(v.time/60))+' 分钟',distance:distance(v.distance),seconds:v.time,meters:v.distance,path,source:'高德站间路线查询',queriedAt:'2026-10-13',detail:mode==='cycle'?'另留取还车时间，步行街按现场规则推行':'命名南门参考点间机算，不含游览、门禁与排队'};
    }
    leg.options=options;leg.recommendedMode=options.walk?'walk':Object.keys(options)[0]||null;leg.recommendation='短距离步行衔接，另留街头观察与休息时间';delete leg.status;
    const a=reference.points.find(p=>p.name===leg.from),b=reference.points.find(p=>p.name===leg.to),d=straight(a.routeCoordinate||a.coordinate,b.routeCoordinate||b.coordinate);leg.straightLineDistance=d===null?'':distance(d);
   }
   const total=story.legs.reduce((n,l)=>n+(l.options[l.recommendedMode]?.meters||0),0);story.distance='站间'+distance(total);
   story.routeNote='地理参考与站间交通已补到近日楼命名南门；插画仍为道路示意，公众通行和现场入口请出发前确认。';
   story.stopAccess[1]={heading:'位置与参观',value:'高德已返回近日楼南门入口参考；本路线观看楼体外观，入内、登楼与当日通行仍需核对。'};
   route.story[2].body='沿敬德巷观察街巷和沿途店面，把这一段作为街头摄影的停留。照片中已补可读路牌；具体商铺营业与消费以当日为准。';
   route.story[4].body='走到铁皮巷继续看街道与店面，在公共巷口结束这一段扫街。蓝花楹实景是季节参考，不保证出行当天处于花期。';
   if(story.collectionContext?.routeWarnings)story.collectionContext.routeWarnings=story.collectionContext.routeWarnings.filter(s=>!/(近日楼.*真实.*待核|近日楼.*定位.*待核)/.test(s));
  }
 }
}
