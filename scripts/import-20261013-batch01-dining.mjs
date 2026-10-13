import {writeFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {PROJECT,MATERIALS,load,routeId,canonical,sourceById,copyPhoto,localSource,writeModule,saveJson} from './batch01-material-utils.mjs';

const raw=load('餐饮候选_父级合并.json');
const newRows=raw.slice(0,20),legacyRows=raw.slice(20);
const byRoute={},legacyUpdates={},summary=[],pending=[];
const areas={nanjing:'中山陵周边',chengdu:'太古里周边',xian:'书院门周边',beijing:'什刹海周边',chongqing:'人民大礼堂周边',luoyang:'老城沿线',wuhan:'江汉路至巴公房子',guangzhou:'科学城 · 云汇天地',changsha:'东茅街',shanghai:'陆家嘴 · 正大广场',suzhou:'平江路周边',hangzhou:'孤山路',jinan:'趵突泉周边',xiamen:'八市周边',shenzhen:'深圳湾万象城',fuzhou:'西湖周边',guiyang:'甲秀楼周边'};
const cuisines={nanjing:'快餐补给',chengdu:'川菜',xian:'陕菜',beijing:'北京烤肉',chongqing:'江湖菜',luoyang:'水席',wuhan:'湖北菜',guangzhou:'京菜',changsha:'茶馆',shanghai:'闽南菜',suzhou:'蟹黄面',hangzhou:'杭帮菜',jinan:'包子',xiamen:'糕点小吃',shenzhen:'日式简餐',fuzhou:'闽菜',guiyang:'贵州菜'};
const formatTitle=(p,i)=>p.visual_content||p.visual_review_note||p.manual_reading||`门店实景 ${i+1}`;
const missingLabels=fields=>[...new Set((fields||[]).map(k=>/per_capita/.test(k)?'可靠的人均出处':/menu/.test(k)?'菜单版本与现价':/door_number|floor|address/.test(k)?'门牌与楼层':/hours|operating/.test(k)?'营业情况':/photo|images|gallery/.test(k)?'照片来源与日期':/route|pedestrian|adjacen/.test(k)?'实际步行衔接':/branch_name/.test(k)?'准确分店身份':/portion|taste/.test(k)?'份量与口味体验':/promotion/.test(k)?'作者推荐性质':'资料细节'))];
function picture(p,slug,i,namespace,kind){
 const file=p.adopted_path||p.path||p.file;
 if(!file)return null;
 const source=canonical(p.source_url||p.source_page||sourceById(p.source_id)?.url||'');
 if(!source)return null;
 if(p.rejection_reason||/unadopted|wrong_brand/i.test(p.selection_status||''))return null;
 const stored=copyPhoto(file,{folder:'batch01-dining-reference-photos',slug,namespace,expectedHash:p.sha256});if(!stored)return null;
 const isMenu=kind==='menu'||p.menu_accepted===true||/undated_menu|price[ _-]?board|menu_price_board/.test(p.evidence_kind||p.kind||p.image_id||'');
 const rawTitle=formatTitle(p,i);
 const isTechnicalCaption=/gallery_|cover_|review_|作者称到访|平台.*图集|同一.*门店点评/.test(rawTitle);
 const visualKinds={suzhou:{ACSM_01:['dish','餐品组合'],ACSM_02:['dish','蟹黄面餐品'],ACSM_03:['dish','甜品与饮品']},hangzhou:{cover_07:['environment','楼外楼门头'],cover_01:['dish','门店菜品'],cover_04:['environment','堂食环境']},jinan:{review_01:['environment','草包包子铺夜间门头'],review_02:['dish','包子实景'],review_03:['dish','包子餐品']},xiamen:{cover_07:['environment','阿吉仔大元路37号门牌'],cover_04:['environment','阿吉仔门头'],cover_02:['dish','门店糕点']},shenzhen:{gallery_02:['environment','米仓食堂店内'],gallery_01:['dish','餐品近景'],gallery_03:['dish','餐品组合']},fuzhou:{gallery_03:['environment','堂食环境'],gallery_04:['dish','门店餐品'],gallery_06:['dish','门店菜品近景']},guiyang:{gallery_04:['environment','亮欢寨夜间门头'],gallery_05:['dish','就餐与餐品实景']}};
 const visual=visualKinds[slug]?.[p.image_id];
 const isEnvironment=visual?visual[0]==='environment':/门头|外观|店铺|用餐场景|就餐|餐厅|店内|包间|环境|门牌|回廊|大厅|室内/.test(rawTitle);
 const friendlyTitle=visual?.[1]||(isTechnicalCaption?(isEnvironment?'门店环境参考':'门店餐品参考'):rawTitle.replace(/；.*$/,'').replace(/不另推.*$/,'').slice(0,80));
 return {...stored,title:isMenu?'门店菜单／价牌参考（版本日期待确认）':friendlyTitle,
  kind:isMenu?'menu':(isEnvironment?'environment':'dish'),
  source:/ctrip|trip\.com/.test(source)?'携程门店资料':/openrice/.test(source)?'OpenRice对应门店':/xiaohongshu/.test(source)?'小红书图文':new URL(source).hostname,
  url:source,credit:p.source_author||p.author||'对应门店公开图库',recordNote:isMenu?'来源中的菜单／价牌参考；拍摄与生效日期未确认，以当日店内为准。':'对应分店的平台或作者图片；拍摄日期未确认。',
  publishedAt:p.published_at_visible||p.publication_date||p.published_at||null,captureDate:p.capture_date||p.photo_capture_date||null,
  identityEvidence:p.branch_identity_basis||p.branch_basis||p.branch_identity||p.visual_review_note||'',usage:'保留原图与出处；使用状态随原记录保留'};
}
for(const r of newRows){
 const id=routeId(r.route_id),slug=id.split('-')[0],name=r.full_branch_name||r.name||r.brand_name;
 if(['qingdao','tianjin','kunming'].includes(slug)){pending.push({city:r.city,name,reason:'唯一分店／门牌或可信人均尚未取得',missing:r.missing_fields});continue;}
 const address=r.address?.verified_text||r.address?.full_address_source_text||'';
 if(!name||!address){pending.push({city:r.city,name,reason:'缺少可采用的具体门店地址',missing:r.missing_fields});continue;}
 const namespace=r.child_namespace||r.source_namespace;
 const menuImages=Array.isArray(r.menu?.images)?r.menu.images:r.menu?.path?[r.menu]:[];
 const candidates=Array.isArray(r.images)?r.images:(r.photos||[]);
 const acceptedA=new Set(Array.isArray(r.display_assets)?r.display_assets.map(p=>typeof p==='string'?p:p.file||p.path):[]);
 const acceptedPhotos=candidates.filter(p=>!p.rejection_reason&&(!acceptedA.size||acceptedA.has(p.file||p.path)));
 const imageRows=[...menuImages.map(p=>({p,kind:'menu'})),...acceptedPhotos.map(p=>({p,kind:p.menu_accepted?'menu':undefined}))];
 const photos=[...new Map(imageRows.map(({p,kind},i)=>picture(p,slug,i,namespace,kind)).filter(Boolean).map(p=>[p.originalSha256,p])).values()].sort((a,b)=>(a.kind==='menu'?0:1)-(b.kind==='menu'?0:1));
 const price=r.per_capita||{},numeric=Number.isFinite(price.amount)&&price.currency==='CNY'&&price.computed_from_menu_package_bill!==true&&price.derived_from_menu_or_bill!==true;
 const priceUrl=canonical(price.evidence?.source_url||sourceById(price.source_id)?.url||'');
 const sourceUrl=priceUrl||canonical(r.source_refs?.find(s=>s.url)?.url||r.recommendations?.source_urls?.[0]||sourceById(r.address?.source_id)?.url||r.address?.evidence?.source_url||'');
 const priceSource=price.platform||(/ctrip|trip\.com/.test(priceUrl)?'携程':/dianping/.test(priceUrl)?'大众点评':'平台门店页');
 let recommendations=Array.isArray(r.recommendations)?r.recommendations.map(d=>d.dish_source_name).filter(Boolean):(r.recommendations?.dishes||[]);
 if(slug==='guangzhou'){
  const note=load('Chrome补采/广州菜单/补采00/note_verified.json');
  if(note.note_id==='69e44aef000000001a02978e'&&/云汇天地/.test(note.body_visible||'')){
   const selected=[[2,'果木烤鸭 · 图文参考'],[4,'烤鸭拼盘与配料 · 图文参考'],[6,'白菜豆腐粉丝汤 · 图文参考'],[7,'手撕牛心包菜 · 图文参考']];
   for(const [index,title] of selected){
    const file=`Chrome补采/广州菜单/补采00/网页配图/配图_${String(index).padStart(2,'0')}.webp`;
    const stored=copyPhoto(file,{folder:'batch01-dining-reference-photos',slug});
    if(stored)photos.push({...stored,title,kind:'dish',source:'小红书图文',url:'https://www.xiaohongshu.com/explore/69e44aef000000001a02978e',credit:'糯米糍🍓',publishedAt:note.published_at_visible||null,captureDate:null,
     recordNote:'作者正文明确云汇天地大河上下，同组实景参考；拍摄日期未取得。',identityEvidence:'正文指定云汇天地分店，封面品牌与独立餐品图相互对应；不是菜单或人均证据。',usage:'原图与来源保留'});
   }
   recommendations=['果木酥不腻烤鸭','白菜豆腐粉丝汤','手撕牛心包菜'];
  }
 }
 const missingMenu=!photos.some(p=>p.kind==='menu');
 const caveats=[];
 if(missingMenu)caveats.push('菜单待补');else caveats.push('菜单为来源参考，现价待确认');
 if(!numeric)caveats.push('人均待补');
 if(slug==='xian')caveats.push('平台存在运营状态提示，出发前确认营业');
 if(slug==='wuhan')caveats.push('平台地址与旧点评有差异，到店前确认门牌');
 const item={id:'b01-'+slug,area:areas[slug]||'',cuisine:cuisines[slug]||'',name,address,
  dishes:recommendations.length?'来源推荐：'+recommendations.slice(0,3).join('、')+'。':'餐品与口味资料正在补充。',
  displayNote:caveats.join('；')+'。',perPerson:numeric?{value:price.amount,currency:'CNY',unit:'人',source:priceSource,url:priceUrl,status:'platform-average',checkedAt:'2026-10-13'}:{value:null,currency:'CNY',source:'',url:'',status:'unknown'},
  price:numeric?`参考人均 ¥${price.amount}（${priceSource}）`:'人均待补',source:numeric?priceSource:(sourceUrl?new URL(sourceUrl).hostname:''),url:sourceUrl,photos,
  note:'具体分店资料候选，未声称本站已实吃。'+(r.authenticity_and_promotion?.scope_note||'')+'；待补：'+missingLabels(r.missing_fields).join('、'),
  materialStatus:'partial',sourceFields:{priceRecord:price,addressRecord:r.address,menuCurrentVerified:false},
  missingMaterials:r.missing_fields||[],sourceLinks:[...new Map([sourceUrl,...photos.map(p=>p.url)].filter(Boolean).map(url=>[url,url])).values()]};
 // Raw private retrieval paths and image URLs stay in local material; public evidence keeps only safe fields.
 item.sourceFields={priceRecord:{amount:price.amount??null,currency:price.currency||null,unit:price.unit||null,type:price.type||price.source_type||null,quote:price.source_quote||price.evidence?.value_quote||'',url:priceUrl},addressRecord:{value:address,confirmedCurrentEntrance:false},menuCurrentVerified:false};
 byRoute[id]=[item];summary.push({city:r.city,routeId:id,name,photos:photos.length,menus:photos.filter(p=>p.kind==='menu').length,perPerson:numeric?price.amount:null});
}
for(const r of legacyRows){
 const id=routeId(r.route_id),slug=id.split('-')[0];
 const images=(r.new_evidence_images||[]).filter(p=>p.status==='adopted_historical_or_undated'&&p.adopted_path);
 const photos=images.map((p,i)=>picture(p,slug+'-legacy',i,r.child_namespace||'餐饮C_旧13店',/menu|priceboard/.test(p.evidence_kind||'')?'menu':undefined)).filter(Boolean);
 const extra=r.supplement_facts||[],sources=[...new Set(extra.flatMap(f=>f.source_ids||[]))].map(sourceById).filter(Boolean);
 const perPerson=extra.find(f=>f.kind==='platform_per_person'&&Number.isFinite(f.amount_cny)&&f.currency==='CNY');
 const update={name:r.name,id:r.id,photos,sourceLinks:sources,materialNotes:extra.map(f=>f.text).filter(Boolean),missingMaterials:r.missing_fields||[]};
 if(perPerson){const s=(perPerson.source_ids||[]).map(sourceById).find(Boolean);if(s?.url)update.perPerson={value:perPerson.amount_cny,currency:'CNY',unit:'人',status:'platform-average',source:'携程',url:s.url,checkedAt:'2026-10-13'};}
 (legacyUpdates[id]||= []).push(update);
}
writeModule('assets/routes/20261013-batch01-dining.js',{BATCH01_DINING_BY_ROUTE:byRoute,BATCH01_LEGACY_DINING_UPDATES:legacyUpdates});
saveJson('assets/routes/20261013-batch01-dining-adoption.json',{updatedAt:new Date().toISOString(),restaurants:summary,pending,legacy:legacyUpdates});
writeFileSync(resolve(PROJECT,'handoffs/2026-10-13-batch01-dining-adoption.md'),['# 批次01餐饮采用记录','',`新路线接入${summary.length}条具体分店候选；其余${pending.length}条保留线索。完整现行菜单未齐，已有平台人均和来源图片可先展示。`,'','| 城市 | 分店 | 照片 | 菜单参考 | 人均来源金额 |','| --- | --- | ---: | ---: | --- |',...summary.map(s=>`| ${s.city} | ${s.name} | ${s.photos} | ${s.menus} | ${s.perPerson===null?'待补':s.perPerson+'元'} |`),'','## 未作为正式分店推荐采用',...pending.map(p=>`- ${p.city}：${p.name}；${p.reason}`),'','旧13店以增量更新，原图库和价格记录保留。鹤鸣20/25冲突、自力拍摄年份未知仍保留。品牌烤匠菜单设计稿及麦当劳模块错品牌图未采用。',''].join('\n'));
console.log(JSON.stringify({newBranches:summary.length,pending:pending.length,newPhotos:summary.reduce((n,s)=>n+s.photos,0),newMenus:summary.reduce((n,s)=>n+s.menus,0),legacyNewPhotos:Object.values(legacyUpdates).flat().reduce((n,r)=>n+r.photos.length,0),legacyPriceUpdates:Object.values(legacyUpdates).flat().filter(r=>r.perPerson).length}));
