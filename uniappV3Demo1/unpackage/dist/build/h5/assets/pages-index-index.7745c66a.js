import{o as a,c as e,w as t,a as l,r as s,i,b as o,d,e as r,u,F as c,f as n,g as f,S as m,h as _,j as p,k as v,t as h,s as g,n as y,l as j,m as x}from"./index-21fe0425.js";import{_ as k,a as b}from"./theme-item.3335dc6b.js";import{o as w,a as F,r as z}from"./uni-app.es.dad21eae.js";import{_ as B}from"./uni-icons.9d1f85ef.js";import{_ as C}from"./uni-dateformat.bc5ce392.js";import{_ as I}from"./_plugin-vue_export-helper.1b428a4d.js";import{g as L}from"./apis.97d54c5e.js";const M=I({},[["render",function(o,d){const r=i;return a(),e(r,{class:"common-title"},{default:t((()=>[l(r,{class:"name"},{default:t((()=>[s(o.$slots,"left",{},void 0,!0)])),_:3}),l(r,{class:"custom"},{default:t((()=>[s(o.$slots,"custom",{},void 0,!0)])),_:3})])),_:3})}],["__scopeId","data-v-732c418a"]]),$=I({__name:"index",setup(s){let I=o();L("/homeBanner").then((a=>{I.value=a.data.data}));let $=o();L("/randomWall").then((a=>{$.value=a.data.data}));let D=o();L("/wallNewsList").then((a=>{D.value=a.data.data}));let G=o();return L("/classify",{select:!0}).then((a=>{G.value=a.data.data,console.log(a)})),w((a=>({title:"我的壁纸",path:"pages/index/index"}))),F((a=>({title:"我的壁纸",imageUrl:I.value[0].picurl}))),(s,o)=>{const w=z(f("custom-nav-bar"),k),F=j,L=x,N=m,P=i,S=z(f("uni-icons"),B),U=_,W=z(f("uni-dateformat"),C),q=z(f("common-title"),M),A=p,E=v,H=z(f("theme-item"),b);return a(),e(P,{class:"main pageBG"},{default:t((()=>[l(w,{title:"推荐"}),l(P,{class:"banner"},{default:t((()=>[l(N,{circular:"","indicator-dots":"","indicator-color":"rgba(255,255,255,0.5)","indicator-active-color":"#fff",autoplay:""},{default:t((()=>[(a(!0),d(c,null,r(u(I),(s=>(a(),e(L,{key:s._id},{default:t((()=>[l(F,{src:s.picurl,mode:"aspectFill"},null,8,["src"])])),_:2},1024)))),128))])),_:1})])),_:1}),l(P,{class:"notice"},{default:t((()=>[l(P,{class:"left"},{default:t((()=>[l(S,{type:"sound-filled",size:"20"}),l(U,null,{default:t((()=>[n("公告")])),_:1})])),_:1}),l(P,{class:"center"},{default:t((()=>[l(N,{vertical:"",autoplay:"",interval:"1500",duration:"300",circular:""},{default:t((()=>[(a(!0),d(c,null,r(u(D),(l=>(a(),e(L,{key:l._id},{default:t((()=>[n(h(l.title),1)])),_:2},1024)))),128))])),_:1})])),_:1}),l(P,{class:"right"},{default:t((()=>[l(S,{type:"right"})])),_:1})])),_:1}),l(P,{class:"select"},{default:t((()=>[l(q,null,{left:t((()=>[n("每日推荐")])),custom:t((()=>[l(P,{class:"date"},{default:t((()=>[l(S,{type:"calendar",size:"18"}),l(W,{date:Date.now(),format:"dd日"},null,8,["date"])])),_:1})])),_:1}),l(P,{class:"content"},{default:t((()=>[l(A,{"scroll-x":""},{default:t((()=>[(a(!0),d(c,null,r(u($),(s=>(a(),e(P,{class:"box",key:s._id,onClick:a=>{return e=s._id,g("classList",$.value),void y({url:"/pages/preview/preview?id="+e});var e}},{default:t((()=>[l(F,{src:s.smallPicurl,mode:"aspectFill"},null,8,["src"])])),_:2},1032,["onClick"])))),128))])),_:1})])),_:1}),l(P,{class:"theme"},{default:t((()=>[l(q,null,{left:t((()=>[n("专题精选")])),custom:t((()=>[l(E,{url:"",class:"more"},{default:t((()=>[n("More+")])),_:1})])),_:1}),l(P,{class:"content"},{default:t((()=>[(a(!0),d(c,null,r(u(G),(t=>(a(),e(H,{key:t._id,item:t},null,8,["item"])))),128)),l(H,{isMore:!0})])),_:1})])),_:1})])),_:1})])),_:1})}}},[["__scopeId","data-v-f0d10a7e"]]);export{$ as default};