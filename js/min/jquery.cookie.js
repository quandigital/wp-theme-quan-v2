!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){function b(a){if(e.raw)return a;try{return decodeURIComponent(a.replace(d," "))}catch(b){}}function c(a){0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")),a=b(a);try{return e.json?JSON.parse(a):a}catch(c){}}var d=/\+/g,e=a.cookie=function(d,f,g){if(void 0!==f){if(g=a.extend({},e.defaults,g),"number"==typeof g.expires){var h=g.expires,i=g.expires=new Date;i.setDate(i.getDate()+h)}return f=e.json?JSON.stringify(f):String(f),document.cookie=[e.raw?d:encodeURIComponent(d),"=",e.raw?f:encodeURIComponent(f),g.expires?"; expires="+g.expires.toUTCString():"",g.path?"; path="+g.path:"",g.domain?"; domain="+g.domain:"",g.secure?"; secure":""].join("")}for(var j=d?void 0:{},k=document.cookie?document.cookie.split("; "):[],l=0,m=k.length;m>l;l++){var n=k[l].split("="),o=b(n.shift()),p=n.join("=");if(d&&d===o){j=c(p);break}d||void 0===(p=c(p))||(j[o]=p)}return j};e.defaults={},a.removeCookie=function(b,c){return void 0!==a.cookie(b)?(a.cookie(b,"",a.extend({},c,{expires:-1})),!0):!1}});