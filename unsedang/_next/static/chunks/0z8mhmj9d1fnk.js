(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,21340,e=>{"use strict";var a=e.i(43476),t=e.i(71645),r=e.i(18566),i=e.i(22016),s=e.i(84834),n=e.i(13642),o=e.i(93300),l=e.i(85149);let c={1:{hanja:"命",meaning:"운명",objPos:"50% 18%"},2:{hanja:"相",meaning:"모양",objPos:"50% 32%"},3:{hanja:"因",meaning:"까닭",objPos:"50% 50%"},4:{hanja:"別",meaning:"다름",objPos:"50% 60%"},5:{hanja:"時",meaning:"때",objPos:"50% 75%"},6:{hanja:"言",meaning:"말씀",objPos:"50% 50%"}},d={dalhanari:"月壺",cheongja:"青磁",baekja:"白磁",bunchung:"粉青",onggi:"甕器",horibyeong:"葫蘆"},p="https://audio.readmelab.co.kr/unsedang/j1";function x({number:e,hanja:t}){return(0,a.jsxs)("div",{className:"falling-seal",children:[(0,a.jsxs)("svg",{viewBox:"0 0 80 80",className:"fs-svg",children:[(0,a.jsx)("defs",{children:(0,a.jsxs)("linearGradient",{id:`fs-${e}`,x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[(0,a.jsx)("stop",{offset:"0%",stopColor:"#C84A66"}),(0,a.jsx)("stop",{offset:"100%",stopColor:"#8B2440"})]})}),(0,a.jsx)("rect",{x:"6",y:"6",width:"68",height:"68",fill:`url(#fs-${e})`,rx:"2"}),(0,a.jsx)("rect",{x:"9",y:"9",width:"62",height:"62",fill:"none",stroke:"#F5F0E8",strokeWidth:"0.6",opacity:"0.7"}),(0,a.jsx)("text",{x:"40",y:"52",textAnchor:"middle",fontFamily:"Noto Serif TC",fontSize:"40",fontWeight:"700",fill:"#F5F0E8",children:t})]}),(0,a.jsxs)("div",{className:"fs-num",children:["第 ",{1:"一",2:"二",3:"三",4:"四",5:"五",6:"六"}[e]||String(e)," 章"]})]})}function h({char:e,delay:t}){return(0,a.jsx)("span",{className:"pillar-char",style:{animationDelay:`${t}ms`},children:e})}function g({pct:e}){let t=[{key:"wood",han:"木",sub:"목",value:e.wood??0,color:"#5C8A7A",cx:150,cy:30,blink:4},{key:"fire",han:"火",sub:"화",value:e.fire??0,color:"#C84A66",cx:264,cy:117,blink:2.4},{key:"earth",han:"土",sub:"토",value:e.earth??0,color:"#B89060",cx:220,cy:252,blink:5.5},{key:"metal",han:"金",sub:"금",value:e.metal??0,color:"#C9A864",cx:80,cy:252,blink:3.2},{key:"water",han:"水",sub:"수",value:e.water??0,color:"#3F5A8A",cx:36,cy:117,blink:5}];return(0,a.jsxs)("div",{className:"oheng-stars",children:[(0,a.jsx)("div",{className:"oheng-stars-title",children:"五行 · 다섯 기운"}),(0,a.jsxs)("svg",{viewBox:"0 -30 300 330",className:"oheng-svg",children:[(0,a.jsx)("g",{className:"oheng-lines",children:t.map((e,r)=>{let i=t[(r+1)%t.length];return(0,a.jsx)("line",{x1:e.cx,y1:e.cy,x2:i.cx,y2:i.cy,stroke:"#C9A864",strokeWidth:"0.6",opacity:"0.25"},`l-${r}`)})}),t.map(e=>{let t=8+Math.min(22,e.value/5);return(0,a.jsxs)("g",{className:"oheng-node",style:{"--blink":`${e.blink}s`},children:[(0,a.jsx)("circle",{cx:e.cx,cy:e.cy,r:t+8,fill:e.color,opacity:"0.12",className:"oheng-glow"}),(0,a.jsx)("circle",{cx:e.cx,cy:e.cy,r:t,fill:e.color,className:"oheng-dot"}),(0,a.jsx)("circle",{cx:e.cx,cy:e.cy,r:.5*t,fill:"#F5F0E8",opacity:"0.6"}),(0,a.jsx)("text",{x:e.cx,y:e.cy-t-14,textAnchor:"middle",fontFamily:"Noto Serif TC",fontSize:"18",fontWeight:"500",fill:"#F5F0E8",children:e.han}),(0,a.jsxs)("text",{x:e.cx,y:e.cy+t+22,textAnchor:"middle",fontFamily:"Cormorant Garamond",fontSize:"13",fill:"#C9A864",children:[e.value,"%"]})]},e.key)})]})]})}function m({bowl:e,bowlHanja:r,bowlKo:i,userName:s,score:n,mood:o,verse:l}){let[c,d]=(0,t.useState)(!1),[x,h]=(0,t.useState)([]),g=(0,t.useRef)(null);(0,t.useEffect)(()=>{let e=setTimeout(()=>f(),1200);return()=>clearTimeout(e)},[]);let f=()=>{c||(h(Array.from({length:window.innerWidth<640?30:60},(e,a)=>({id:a,x:50+(Math.random()-.5)*20,y:50+(Math.random()-.5)*20,a:360*Math.random()}))),d(!0),setTimeout(()=>h([]),4e3))},b=Math.min(5,Math.max(1,Math.round(n/20))),v="●".repeat(b)+"○".repeat(5-b);return(0,a.jsxs)("div",{className:"hero-bowl-wrap",children:[(0,a.jsx)("div",{className:"mother-of-pearl","aria-hidden":!0}),c&&(0,a.jsx)("div",{className:"unseal-pulse","aria-hidden":!0}),x.length>0&&(0,a.jsx)("div",{className:"particles","aria-hidden":!0,children:x.map(e=>(0,a.jsx)("span",{className:"particle",style:{left:`${e.x}%`,top:`${e.y}%`,"--a":`${e.a}deg`,"--d":`${.6*Math.random()}s`}},e.id))}),(0,a.jsxs)("div",{className:`bowl-card ${c?"unsealed":"sealed"}`,ref:g,children:[(0,a.jsxs)("video",{className:"bowl-video",poster:`${p}/${e}.webp`,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,preload:"auto",disablePictureInPicture:!0,children:[(0,a.jsx)("source",{src:`${p}/${e}.mp4`,type:"video/mp4"}),(0,a.jsx)("source",{src:`${p}/${e}.webm`,type:"video/webm"})]}),(0,a.jsx)("div",{className:"bowl-grad-top"}),(0,a.jsx)("div",{className:"bowl-grad-bot"}),(0,a.jsxs)("div",{className:"bowl-top",children:[(0,a.jsx)("div",{className:"bowl-brand",children:"運勢堂"}),(0,a.jsx)("div",{className:"bowl-line",children:"一一一一一"}),(0,a.jsxs)("div",{className:"bowl-user",children:[s,"님의 그릇"]})]}),(0,a.jsxs)("div",{className:"bowl-bot",children:[(0,a.jsxs)("div",{className:"bowl-name",children:[(0,a.jsx)("span",{className:"bn-hanja",children:r}),(0,a.jsx)("span",{className:"bn-dot",children:"·"}),(0,a.jsx)("span",{className:"bn-ko",children:i})]}),(0,a.jsxs)("div",{className:"bowl-score",children:[(0,a.jsx)("span",{className:"bs-mood",children:o}),(0,a.jsx)("span",{className:"bs-gauge",children:v}),(0,a.jsxs)("span",{className:"bs-num",children:[n,"점"]})]}),l&&(0,a.jsxs)("div",{className:"bowl-verse",children:["“",l,"”"]}),(0,a.jsx)("div",{className:"bowl-wm",children:"運勢堂 · 운세당"})]}),!c&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"seal-band band-l"}),(0,a.jsx)("div",{className:"seal-band band-r"}),(0,a.jsxs)("button",{className:"seal-center",onClick:f,"aria-label":"봉인 해제",children:[(0,a.jsxs)("svg",{viewBox:"0 0 100 100",children:[(0,a.jsx)("defs",{children:(0,a.jsxs)("linearGradient",{id:"sealMain",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[(0,a.jsx)("stop",{offset:"0%",stopColor:"#C84A66"}),(0,a.jsx)("stop",{offset:"100%",stopColor:"#7A2235"})]})}),(0,a.jsx)("rect",{x:"10",y:"10",width:"80",height:"80",fill:"url(#sealMain)",rx:"4"}),(0,a.jsx)("rect",{x:"14",y:"14",width:"72",height:"72",fill:"none",stroke:"#F5F0E8",strokeWidth:"0.8",opacity:"0.7"}),(0,a.jsx)("text",{x:"50",y:"65",textAnchor:"middle",fontFamily:"Noto Serif TC",fontSize:"48",fontWeight:"700",fill:"#F5F0E8",children:"封"})]}),(0,a.jsx)("div",{className:"seal-tap",children:"탭하여 봉인 해제"})]})]}),c&&(0,a.jsx)("div",{className:"seal-corner","aria-hidden":!0,children:(0,a.jsxs)("svg",{viewBox:"0 0 60 60",children:[(0,a.jsx)("rect",{x:"6",y:"6",width:"48",height:"48",fill:"#A8324A",rx:"2"}),(0,a.jsx)("text",{x:"30",y:"42",textAnchor:"middle",fontFamily:"Noto Serif TC",fontSize:"26",fontWeight:"700",fill:"#F5F0E8",children:"正"})]})})]})]})}function f({chapter:e,bowl:r,idx:i}){let s=(0,t.useRef)(null),[n,o]=(0,t.useState)(!1),l=c[e.number]||{hanja:"?",meaning:"",objPos:"50% 50%"};(0,t.useEffect)(()=>{if(!s.current)return;let e=new IntersectionObserver(([a])=>{a.isIntersecting&&(o(!0),e.disconnect())},{threshold:.2});return e.observe(s.current),()=>e.disconnect()},[]);let d=e.aiSlots?Object.values(e.aiSlots):[];return(0,a.jsxs)("section",{ref:s,id:`chapter-${e.number}`,className:`chapter ${n?"entered":""}`,children:[(0,a.jsx)("div",{className:"ch-bg-hanja","aria-hidden":!0,children:l.hanja}),(0,a.jsx)("div",{className:"ch-seal-zone",children:(0,a.jsx)(x,{number:e.number,hanja:l.hanja})}),(0,a.jsxs)("div",{className:"ch-bowl-clip","aria-hidden":!0,children:[(0,a.jsx)("img",{src:`${p}/${r}.webp`,alt:"",style:{objectPosition:l.objPos},loading:"lazy"}),(0,a.jsx)("div",{className:"ch-bowl-fade"})]}),(0,a.jsxs)("div",{className:"ch-content",children:[(0,a.jsxs)("div",{className:"ch-eyebrow",children:[(0,a.jsx)("span",{className:"line"}),(0,a.jsx)("span",{className:"text",children:l.meaning}),(0,a.jsx)("span",{className:"line"})]}),(0,a.jsx)("h2",{className:"ch-title",children:e.title}),e.intro&&(0,a.jsxs)("div",{className:"ch-intro",children:[(0,a.jsx)("div",{className:"qm",children:"『"}),(0,a.jsx)("p",{children:e.intro}),(0,a.jsx)("div",{className:"qm right",children:"』"})]}),e.dataBoxes&&e.dataBoxes.length>0&&(0,a.jsx)("div",{className:"ch-databoxes",children:e.dataBoxes.map((e,t)=>(0,a.jsxs)("div",{className:"ch-databox",children:[(0,a.jsx)("div",{className:"ch-databox-title",children:e.title}),(0,a.jsx)("div",{className:"ch-databox-rows",children:e.rows.map((e,t)=>(0,a.jsxs)("div",{className:"ch-databox-row",children:[(0,a.jsx)("span",{className:"ch-databox-label",children:e.label}),(0,a.jsx)("span",{className:"ch-databox-value",children:e.value})]},"r-"+t))})]},"db-"+t))}),(0,a.jsxs)("div",{className:"ch-body",children:[e.blockText&&(0,a.jsx)("div",{className:"ch-block",children:e.blockText.split("\n").map((e,t)=>(0,a.jsx)("p",{children:e},`b-${t}`))}),d.map((e,t)=>(0,a.jsxs)("div",{className:"ch-ai",children:[(0,a.jsx)("div",{className:"ch-ai-mark",children:(0,a.jsxs)("svg",{viewBox:"0 0 24 24",width:"14",height:"14",children:[(0,a.jsx)("circle",{cx:"12",cy:"12",r:"3",fill:"var(--gold)"}),(0,a.jsx)("circle",{cx:"12",cy:"12",r:"8",fill:"none",stroke:"var(--gold)",strokeWidth:"0.5",opacity:"0.4"}),(0,a.jsx)("circle",{cx:"12",cy:"12",r:"11",fill:"none",stroke:"var(--gold)",strokeWidth:"0.4",opacity:"0.2"})]})}),(0,a.jsx)("p",{children:e})]},`s-${t}`))]}),e.outro&&(0,a.jsx)("div",{className:"ch-outro",children:(0,a.jsx)("p",{children:e.outro})})]})]})}function b({orderId:e,balance:r,totalGranted:i,history:s,onBalanceUpdate:n}){let[o,c]=(0,t.useState)(""),[d,p]=(0,t.useState)(!1),[x,h]=(0,t.useState)(null),[g,m]=(0,t.useState)([]),[f,v]=(0,t.useState)(""),[u,y]=(0,t.useState)(null),j=(0,t.useMemo)(()=>[...s,...g],[s,g]);(0,t.useEffect)(()=>{if(!u)return;let e=j.find(e=>e.at===u);if(!e)return;let a=0,t=setInterval(()=>{if(a>=e.answer.length){clearInterval(t),y(null);return}a+=2,v(e.answer.slice(0,a))},22);return()=>clearInterval(t)},[u,j]);let w=async()=>{let a=o.trim();if(a.length<2||a.length>300)return void h("질문은 2~300자로 적어주세요.");if(r<=0)return void h("질문권이 부족합니다. 아래에서 보충하실 수 있습니다.");p(!0),h(null);try{let t=await fetch(`${l.API_BASE_URL}/api/ask`,{method:"POST",headers:{"Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({orderId:e,question:a})}),r=await t.json();if(!t.ok)return void h(r.message||"점성가의 별이 잠시 흐려졌습니다. 잠시 후 다시 시도해주세요.");let i=new Date().toISOString();m(e=>[...e,{question:a,answer:r.answer,at:i}]),c(""),v(""),y(i),n(r.balance)}catch{h("네트워크가 불안정합니다. 잠시 후 다시 시도해주세요.")}finally{p(!1)}};return(0,a.jsxs)("div",{className:"chat",children:[(0,a.jsxs)("div",{className:"chat-balance",children:[(0,a.jsx)("span",{className:"cb-key",children:"質問券"}),(0,a.jsxs)("span",{className:"cb-val",children:[(0,a.jsx)("strong",{children:r}),"회 남음",i>0&&(0,a.jsxs)("span",{className:"cb-total",children:[" / 부여 ",i,"회"]})]})]}),j.length>0&&(0,a.jsx)("div",{className:"chat-history",children:j.map((e,t)=>{let r=u===e.at,i=r?f:e.answer;return(0,a.jsxs)("div",{className:"chat-entry",children:[(0,a.jsxs)("div",{className:"chat-q",children:[(0,a.jsx)("div",{className:"chat-q-key",children:"問"}),(0,a.jsx)("p",{children:e.question})]}),(0,a.jsxs)("div",{className:"chat-a",children:[(0,a.jsx)("div",{className:"chat-a-quote",children:"『"}),(0,a.jsxs)("p",{children:[i,r&&(0,a.jsx)("span",{className:"chat-cursor",children:"|"})]}),(0,a.jsx)("div",{className:"chat-a-quote right",children:"』"}),!r&&(0,a.jsx)("div",{className:"chat-a-seal",children:(0,a.jsxs)("svg",{viewBox:"0 0 40 40",children:[(0,a.jsx)("rect",{x:"4",y:"4",width:"32",height:"32",fill:"#A8324A",rx:"2"}),(0,a.jsx)("text",{x:"20",y:"28",textAnchor:"middle",fontFamily:"Noto Serif TC",fontSize:"18",fontWeight:"700",fill:"#F5F0E8",children:"答"})]})})]})]},e.at+t)})}),(0,a.jsxs)("div",{className:"chat-input-wrap",children:[(0,a.jsx)("textarea",{className:"chat-input",value:o,onChange:e=>c(e.target.value),placeholder:r>0?"점성가에게 묻고 싶은 것을 적으세요. (2~300자)":"질문권을 보충하신 후 질문하실 수 있습니다.",maxLength:300,rows:3,disabled:d||r<=0}),(0,a.jsxs)("div",{className:"chat-input-meta",children:[(0,a.jsxs)("span",{children:[o.length," / 300"]}),(0,a.jsx)("button",{className:"chat-send",onClick:w,disabled:d||r<=0||o.trim().length<2,children:d?"답을 받는 중…":"질문하기 (1회 차감)"})]}),x&&(0,a.jsx)("div",{className:"chat-error",children:x})]})]})}function v({name:e,price:t,perUnit:r,recommended:i,onClick:s,loading:n}){return(0,a.jsxs)("button",{className:`pack ${i?"rec":""}`,onClick:s,disabled:n,children:[i&&(0,a.jsx)("div",{className:"pack-rib",children:"推薦"}),(0,a.jsx)("div",{className:"pack-stamp",children:(0,a.jsxs)("svg",{viewBox:"0 0 60 60",children:[(0,a.jsx)("rect",{x:"6",y:"6",width:"48",height:"48",fill:"#A8324A",rx:"2"}),(0,a.jsx)("text",{x:"30",y:"42",textAnchor:"middle",fontFamily:"Noto Serif TC",fontSize:"28",fontWeight:"700",fill:"#F5F0E8",children:"問"})]})}),(0,a.jsx)("div",{className:"pack-name",children:e}),(0,a.jsxs)("div",{className:"pack-price",children:[(0,a.jsxs)("span",{className:"pp-num",children:["₩",t.toLocaleString()]}),(0,a.jsxs)("span",{className:"pp-unit",children:["(1회 약 ₩",r.toLocaleString(),")"]})]}),n&&(0,a.jsx)("div",{className:"pack-loading",children:"결제 준비 중…"})]})}function u(){let[e,r]=(0,t.useState)(0);return(0,t.useEffect)(()=>{let e=()=>{let e=document.documentElement;r(Math.max(0,Math.min(1,e.scrollTop/(e.scrollHeight-e.clientHeight))))};return window.addEventListener("scroll",e,{passive:!0}),e(),()=>window.removeEventListener("scroll",e)},[]),(0,a.jsxs)("div",{className:"scroll-thread","aria-hidden":!0,children:[(0,a.jsx)("div",{className:"st-track"}),(0,a.jsx)("div",{className:"st-fill",style:{height:`${100*e}%`}}),(0,a.jsx)("div",{className:"st-dot",style:{top:`${100*e}%`}})]})}function y(){let e=(0,r.useSearchParams)().get("o")||"",[c,p]=(0,t.useState)(null),[x,y]=(0,t.useState)("waiting"),[k,N]=(0,t.useState)(0),[z,S]=(0,t.useState)(null);(0,t.useEffect)(()=>{e&&/^US-(J[1-8]|L1|C1|D1|F1|T1|S1)-(N|Y)(L|T)-\d{6}-[A-HJ-KM-NP-Z2-9]{4}$/.test(e)||y("invalid")},[e]),(0,t.useEffect)(()=>{if("waiting"!==x||!e)return;let a=!1,t=async r=>{if(!a){try{let a=await fetch(`${l.API_BASE_URL}/api/result/${e}`),t=await a.json();if(a.ok&&t.ok&&t.result){if("completed"===t.result.status){p(t.result),y("ready");return}if("failed"===t.result.status)return void y("failed")}}catch{}if(N(r),r>=30)return void y("failed");setTimeout(()=>t(r+1),5e3)}};return t(1),()=>{a=!0}},[e,x]);let A=async a=>{if(!c)return;let t=c.sajuSnapshot?.birth?.name||"";if(!t)return void alert("주문 정보를 확인할 수 없습니다.");S(a);try{let r=await fetch(`${l.API_BASE_URL}/api/credit/purchase-init`,{method:"POST",headers:{"Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({parentOrderId:e,productCode:a,brand:l.BRAND_ID,customer:{name:t,phone:"00000000000"}})}),i=await r.json();if(!r.ok){alert(i.message||"추가 구매 주문 생성에 실패했습니다."),S(null);return}alert(`추가 구매 주문이 생성되었습니다.
주문번호: ${i.orderId}
금액: ₩${i.amount.toLocaleString()}

결제 진행은 추후 안내됩니다.`)}catch{alert("네트워크 오류가 발생했습니다.")}finally{S(null)}};if("invalid"===x)return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(o.default,{density:1e4,goldStars:3}),(0,a.jsx)(s.default,{variant:"unsedang"}),(0,a.jsx)("main",{className:"state",children:(0,a.jsxs)("div",{className:"state-inner",children:[(0,a.jsx)("h1",{children:"잘못된 주문번호입니다"}),(0,a.jsx)("p",{children:"알림톡으로 받으신 정확한 링크로 다시 접속해주세요."}),(0,a.jsx)(i.default,{href:"/",className:"btn-link",children:"운세당 홈으로"})]})}),(0,a.jsx)(n.default,{}),(0,a.jsx)("style",{children:j}),(0,a.jsx)("style",{children:w})]});if("failed"===x)return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(o.default,{density:1e4,goldStars:3}),(0,a.jsx)(s.default,{variant:"unsedang"}),(0,a.jsx)("main",{className:"state",children:(0,a.jsxs)("div",{className:"state-inner",children:[(0,a.jsx)("h1",{children:"풀이 준비가 늦어지고 있습니다"}),(0,a.jsxs)("p",{children:["잠시 후 다시 접속해주세요.",(0,a.jsx)("br",{}),"5분 이상 같은 화면이 보이시면 카카오톡 채널 ",(0,a.jsx)("strong",{children:"@unsedang"}),"으로 주문번호와 함께 문의 주세요."]}),(0,a.jsxs)("div",{className:"state-meta",children:["주문번호 · ",e]}),(0,a.jsx)(i.default,{href:"/",className:"btn-link",children:"운세당 홈으로"})]})}),(0,a.jsx)(n.default,{}),(0,a.jsx)("style",{children:j}),(0,a.jsx)("style",{children:w})]});if("waiting"===x||!c)return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(o.default,{density:1e4,goldStars:5}),(0,a.jsx)(s.default,{variant:"unsedang"}),(0,a.jsx)("main",{className:"state",children:(0,a.jsxs)("div",{className:"state-inner waiting",children:[(0,a.jsx)("div",{className:"forming",children:(0,a.jsxs)("svg",{viewBox:"0 0 200 200",width:"160",height:"160",children:[(0,a.jsx)("defs",{children:(0,a.jsxs)("radialGradient",{id:"fg",cx:"50%",cy:"50%",r:"50%",children:[(0,a.jsx)("stop",{offset:"0%",stopColor:"#C9A864",stopOpacity:"0.8"}),(0,a.jsx)("stop",{offset:"100%",stopColor:"#C9A864",stopOpacity:"0"})]})}),(0,a.jsx)("circle",{cx:"100",cy:"100",r:"80",fill:"url(#fg)",className:"form-glow"}),(0,a.jsx)("ellipse",{cx:"100",cy:"130",rx:"55",ry:"14",fill:"none",stroke:"#C9A864",strokeWidth:"0.8",opacity:"0.6",className:"form-ring r1"}),(0,a.jsx)("ellipse",{cx:"100",cy:"100",rx:"50",ry:"50",fill:"none",stroke:"#C9A864",strokeWidth:"0.6",opacity:"0.4",className:"form-ring r2"}),(0,a.jsx)("ellipse",{cx:"100",cy:"70",rx:"55",ry:"14",fill:"none",stroke:"#C9A864",strokeWidth:"0.8",opacity:"0.6",className:"form-ring r3"})]})}),(0,a.jsxs)("div",{className:"eyebrow-line",children:[(0,a.jsx)("span",{className:"line"}),(0,a.jsx)("span",{className:"text",children:"運勢堂 · 풀이가 빚어지고 있습니다"}),(0,a.jsx)("span",{className:"line"})]}),(0,a.jsx)("h1",{children:"그릇이 빚어지는 중입니다"}),(0,a.jsxs)("p",{children:["사주가 운세당의 글로 정리되고 있습니다.",(0,a.jsx)("br",{}),"잠시만 기다려주세요. 보통 ",(0,a.jsx)("strong",{children:"30초~1분"})," 이내에 완성됩니다."]}),(0,a.jsxs)("div",{className:"state-meta",children:["주문번호 · ",e]}),(0,a.jsx)("div",{className:"progress",children:(0,a.jsx)("div",{className:"progress-bar",style:{width:`${Math.min(4*k,95)}%`}})})]})}),(0,a.jsx)(n.default,{}),(0,a.jsx)("style",{children:j}),(0,a.jsx)("style",{children:w})]});let C=c.sajuSnapshot||{},F=C.birth?.name||"귀하",$=c.bowl||"dalhanari",E=c.bowlLabelKo||"",T=c.bowlLabelHanja||d[$]||"",B=c.bowlMoodLabel||"",P=c.score??0,I=c.verse||"",q=c.strength||"",M=C.dayMaster||{},W=C.daeun?.current||{},D=C.ohengPct||{wood:0,fire:0,earth:0,metal:0,water:0},L=c.creditBalance??0,R=c.creditTotalGranted??0,U=c.chapters||[],Y=C.fourPillarsHangul||{},_=[{label:"年柱",sub:"연주",value:Y.year||"—"},{label:"月柱",sub:"월주",value:Y.month||"—"},{label:"日柱",sub:"일주",value:Y.day||"—"},{label:"時柱",sub:"시주",value:Y.hour||"—"}],O=(c.creditHistory||[]).filter(e=>"use"===e.type&&e.question&&e.answer).map(e=>({question:e.question,answer:e.answer,at:e.completedAt||e.at}));return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(o.default,{density:12e3,goldStars:10}),(0,a.jsx)(s.default,{variant:"unsedang"}),(0,a.jsx)(u,{}),(0,a.jsxs)("main",{className:"result",children:[(0,a.jsxs)("section",{className:"hero",children:[(0,a.jsxs)("div",{className:"hero-eyebrow",children:[(0,a.jsx)("span",{className:"line"}),(0,a.jsx)("span",{className:"text",children:"運勢堂 · 財運 풀이"}),(0,a.jsx)("span",{className:"line"})]}),(0,a.jsxs)("h1",{className:"hero-title",children:[(0,a.jsx)("span",{className:"hero-name",children:F}),(0,a.jsx)("span",{className:"hero-sfx",children:"님의 그릇"})]}),(0,a.jsx)("p",{className:"hero-sub",children:"사주가 빚어낸 단 하나의 형상"}),(0,a.jsx)(m,{bowl:$,bowlHanja:T,bowlKo:E,userName:F,score:P,mood:B,verse:I}),(0,a.jsxs)("div",{className:"score-line",children:[(0,a.jsx)("div",{className:"score-num",children:P}),(0,a.jsx)("div",{className:"score-of",children:"/ 100"}),(0,a.jsx)("div",{className:"score-strength",children:q})]}),(0,a.jsx)("div",{className:"pillars",children:_.map((e,t)=>(0,a.jsxs)("div",{className:"pillar",style:{animationDelay:`${100*t+400}ms`},children:[(0,a.jsx)("div",{className:"pillar-label",children:e.label}),(0,a.jsx)("div",{className:"pillar-value",children:(0,a.jsx)(h,{char:e.value,delay:200*t+600})}),(0,a.jsx)("div",{className:"pillar-sub",children:e.sub})]},t))}),(0,a.jsxs)("div",{className:"meta-line",children:[M.ganHangul&&(0,a.jsxs)("div",{className:"meta-item",children:[(0,a.jsx)("span",{className:"mk",children:"日干"}),(0,a.jsxs)("span",{className:"mv",children:[M.ganHangul," · ",M.oheng]})]}),W.pillar&&(0,a.jsxs)("div",{className:"meta-item",children:[(0,a.jsx)("span",{className:"mk",children:"大運"}),(0,a.jsxs)("span",{className:"mv",children:[W.currentAge??"?","세 · ",W.pillar]})]})]}),(0,a.jsx)(g,{pct:D})]}),(0,a.jsx)("div",{className:"chapters",children:U.map((e,t)=>(0,a.jsx)(f,{chapter:e,bowl:$,idx:t},e.number))}),(0,a.jsxs)("section",{className:"finale",children:[(0,a.jsx)("div",{className:"finale-divider","aria-hidden":!0,children:(0,a.jsxs)("svg",{viewBox:"0 0 300 24",preserveAspectRatio:"none",children:[(0,a.jsx)("path",{d:"M0 12 L120 12",stroke:"var(--gold)",strokeWidth:"0.6",opacity:"0.5"}),(0,a.jsx)("path",{d:"M180 12 L300 12",stroke:"var(--gold)",strokeWidth:"0.6",opacity:"0.5"}),(0,a.jsx)("circle",{cx:"150",cy:"12",r:"3",fill:"var(--gold)"}),(0,a.jsx)("circle",{cx:"150",cy:"12",r:"8",fill:"none",stroke:"var(--gold)",strokeWidth:"0.5",opacity:"0.4"})]})}),(0,a.jsxs)("div",{className:"finale-eyebrow",children:[(0,a.jsx)("span",{className:"line"}),(0,a.jsx)("span",{className:"text",children:"運勢堂 · 質問"}),(0,a.jsx)("span",{className:"line"})]}),(0,a.jsx)("h2",{className:"finale-title",children:"더 묻고 싶은 것이 있으십니까"}),(0,a.jsxs)("p",{className:"finale-sub",children:["결제 시 부여된 질문권으로, 운세당의 점성가에게 직접 질문하실 수 있습니다.",(0,a.jsx)("br",{}),"사주와 위 풀이를 근거로 정성껏 답해드립니다."]}),(0,a.jsx)(b,{orderId:e,balance:L,totalGranted:R,history:O,onBalanceUpdate:e=>{p(a=>a?{...a,creditBalance:e}:a)}}),(0,a.jsxs)("div",{id:"purchase",className:"purchase",children:[(0,a.jsxs)("div",{className:"purchase-eyebrow",children:[(0,a.jsx)("span",{className:"line"}),(0,a.jsx)("span",{className:"text",children:"追加 質問券"}),(0,a.jsx)("span",{className:"line"})]}),(0,a.jsx)("h3",{children:"추가 질문권"}),(0,a.jsx)("p",{className:"purchase-sub",children:"풀이를 보고 더 깊이 묻고 싶을 때, 질문권을 보충하실 수 있습니다."}),(0,a.jsxs)("div",{className:"packs",children:[(0,a.jsx)(v,{code:"CREDIT_3",name:"질문권 3회",price:2900,perUnit:967,onClick:()=>A("CREDIT_3"),loading:"CREDIT_3"===z}),(0,a.jsx)(v,{code:"CREDIT_10",name:"질문권 10회",price:6900,perUnit:690,recommended:!0,onClick:()=>A("CREDIT_10"),loading:"CREDIT_10"===z})]})]})]}),(0,a.jsxs)("div",{className:"result-foot",children:[(0,a.jsxs)("div",{className:"foot-meta",children:["주문번호 · ",e]}),(0,a.jsxs)("div",{className:"foot-meta",children:["문의 · 카카오톡 채널 ",(0,a.jsx)("strong",{children:"@unsedang"})]})]})]}),(0,a.jsx)(n.default,{}),(0,a.jsx)("style",{children:j}),(0,a.jsx)("style",{children:w})]})}let j=`
  .state {
    position: relative; z-index: 10;
    max-width: 720px; margin: 0 auto;
    padding: 120px 32px 80px;
    text-align: center;
  }
  .state-inner { display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .state h1 { font-family: var(--serif-kr); font-weight: 300; font-size: 28px; letter-spacing: 0.05em; color: var(--white-baekja); }
  .state p { font-family: var(--serif-kr); font-weight: 300; font-size: 15px; line-height: 1.9; color: var(--text-secondary); letter-spacing: 0.04em; }
  .state strong { color: var(--gold-light); font-weight: 500; }
  .state-meta { font-family: var(--serif-en); font-size: 12px; color: var(--text-tertiary); letter-spacing: 0.08em; margin-top: 12px; }
  .btn-link {
    margin-top: 24px; padding: 12px 28px;
    font-family: var(--serif-kr); font-weight: 400; font-size: 13px; letter-spacing: 0.2em;
    color: var(--gold-light); text-decoration: none;
    border: 1px solid var(--border-strong);
    background: transparent;
    transition: all 0.4s ease;
  }
  .btn-link:hover { background: rgba(201,168,100,0.08); border-color: var(--gold); }

  .waiting .forming { margin-bottom: 20px; filter: drop-shadow(0 0 30px rgba(201,168,100,0.3)); }
  .form-glow { animation: glowPulse 2.4s ease-in-out infinite; transform-origin: center; }
  .form-ring { transform-origin: 100px 100px; }
  .form-ring.r1 { animation: ringSpin 8s linear infinite; }
  .form-ring.r2 { animation: ringSpin 12s linear infinite reverse; }
  .form-ring.r3 { animation: ringSpin 10s linear infinite; }
  @keyframes glowPulse { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
  @keyframes ringSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }

  .eyebrow-line { display: inline-flex; align-items: center; gap: 14px; margin-bottom: 4px; }
  .eyebrow-line .line { width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }
  .eyebrow-line .text { font-family: var(--serif-tc); font-weight: 300; font-size: 11px; letter-spacing: 0.35em; color: var(--gold); }

  .progress { width: 220px; height: 2px; background: rgba(201,168,100,0.15); margin-top: 24px; overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, transparent, var(--gold-light), var(--gold)); transition: width 0.6s ease; }
`,w=`
  /* ====== 우측 스크롤 실 ====== */
  .scroll-thread { position: fixed; right: 24px; top: 100px; bottom: 100px; width: 2px; z-index: 50; pointer-events: none; }
  .st-track { position: absolute; inset: 0; background: var(--border); }
  .st-fill { position: absolute; top: 0; left: 0; width: 2px; background: linear-gradient(180deg, var(--gold-light), var(--gold), var(--gold-deep)); transition: height 0.2s; }
  .st-dot { position: absolute; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 12px var(--gold), 0 0 24px rgba(201,168,100,0.4); transition: top 0.2s; }
  @media (max-width: 820px) { .scroll-thread { display: none; } }

  /* ====== 메인 컨테이너 ====== */
  .result { position: relative; z-index: 10; max-width: 820px; margin: 0 auto; padding: 88px 28px 60px; }

  /* ====== Hero ====== */
  .hero { position: relative; padding: 40px 0 50px; text-align: center; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .hero-eyebrow .line { width: 28px; height: 1px; background: var(--gold); opacity: 0.7; }
  .hero-eyebrow .text { font-family: var(--serif-tc); font-weight: 300; font-size: 11px; letter-spacing: 0.4em; color: var(--gold); }
  .hero-title { font-family: var(--serif-kr); font-weight: 200; letter-spacing: 0.04em; margin-bottom: 8px; line-height: 1.4; }
  .hero-name {
    font-size: 38px;
    background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 50%, var(--gold-deep) 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    font-weight: 400;
    animation: charGlow 4s ease-in-out infinite;
  }
  @keyframes charGlow { 0%,100% { filter: drop-shadow(0 0 6px rgba(201,168,100,0.2)); } 50% { filter: drop-shadow(0 0 14px rgba(201,168,100,0.5)); } }
  .hero-sfx { font-size: 22px; color: var(--text-secondary); font-weight: 200; margin-left: 4px; }
  .hero-sub { font-family: var(--serif-kr); font-weight: 300; font-size: 14px; color: var(--text-tertiary); letter-spacing: 0.1em; margin-bottom: 36px; }

  /* ====== Hero BowlCard (봉인 해제) ====== */
  .hero-bowl-wrap {
    position: relative;
    max-width: 380px;
    margin: 0 auto 36px;
  }

  /* 자개 회전 */
  .mother-of-pearl {
    position: absolute;
    inset: -20% -20% -20% -20%;
    z-index: 0;
    background: conic-gradient(
      from 0deg at 50% 50%,
      rgba(201,168,100,0.18) 0deg,
      rgba(168,50,74,0.14) 72deg,
      rgba(31,58,95,0.16) 144deg,
      rgba(92,138,122,0.14) 216deg,
      rgba(201,168,100,0.18) 288deg,
      rgba(168,50,74,0.14) 360deg
    );
    filter: blur(50px);
    opacity: 0.85;
    pointer-events: none;
    animation: pearlSpin 32s linear infinite;
  }
  @keyframes pearlSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }

  /* 봉인 해제 펄스 */
  .unseal-pulse {
    position: absolute; inset: 0; z-index: 4;
    pointer-events: none;
    border-radius: 16px;
    background: radial-gradient(circle at center, rgba(255,232,160,0.45) 0%, rgba(201,168,100,0.2) 30%, transparent 70%);
    animation: unsealPulse 1.4s ease-out forwards;
  }
  @keyframes unsealPulse {
    0% { opacity: 0; transform: scale(0.4); }
    30% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 0; transform: scale(2.0); }
  }

  /* 금박 파티클 */
  .particles { position: absolute; inset: 0; z-index: 5; pointer-events: none; overflow: visible; }
  .particle {
    position: absolute;
    width: 6px; height: 6px;
    background: radial-gradient(circle, #FFE8A0 0%, #C9A864 60%, transparent 100%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: particleFly 2.4s cubic-bezier(0.2, 0.6, 0.4, 1) var(--d, 0s) forwards;
    box-shadow: 0 0 8px rgba(255,232,160,0.8);
  }
  @keyframes particleFly {
    0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--a)) translateX(0) scale(0.4); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--a)) translateX(280px) scale(1.2); }
  }

  /* BowlCard 본체 (9:16) */
  .bowl-card {
    position: relative;
    width: 100%;
    aspect-ratio: 9 / 16;
    background: #0a0612;
    border: 1px solid #5a4a3a;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 40px rgba(201,168,100,0.2), 0 24px 60px rgba(0,0,0,0.5);
    z-index: 2;
    transition: box-shadow 1.2s ease, transform 1.2s ease;
  }
  .bowl-card.unsealed {
    box-shadow: 0 0 60px rgba(201,168,100,0.5), 0 24px 70px rgba(0,0,0,0.6), 0 0 120px rgba(255,232,160,0.18);
    animation: bowlGold 5s ease-in-out 1s infinite;
  }
  @keyframes bowlGold {
    0%,100% { box-shadow: 0 0 60px rgba(201,168,100,0.5), 0 24px 70px rgba(0,0,0,0.6), 0 0 120px rgba(255,232,160,0.10); }
    50% { box-shadow: 0 0 80px rgba(201,168,100,0.65), 0 24px 70px rgba(0,0,0,0.6), 0 0 160px rgba(255,232,160,0.22); }
  }
  .bowl-video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .bowl-grad-top { position: absolute; top: 0; left: 0; right: 0; height: 30%; background: linear-gradient(to bottom, rgba(10,6,18,0.85), transparent); pointer-events: none; z-index: 1; }
  .bowl-grad-bot { position: absolute; bottom: 0; left: 0; right: 0; height: 42%; background: linear-gradient(to top, rgba(10,6,18,0.94) 0%, rgba(10,6,18,0.7) 50%, transparent 100%); pointer-events: none; z-index: 1; }

  .bowl-top { position: absolute; top: 6%; left: 0; right: 0; text-align: center; z-index: 3; padding: 0 20px; transition: opacity 0.6s ease; }
  .bowl-card.sealed .bowl-top { opacity: 0.4; }
  .bowl-brand { font-family: var(--serif-kr); font-size: 20px; font-weight: 700; color: #c9a864; letter-spacing: 0.4em; text-shadow: 0 2px 12px rgba(0,0,0,0.95); margin-bottom: 6px; }
  .bowl-line { color: #8a6f3d; font-size: 10px; letter-spacing: 0.3em; opacity: 0.7; }
  .bowl-user { font-family: var(--serif-kr); font-size: 13px; color: var(--white-baekja); margin-top: 8px; letter-spacing: 0.15em; }

  .bowl-bot { position: absolute; bottom: 6%; left: 0; right: 0; text-align: center; z-index: 3; padding: 0 24px; transition: opacity 0.6s ease, transform 0.6s ease; }
  .bowl-card.sealed .bowl-bot { opacity: 0; transform: translateY(20px); }
  .bowl-card.unsealed .bowl-bot { opacity: 1; transform: translateY(0); }
  .bowl-name { font-family: var(--serif-tc); font-size: 22px; color: var(--white-baekja); letter-spacing: 0.05em; margin-bottom: 10px; text-shadow: 0 2px 12px rgba(0,0,0,0.9); }
  .bn-hanja { font-weight: 500; }
  .bn-dot { color: var(--gold); margin: 0 8px; }
  .bn-ko { font-family: var(--serif-kr); font-size: 16px; font-weight: 300; }
  .bowl-score { display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 12px; font-family: var(--serif-kr); font-size: 12px; }
  .bs-mood { color: var(--gold-light); letter-spacing: 0.1em; }
  .bs-gauge { color: var(--gold); letter-spacing: 0.2em; font-family: var(--serif-en); }
  .bs-num { color: var(--white-baekja); font-family: var(--serif-en); font-size: 14px; }
  .bowl-verse { font-family: var(--serif-kr); font-style: italic; font-size: 13px; color: var(--text-secondary); line-height: 1.7; letter-spacing: 0.04em; padding: 0 8px; text-shadow: 0 1px 6px rgba(0,0,0,0.9); }
  .bowl-wm { margin-top: 14px; font-family: var(--serif-kr); font-size: 9px; color: var(--gold-deep); letter-spacing: 0.4em; opacity: 0.7; }

  /* 봉인 종이 띠 X자 */
  .seal-band {
    position: absolute; top: 50%; left: -10%; width: 120%; height: 36px;
    background: linear-gradient(180deg, #D85A6C 0%, #A8324A 50%, #7A2235 100%);
    z-index: 6;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    transition: transform 1.0s cubic-bezier(0.2, 0.9, 0.2, 1.0), opacity 0.8s ease;
  }
  .seal-band::before {
    content: ''; position: absolute; inset: 0;
    background: repeating-linear-gradient(45deg, transparent 0 6px, rgba(245,240,232,0.08) 6px 7px);
  }
  .band-l { transform: translate(-50%, -50%) rotate(-22deg); }
  .band-r { transform: translate(-50%, -50%) rotate(22deg); }
  .bowl-card.unsealed .band-l { transform: translate(-150%, 150%) rotate(-45deg); opacity: 0; }
  .bowl-card.unsealed .band-r { transform: translate(150%, 150%) rotate(45deg); opacity: 0; }

  /* 가운데 큰 인장 */
  .seal-center {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 140px; height: 140px;
    background: none; border: none; cursor: pointer;
    z-index: 7;
    padding: 0;
    transition: transform 0.4s ease, opacity 0.8s ease;
    animation: sealShake 3s ease-in-out infinite;
  }
  .seal-center svg { width: 100%; height: 100%; filter: drop-shadow(0 8px 24px rgba(168,50,74,0.6)); }
  .seal-center:hover { transform: translate(-50%, -50%) scale(1.05); }
  .seal-tap {
    position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%);
    font-family: var(--serif-kr); font-size: 11px; color: var(--gold-light);
    letter-spacing: 0.25em; white-space: nowrap;
    text-shadow: 0 1px 6px rgba(0,0,0,0.9);
    opacity: 0.85;
    animation: tapBlink 2s ease-in-out infinite;
  }
  @keyframes sealShake { 0%,90%,100% { transform: translate(-50%, -50%) rotate(0); } 92% { transform: translate(-50%, -50%) rotate(-2deg); } 94% { transform: translate(-50%, -50%) rotate(2deg); } 96% { transform: translate(-50%, -50%) rotate(-1deg); } 98% { transform: translate(-50%, -50%) rotate(1deg); } }
  @keyframes tapBlink { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
  .bowl-card.unsealed .seal-center { opacity: 0; pointer-events: none; transform: translate(-50%, -50%) scale(0.3); }

  /* 우상단 정본 인장 */
  .seal-corner {
    position: absolute; top: 14px; right: 14px;
    width: 44px; height: 44px;
    z-index: 4;
    filter: drop-shadow(0 4px 10px rgba(168,50,74,0.5));
    animation: cornerStamp 0.6s cubic-bezier(0.2, 1.4, 0.5, 1) 1.4s both;
  }
  @keyframes cornerStamp {
    0% { opacity: 0; transform: scale(2.5) rotate(-15deg); }
    100% { opacity: 0.9; transform: scale(1) rotate(0); }
  }

  /* ====== 점수 ====== */
  .score-line {
    display: inline-flex; align-items: baseline; gap: 8px;
    margin: 0 0 32px;
    padding: 14px 32px;
    background: rgba(10,10,18,0.5);
    border: 1px solid var(--border);
    border-top: 1px solid var(--gold);
    animation: fadeUp 0.8s 1.8s both;
  }
  .score-num {
    font-family: var(--serif-en); font-size: 44px; font-weight: 500;
    background: linear-gradient(135deg, var(--gold-light), var(--gold));
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .score-of { font-family: var(--serif-en); font-size: 16px; color: var(--text-tertiary); }
  .score-strength { font-family: var(--serif-kr); font-size: 13px; color: var(--gold-light); margin-left: 16px; letter-spacing: 0.2em; }

  /* ====== 4기둥 (한자 stroke 애니메이션) ====== */
  .pillars {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 10px; max-width: 460px; margin: 0 auto 28px;
  }
  .pillar {
    padding: 18px 8px;
    background: linear-gradient(180deg, rgba(245,240,232,0.05) 0%, rgba(245,240,232,0.01) 100%);
    border: 1px solid var(--border);
    text-align: center;
    opacity: 0; animation: fadeUp 0.8s ease-out forwards;
    position: relative;
    overflow: hidden;
  }
  .pillar::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(201,168,100,0.08), transparent 70%);
    opacity: 0; transition: opacity 0.6s ease;
  }
  .pillar:hover::before { opacity: 1; }
  .pillar-label { font-family: var(--serif-tc); font-size: 11px; color: var(--gold); letter-spacing: 0.2em; margin-bottom: 10px; }
  .pillar-value {
    font-family: var(--serif-kr); font-size: 22px; color: var(--white-baekja); font-weight: 400;
    letter-spacing: 0.04em; min-height: 30px;
    display: flex; justify-content: center; align-items: center;
  }
  .pillar-char {
    display: inline-block;
    opacity: 0;
    animation: charDraw 1.2s ease-out forwards;
    background: linear-gradient(135deg, #F5F0E8 0%, var(--gold-light) 50%, #F5F0E8 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    text-shadow: 0 0 8px rgba(201,168,100,0.3);
  }
  @keyframes charDraw {
    0% { opacity: 0; filter: blur(4px); transform: translateY(8px) scale(0.9); }
    50% { opacity: 0.7; filter: blur(2px); }
    100% { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
  }
  .pillar-sub { font-family: var(--serif-kr); font-size: 10px; color: var(--text-tertiary); margin-top: 8px; letter-spacing: 0.2em; }

  /* ====== meta ====== */
  .meta-line { display: flex; gap: 20px; justify-content: center; margin-bottom: 36px; flex-wrap: wrap; animation: fadeUp 0.8s 1.6s both; }
  .meta-item { display: inline-flex; align-items: center; gap: 8px; font-family: var(--serif-kr); font-size: 12px; }
  .mk { font-family: var(--serif-tc); color: var(--gold); letter-spacing: 0.2em; }
  .mv { color: var(--text-secondary); letter-spacing: 0.05em; }

  /* ====== 오행 5각 별자리 ====== */
  .oheng-stars {
    max-width: 360px; margin: 0 auto;
    padding: 16px 20px 22px;
    background: rgba(10,10,18,0.4);
    border: 1px solid var(--border);
    border-radius: 4px;
    animation: fadeUp 0.8s 1.8s both;
  }
  .oheng-stars-title {
    font-family: var(--serif-tc); font-size: 11px; color: var(--gold);
    letter-spacing: 0.3em; text-align: center; margin-bottom: 8px;
  }
  .oheng-svg { width: 100%; height: auto; max-width: 300px; display: block; margin: 0 auto; }
  .oheng-node { transform-origin: center; }
  .oheng-glow {
    animation: ohengBlink var(--blink, 4s) ease-in-out infinite;
    transform-origin: center;
  }
  .oheng-dot {
    filter: drop-shadow(0 0 6px currentColor);
  }
  @keyframes ohengBlink { 0%,100% { opacity: 0.12; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.15); } }

  /* ====== 챕터 ====== */
  .chapters { display: flex; flex-direction: column; gap: 64px; }

  .chapter {
    position: relative;
    padding: 80px 0 40px;
    opacity: 0; transform: translateY(40px);
    transition: opacity 1.2s ease-out, transform 1.2s ease-out;
  }
  .chapter.entered { opacity: 1; transform: translateY(0); }

  /* 배경 한자 워터마크 */
  .ch-bg-hanja {
    position: absolute;
    top: 40px; right: -20px;
    font-family: var(--serif-tc); font-size: 240px; font-weight: 200;
    color: var(--gold-deep);
    opacity: 0.05;
    pointer-events: none; z-index: 0;
    line-height: 1; user-select: none;
  }

  /* 인장 낙하 (챕터 진입 시) */
  .ch-seal-zone {
    position: relative;
    height: 110px;
    margin-bottom: 20px;
    text-align: center;
    z-index: 2;
  }
  .falling-seal {
    position: absolute; top: 0; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    opacity: 0;
  }
  .chapter.entered .falling-seal {
    animation: sealDrop 1.0s cubic-bezier(0.4, 0.0, 0.2, 1.0) 0.2s forwards;
  }
  @keyframes sealDrop {
    0% { opacity: 0; transform: translateX(-50%) translateY(-120px) rotate(-180deg) scale(1.6); }
    60% { opacity: 1; transform: translateX(-50%) translateY(10px) rotate(0) scale(0.95); }
    80% { transform: translateX(-50%) translateY(-4px) rotate(0) scale(1.02); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) rotate(0) scale(1); }
  }
  .fs-svg { width: 76px; height: 76px; filter: drop-shadow(0 6px 18px rgba(168,50,74,0.5)); }
  .fs-num { font-family: var(--serif-tc); font-size: 10px; color: var(--gold); letter-spacing: 0.3em; }

  /* 그릇 부위 클로즈업 (좌측) */
  .ch-bowl-clip {
    position: absolute;
    left: -200px; top: 90px; display: none;
    width: 180px; height: 240px;
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    z-index: 1;
    opacity: 0; transform: translateX(-20px);
    transition: opacity 1.2s ease-out 0.4s, transform 1.2s ease-out 0.4s;
    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  }
  .chapter.entered .ch-bowl-clip { opacity: 0.95; transform: translateX(0); }
  .ch-bowl-clip img {
    width: 100%; height: 100%; object-fit: cover;
    transition: object-position 1.5s ease;
  }
  .ch-bowl-fade {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 60%, rgba(10,10,18,0.6) 100%);
    pointer-events: none;
  }
  @media (max-width: 1100px) { .ch-bowl-clip { display: none; } }

  /* 본문 */
  .ch-content { position: relative; z-index: 2; }
  .ch-eyebrow { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .ch-eyebrow .line { width: 22px; height: 1px; background: var(--gold); opacity: 0.6; }
  .ch-eyebrow .text { font-family: var(--serif-tc); font-size: 10px; color: var(--gold); letter-spacing: 0.35em; }
  .ch-title {
    font-family: var(--serif-kr); font-weight: 300; font-size: 28px;
    color: var(--white-baekja); letter-spacing: 0.04em; line-height: 1.4;
    margin-bottom: 28px;
  }
  .ch-intro {
    position: relative;
    padding: 22px 40px;
    margin: 0 0 30px;
    text-align: center;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .ch-intro p { font-family: var(--serif-kr); font-weight: 300; font-size: 15px; color: var(--gold-light); letter-spacing: 0.08em; line-height: 1.9; font-style: italic; }
  .qm { position: absolute; top: 8px; left: 12px; font-family: var(--serif-tc); font-size: 22px; color: var(--gold); opacity: 0.5; }
  .qm.right { left: auto; right: 12px; top: auto; bottom: 8px; }

  .ch-databoxes { display: flex; flex-direction: column; gap: 14px; margin: 0 0 30px; }
  .ch-databox { position: relative; padding: 16px 20px; background: linear-gradient(135deg, rgba(201,168,100,0.07) 0%, rgba(201,168,100,0.02) 100%); border: 1px solid var(--border); border-left: 2px solid var(--gold); }
  .ch-databox-title { font-family: var(--serif-tc); font-size: 11px; font-weight: 400; color: var(--gold); letter-spacing: 0.3em; margin-bottom: 12px; }
  .ch-databox-rows { display: flex; flex-direction: column; }
  .ch-databox-row { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 8px 0; border-bottom: 1px dashed var(--border); }
  .ch-databox-row:last-child { border-bottom: none; }
  .ch-databox-label { flex-shrink: 0; font-family: var(--serif-kr); font-weight: 300; font-size: 13px; color: var(--text-tertiary); letter-spacing: 0.05em; }
  .ch-databox-value { font-family: var(--serif-kr); font-weight: 400; font-size: 13.5px; color: var(--gold-light); letter-spacing: 0.02em; text-align: right; line-height: 1.6; }
  .ch-body { display: flex; flex-direction: column; gap: 24px; padding: 0 4px; }
  .ch-block p {
    font-family: var(--serif-kr); font-weight: 300; font-size: 16px;
    color: var(--text-primary); line-height: 2.05; letter-spacing: 0.02em;
    margin-bottom: 14px;
  }
  .ch-block p:last-child { margin-bottom: 0; }

  .ch-ai {
    position: relative;
    padding: 20px 24px 20px 52px;
    background: linear-gradient(135deg, rgba(31,58,95,0.12) 0%, rgba(168,50,74,0.05) 100%);
    border-left: 2px solid var(--gold);
  }
  .ch-ai-mark { position: absolute; top: 22px; left: 18px; }
  .ch-ai p { font-family: var(--serif-kr); font-weight: 400; font-size: 15px; color: var(--white-baekja); line-height: 1.95; letter-spacing: 0.02em; }

  .ch-outro { margin-top: 28px; padding-top: 22px; border-top: 1px dashed var(--border); }
  .ch-outro p { font-family: var(--serif-kr); font-weight: 300; font-size: 14px; color: var(--text-secondary); letter-spacing: 0.05em; line-height: 1.9; font-style: italic; text-align: center; }

  /* ====== Finale ====== */
  .finale { margin-top: 100px; padding: 60px 0 20px; text-align: center; }
  .finale-divider { margin: 0 auto 36px; max-width: 300px; }
  .finale-eyebrow { display: inline-flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .finale-eyebrow .line { width: 28px; height: 1px; background: var(--gold); opacity: 0.7; }
  .finale-eyebrow .text { font-family: var(--serif-tc); font-size: 11px; letter-spacing: 0.4em; color: var(--gold); }
  .finale-title { font-family: var(--serif-kr); font-weight: 200; font-size: 28px; color: var(--white-baekja); letter-spacing: 0.05em; margin-bottom: 16px; }
  .finale-sub { font-family: var(--serif-kr); font-weight: 300; font-size: 14px; color: var(--text-secondary); letter-spacing: 0.04em; line-height: 1.9; margin-bottom: 36px; }

  /* ====== AI 인라인 채팅 ====== */
  .chat {
    max-width: 640px; margin: 0 auto;
    text-align: left;
  }
  .chat-balance {
    display: inline-flex; align-items: center; gap: 12px;
    padding: 10px 22px;
    background: rgba(10,10,18,0.5);
    border: 1px solid var(--border);
    border-top: 1px solid var(--gold);
    margin-bottom: 28px;
    margin-left: 50%; transform: translateX(-50%);
  }
  .cb-key { font-family: var(--serif-tc); font-size: 11px; color: var(--gold); letter-spacing: 0.25em; }
  .cb-val { font-family: var(--serif-kr); font-size: 13px; color: var(--text-secondary); }
  .cb-val strong { color: var(--gold-light); font-weight: 500; font-size: 18px; margin: 0 4px; }
  .cb-total { color: var(--text-tertiary); font-size: 11px; }

  .chat-history { display: flex; flex-direction: column; gap: 24px; margin-bottom: 32px; }
  .chat-entry {
    display: flex; flex-direction: column; gap: 12px;
    animation: fadeUp 0.8s ease-out;
  }

  /* 질문 카드 (오른쪽 정렬, 부드러운 회색) */
  .chat-q {
    align-self: flex-end;
    max-width: 80%;
    display: flex; gap: 10px; align-items: flex-start;
    padding: 14px 18px;
    background: rgba(245,240,232,0.05);
    border: 1px solid var(--border);
    border-right: 2px solid var(--text-tertiary);
  }
  .chat-q-key {
    flex-shrink: 0;
    font-family: var(--serif-tc); font-size: 14px; font-weight: 500;
    color: var(--text-tertiary); letter-spacing: 0.1em;
    padding-top: 2px;
  }
  .chat-q p { font-family: var(--serif-kr); font-size: 14px; color: var(--white-baekja); line-height: 1.8; letter-spacing: 0.02em; }

  /* 답변 카드 (한지 + 인장 도장) */
  .chat-a {
    position: relative;
    max-width: 92%;
    padding: 24px 36px 28px;
    background:
      radial-gradient(circle at 10% 20%, rgba(201,168,100,0.04), transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(168,50,74,0.04), transparent 50%),
      linear-gradient(135deg, #1a1426 0%, #14101F 100%);
    border: 1px solid var(--border-strong);
    border-top: 1px solid var(--gold);
  }
  .chat-a::before {
    content: ''; position: absolute; inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent 0 2px,
      rgba(201,168,100,0.012) 2px 3px
    );
    pointer-events: none;
  }
  .chat-a-quote {
    position: absolute; top: 8px; left: 12px;
    font-family: var(--serif-tc); font-size: 24px; color: var(--gold); opacity: 0.5;
  }
  .chat-a-quote.right { left: auto; right: 12px; top: auto; bottom: 8px; }
  .chat-a p {
    font-family: var(--serif-kr); font-weight: 300; font-size: 15.5px;
    color: var(--white-baekja); line-height: 2.0; letter-spacing: 0.02em;
    position: relative; z-index: 1;
  }
  .chat-cursor { color: var(--gold); animation: blink 0.8s ease-in-out infinite; }
  @keyframes blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }

  .chat-a-seal {
    position: absolute; right: 14px; bottom: 14px;
    width: 38px; height: 38px;
    filter: drop-shadow(0 3px 8px rgba(168,50,74,0.4));
    animation: sealStamp 0.5s cubic-bezier(0.2, 1.4, 0.5, 1) both;
  }
  @keyframes sealStamp {
    0% { opacity: 0; transform: scale(2.2) rotate(-12deg); }
    100% { opacity: 0.9; transform: scale(1) rotate(0); }
  }

  /* 입력 영역 */
  .chat-input-wrap {
    margin-top: 28px;
    padding: 18px 22px;
    background: linear-gradient(180deg, rgba(245,240,232,0.03) 0%, rgba(245,240,232,0.01) 100%);
    border: 1px solid var(--border-strong);
    border-top: 1px solid var(--gold);
  }
  .chat-input {
    width: 100%; min-height: 80px;
    padding: 4px 0;
    background: transparent;
    border: none;
    color: var(--white-baekja);
    font-family: var(--serif-kr); font-size: 15px; font-weight: 300;
    line-height: 1.8; letter-spacing: 0.02em;
    resize: vertical;
    outline: none;
  }
  .chat-input::placeholder { color: var(--text-tertiary); font-style: italic; }
  .chat-input-meta {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 8px; padding-top: 10px;
    border-top: 1px dashed var(--border);
    font-family: var(--serif-en); font-size: 12px; color: var(--text-tertiary);
  }
  .chat-send {
    padding: 10px 22px;
    font-family: var(--serif-kr); font-weight: 400; font-size: 13px;
    letter-spacing: 0.15em;
    color: var(--bg-deep);
    background: linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-deep));
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .chat-send:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(201,168,100,0.3); }
  .chat-send:disabled { opacity: 0.35; cursor: not-allowed; }
  .chat-error {
    margin-top: 12px; padding: 10px 14px;
    background: rgba(168,50,74,0.1);
    border-left: 2px solid var(--vermilion);
    color: var(--vermilion-light);
    font-family: var(--serif-kr); font-size: 13px;
  }

  /* ====== 추가 구매 ====== */
  .purchase { margin-top: 56px; padding-top: 48px; border-top: 1px solid var(--border); text-align: center; }
  .purchase-eyebrow { display: inline-flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .purchase-eyebrow .line { width: 24px; height: 1px; background: var(--vermilion); opacity: 0.6; }
  .purchase-eyebrow .text { font-family: var(--serif-tc); font-size: 11px; letter-spacing: 0.4em; color: var(--vermilion-light); }
  .purchase h3 { font-family: var(--serif-kr); font-weight: 300; font-size: 22px; color: var(--white-baekja); letter-spacing: 0.05em; margin-bottom: 8px; }
  .purchase-sub { font-family: var(--serif-kr); font-weight: 300; font-size: 13px; color: var(--text-secondary); margin-bottom: 28px; }
  .packs { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 540px; margin: 0 auto; }
  .pack {
    position: relative;
    padding: 24px 18px;
    background: rgba(10,10,18,0.5);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.4s ease;
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .pack:not(:disabled):hover { border-color: var(--gold); transform: translateY(-4px); box-shadow: 0 12px 32px rgba(201,168,100,0.12); }
  .pack.rec { border-color: var(--vermilion); border-width: 1.5px; }
  .pack.rec:hover { border-color: var(--vermilion-light); box-shadow: 0 12px 32px rgba(168,50,74,0.18); }
  .pack-rib { position: absolute; top: -1px; right: -1px; background: var(--vermilion); color: var(--white-baekja); font-family: var(--serif-tc); font-size: 11px; letter-spacing: 0.2em; padding: 4px 12px; }
  .pack-stamp { width: 56px; height: 56px; filter: drop-shadow(0 4px 10px rgba(168,50,74,0.3)); transition: transform 0.4s ease; }
  .pack:hover .pack-stamp { transform: rotate(-6deg); }
  .pack-name { font-family: var(--serif-kr); font-weight: 400; font-size: 17px; color: var(--white-baekja); letter-spacing: 0.05em; }
  .pack-price { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .pp-num { font-family: var(--serif-en); font-size: 24px; color: var(--gold-light); font-weight: 500; }
  .pp-unit { font-family: var(--serif-kr); font-size: 11px; color: var(--text-tertiary); }
  .pack-loading { font-family: var(--serif-kr); font-size: 11px; color: var(--gold-light); margin-top: 4px; }

  /* ====== 푸터 ====== */
  .result-foot { margin-top: 60px; padding-top: 28px; border-top: 1px solid var(--border); text-align: center; display: flex; flex-direction: column; gap: 8px; }
  .foot-meta { font-family: var(--serif-kr); font-weight: 300; font-size: 12px; color: var(--text-tertiary); letter-spacing: 0.05em; }
  .foot-meta strong { color: var(--gold-light); font-weight: 400; }

  /* ====== 공통 ====== */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  /* ====== 모바일 ====== */
  @media (max-width: 640px) {
    .result { padding: 80px 18px 40px; }
    .hero-name { font-size: 30px; }
    .hero-sfx { font-size: 18px; }
    .hero-bowl-wrap { max-width: 320px; }
    .seal-center { width: 110px; height: 110px; }
    .pillars { gap: 6px; }
    .pillar-value { font-size: 18px; }
    .ch-title { font-size: 22px; }
    .ch-bg-hanja { font-size: 170px; right: -30px; }
    .ch-block p, .ch-ai p { font-size: 14.5px; }
    .ch-ai { padding: 18px 18px 18px 46px; }
    .ch-ai-mark { left: 16px; }
    .packs { grid-template-columns: 1fr; max-width: 320px; }
    .finale-title { font-size: 22px; }
    .chat-input-wrap { padding: 14px 16px; }
    .chat-a { padding: 22px 28px 28px; }
    .chat-q { padding: 12px 14px; max-width: 90%; }
  }
  @media (max-width: 380px) {
    .pillars { grid-template-columns: 1fr 1fr; gap: 8px; }
  }
`;e.s(["default",0,function(){return(0,a.jsx)(t.Suspense,{fallback:(0,a.jsx)("div",{style:{padding:120,textAlign:"center",color:"#C9A864",fontFamily:"serif"},children:"운세당"}),children:(0,a.jsx)(y,{})})}])}]);