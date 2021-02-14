parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Zuhq":[function(require,module,exports) {
var define;
var t;!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof t&&t.amd?t([],r):"object"==typeof exports?exports.AudioFeeder=r():e.AudioFeeder=r()}(window,function(){return function(t){var e={};function r(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(i,n,function(e){return t[e]}.bind(null,n));return i},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}([function(t,e){function r(t,e){if(t<1||t!==Math.round(t))throw"Invalid channel count for BufferQueue";this.channels=t,this.bufferSize=e,this.flush()}r.prototype.flush=function(){this._buffers=[],this._pendingBuffer=this.createBuffer(this.bufferSize),this._pendingPos=0},r.prototype.sampleCount=function(){var t=0;return this._buffers.forEach(function(e){t+=e[0].length}),t},r.prototype.createBuffer=function(t){for(var e=[],r=0;r<this.channels;r++)e[r]=new Float32Array(t);return e},r.prototype.validate=function(t){if(t.length!==this.channels)return!1;for(var e,r=0;r<t.length;r++){var i=t[r];if(!(i instanceof Float32Array))return!1;if(0==r)e=i.length;else if(i.length!==e)return!1}return!0},r.prototype.appendBuffer=function(t){if(!this.validate(t))throw"Invalid audio buffer passed to BufferQueue.appendBuffer";for(var e=t[0].length,r=this.channels,i=this._pendingPos,n=this._pendingBuffer,o=this.bufferSize,a=0;a<e;a++){for(var f=0;f<r;f++)n[f][i]=t[f][a];++i==o&&(this._buffers.push(n),i=this._pendingPos=0,n=this._pendingBuffer=this.createBuffer(o))}this._pendingPos=i},r.prototype.prependBuffer=function(t){if(!this.validate(t))throw"Invalid audio buffer passed to BufferQueue.prependBuffer";var e=this._buffers.slice(0);e.push(this.trimBuffer(this._pendingBuffer,0,this._pendingPos)),this.flush(),this.appendBuffer(t);for(var r=0;r<e.length;r++)this.appendBuffer(e[r])},r.prototype.nextBuffer=function(){if(this._buffers.length)return this._buffers.shift();var t=this.trimBuffer(this._pendingBuffer,0,this._pendingPos);return this._pendingBuffer=this.createBuffer(this.bufferSize),this._pendingPos=0,t},r.prototype.trimBuffer=function(t,e,r){var i=t[0].length,n=e+Math.min(r,i);if(0==e&&n>=i)return t;for(var o=[],a=0;a<this.channels;a++)o[a]=t[a].subarray(e,n);return o},t.exports=r},function(t,e,r){!function(){r(0);var e=r(2),i=r(4);function n(t){this._options=t||{},this._backend=null,this._resampleFractional=0,this._resampleLastSampleData=void 0,this._tempoChanger=null}n.prototype.rate=0,n.prototype.targetRate=0,n.prototype.channels=0,n.prototype.bufferSize=0,Object.defineProperty(n.prototype,"bufferDuration",{get:function(){return this.targetRate?this.bufferSize/this.targetRate:0}}),Object.defineProperty(n.prototype,"bufferThreshold",{get:function(){return this._backend?this._backend.bufferThreshold/this.targetRate:0},set:function(t){if(!this._backend)throw"Invalid state: AudioFeeder cannot set bufferThreshold before init";this._backend.bufferThreshold=Math.round(t*this.targetRate)}}),Object.defineProperty(n.prototype,"playbackPosition",{get:function(){return this._backend?this.getPlaybackState().playbackPosition:0}}),Object.defineProperty(n.prototype,"outputPlaybackPosition",{get:function(){return this._backend?this.getPlaybackState().outputPlaybackPosition:0}}),Object.defineProperty(n.prototype,"durationBuffered",{get:function(){return this._backend?this.getPlaybackState().samplesQueued/this.targetRate:0}}),Object.defineProperty(n.prototype,"muted",{get:function(){if(this._backend)return this._backend.muted;throw"Invalid state: cannot get mute before init"},set:function(t){if(!this._backend)throw"Invalid state: cannot set mute before init";this._backend.muted=t}}),n.prototype.mute=function(){this.muted=!0},n.prototype.unmute=function(){this.muted=!1},Object.defineProperty(n.prototype,"volume",{get:function(){if(this._backend)return this._backend.volume;throw"Invalid state: cannot get volume before init"},set:function(t){if(!this._backend)throw"Invalid state: cannot set volume before init";this._backend.volume=t}}),Object.defineProperty(n.prototype,"tempo",{get:function(){if(this._tempoChanger)return this._tempoChanger.getTempo();throw"Invalid state: cannot get tempo before init"},set:function(t){if(!this._tempoChanger)throw"Invalid state: cannot set tempo before init";this._tempoChanger.setTempo(t)}}),n.prototype.init=function(t,r){if(this.channels=t,this.rate=r,this._options.backendFactory)this._backend=this._options.backendFactory(t,r,this._options);else{if(!e.isSupported())throw"No supported backend";this._backend=new e(t,r,this._options)}this.targetRate=this._backend.rate,this.bufferSize=this._backend.bufferSize,this._tempoChanger=i({sampleRate:this.targetRate,numChannels:t,tempo:1}),this._backend.onstarved=function(){this.onstarved&&this.onstarved()}.bind(this),this._backend.onbufferlow=function(){this.onbufferlow&&this.onbufferlow()}.bind(this)},n.prototype._resample=function(t){var e=this.rate,r=this.channels,i=this._backend.rate,n=this._backend.channels;if(e==i&&r==n)return t;var o,a=[],f=t[0].length,u=this._resampleFractional,s=f*i/e+u,h=Math.floor(s),p=s-h;o=e<i?function(t,r,n,o){for(var a=function(e){return e<0?n&&n.length+e>0?n[n.length+e]:t[0]:t[e]},f=0;f<r.length;f++){var s,h=(f+1-u)*e/i-1,p=Math.floor(h),l=Math.ceil(h);s=p==l?a(p):a(p)*(l-h)+a(l)*(h-p),r[f]=o*s}}:function(t,e,r,i){for(var n=0;n<e.length;n++)e[n]=i*t[n*t.length/e.length|0]};var l=1;n>r&&(l=Math.SQRT1_2);for(var c=0;c<n;c++){var d=c;c>=r&&(d=0);var _=t[d],b=new Float32Array(h);o(_,b,this._resampleLastSampleData?this._resampleLastSampleData[d]:void 0,l),a.push(b)}return this._resampleFractional=p,this._resampleLastSampleData=t,a},n.prototype.bufferData=function(t){if(!this._backend)throw"Invalid state: AudioFeeder cannot bufferData before init";var e=this._resample(t);e=this._tempoChanger.process(e),this._backend.appendBuffer(e)},n.prototype.getPlaybackState=function(){if(this._backend){var t=this._backend.getPlaybackState();return t.outputPlaybackPosition=t.playbackPosition,t.playbackPosition=this._tempoChanger.mapOutputToInputTime(t.outputPlaybackPosition),t}throw"Invalid state: AudioFeeder cannot getPlaybackState before init"},n.prototype.waitUntilReady=function(t){if(!this._backend)throw"Invalid state: AudioFeeder cannot waitUntilReady before init";this._backend.waitUntilReady(t)},n.prototype.start=function(){if(!this._backend)throw"Invalid state: AudioFeeder cannot start before init";this._backend.start()},n.prototype.stop=function(){if(!this._backend)throw"Invalid state: AudioFeeder cannot stop before init";this._backend.stop()},n.prototype.flush=function(){if(this._resampleFractional=0,this._resampleLastSampleData=void 0,!this._backend)throw"Invalid state: AudioFeeder cannot flush before init";this._tempoChanger.flush(this.durationBuffered),this._backend.flush()},n.prototype.close=function(){this._backend&&(this._backend.close(),this._backend=null)},n.prototype.onstarved=null,n.prototype.onbufferlow=null,n.isSupported=function(){return!!Float32Array&&e.isSupported()},n.initSharedAudioContext=function(){return e.isSupported()?e.initSharedAudioContext():null},t.exports=n}()},function(t,e,r){!function(){var e=window.AudioContext||window.webkitAudioContext,i=r(0),n=r(3);function o(t,e,r){var n=r.audioContext||o.initSharedAudioContext();if(this._context=n,this.output=r.output||n.destination,this.rate=n.sampleRate,this.channels=2,r.bufferSize&&(this.bufferSize=0|r.bufferSize),this.bufferThreshold=2*this.bufferSize,this._bufferQueue=new i(this.channels,this.bufferSize),this._playbackTimeAtBufferTail=n.currentTime,this._queuedTime=0,this._delayedTime=0,this._dropped=0,this._liveBuffer=this._bufferQueue.createBuffer(this.bufferSize),n.createScriptProcessor)this._node=n.createScriptProcessor(this.bufferSize,0,this.channels);else{if(!n.createJavaScriptNode)throw new Error("Bad version of web audio API?");this._node=n.createJavaScriptNode(this.bufferSize,0,this.channels)}}o.prototype.bufferSize=4096,o.prototype.bufferThreshold=8192,o.prototype._volume=1,Object.defineProperty(o.prototype,"volume",{get:function(){return this._volume},set:function(t){this._volume=+t}}),o.prototype._muted=!1,Object.defineProperty(o.prototype,"muted",{get:function(){return this._muted},set:function(t){this._muted=!!t}}),o.prototype._audioProcess=function(t){var e,r,i,o,a;a="number"==typeof t.playbackTime?t.playbackTime:this._context.currentTime+this.bufferSize/this.rate;var f=this._playbackTimeAtBufferTail;if(f<a&&(this._delayedTime+=a-f),this._bufferQueue.sampleCount()<this.bufferSize&&this.onstarved&&this.onstarved(),this._bufferQueue.sampleCount()<this.bufferSize){for(e=0;e<this.channels;e++)for(i=t.outputBuffer.getChannelData(e),o=0;o<this.bufferSize;o++)i[o]=0;this._dropped++}else{var u=this.muted?0:this.volume,s=this._bufferQueue.nextBuffer();if(s[0].length<this.bufferSize)throw"Audio buffer not expected length.";for(e=0;e<this.channels;e++)for(r=s[e],this._liveBuffer[e].set(s[e]),i=t.outputBuffer.getChannelData(e),o=0;o<r.length;o++)i[o]=r[o]*u;this._queuedTime+=this.bufferSize/this.rate,this._playbackTimeAtBufferTail=a+this.bufferSize/this.rate,this._bufferQueue.sampleCount()<Math.max(this.bufferSize,this.bufferThreshold)&&this.onbufferlow&&n(this.onbufferlow.bind(this))}},o.prototype._samplesQueued=function(){return this._bufferQueue.sampleCount()+Math.floor(this._timeAwaitingPlayback()*this.rate)},o.prototype._timeAwaitingPlayback=function(){return Math.max(0,this._playbackTimeAtBufferTail-this._context.currentTime)},o.prototype.getPlaybackState=function(){return{playbackPosition:this._queuedTime-this._timeAwaitingPlayback(),samplesQueued:this._samplesQueued(),dropped:this._dropped,delayed:this._delayedTime}},o.prototype.waitUntilReady=function(t){t()},o.prototype.appendBuffer=function(t){this._bufferQueue.appendBuffer(t)},o.prototype.start=function(){this._node.onaudioprocess=this._audioProcess.bind(this),this._node.connect(this.output),this._playbackTimeAtBufferTail=this._context.currentTime},o.prototype.stop=function(){if(this._node){var t=this._timeAwaitingPlayback();if(t>0){var e=Math.round(t*this.rate),r=this._liveBuffer?this._liveBuffer[0].length:0;e>r?(this._bufferQueue.prependBuffer(this._liveBuffer),this._bufferQueue.prependBuffer(this._bufferQueue.createBuffer(e-r))):this._bufferQueue.prependBuffer(this._bufferQueue.trimBuffer(this._liveBuffer,r-e,e)),this._playbackTimeAtBufferTail-=t}this._node.onaudioprocess=null,this._node.disconnect()}},o.prototype.flush=function(){this._bufferQueue.flush()},o.prototype.close=function(){this.stop(),this._context=null},o.prototype.onstarved=null,o.prototype.onbufferlow=null,o.isSupported=function(){return!!e},o.sharedAudioContext=null,o.initSharedAudioContext=function(){if(!o.sharedAudioContext&&o.isSupported()){var t,r=new e;if(r.createScriptProcessor)t=r.createScriptProcessor(1024,0,2);else{if(!r.createJavaScriptNode)throw new Error("Bad version of web audio API?");t=r.createJavaScriptNode(1024,0,2)}t.connect(r.destination),t.disconnect(),o.sharedAudioContext=r}return o.sharedAudioContext},t.exports=o}()},function(t,e){t.exports=function(){if(void 0!==window.setImmediate)return window.setImmediate;if(window&&window.postMessage){var t=[];return window.addEventListener("message",function(e){if(e.source===window){var r=e.data;if("object"==typeof r&&r.nextTickBrowserPingMessage){var i=t.pop();i&&i()}}}),function(e){t.push(e),window.postMessage({nextTickBrowserPingMessage:!0},document.location.toString())}}return function(t){setTimeout(t,0)}}()},function(t,e,r){var i;window,i=function(){return function(t){var e={};function r(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(i,n,function(e){return t[e]}.bind(null,n));return i},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}([function(t,e){var r={float_array:function(t){return new Float32Array(t)},blit:function(t,e,r,i,n){r.set(t.subarray(e,e+n),i)}};t.exports=r},function(t,e,r){var i,n;i=r(0),n=r(2),t.exports=function(t){var e=(t=t||{}).sampleRate||44100,r=t.wsizeLog||11,o=t.tempo||1,a=(t.numChannels,Math.pow(2,50/1200)-1),f=1<<r,u=n(r),s=1<<r-2;s-=s%100;for(var h=i.float_array(f+s+5),p=i.float_array(f+s+5),l=s,c=s,d=i.float_array(f),_=0;_<f;_++)d[_]=.5*(1-Math.cos(2*Math.PI*_/f));var b=1+(f>>1),m=i.float_array(b),v=i.float_array(b),y=i.float_array(b),g=i.float_array(b),w=i.float_array(b),k=i.float_array(b),S=1+(b>>1),P=[0,0],B=[],M=[],T=[],x=[];for(_=0;_<2;_++)B.push(i.float_array(S)),M.push(i.float_array(S)),T.push(i.float_array(S)),x.push(i.float_array(b));var A=i.float_array(S),I=i.float_array(S),C=0,j=0,O=[{in_time:0,out_time:0,tempo:o}],z=0,Q=0,F=1,R=0,N=0,D=0,L=0,E={mapOutputToInputTime:function(t){for(var e=O.length-1;t<O[e].out_time&&e>0;)e--;var r=O[e];return r.in_time+r.tempo*(t-r.out_time)},flush:function(t){R=0,P=[0,0],Q=0,L=0,D=0;for(var e=0;e<2;e++)for(var r=0;r<b;r++)x[e][r]=0;for(e=0;e<h.length;e++)h[e]=0;for(e=0;e<p.length;e++)p[e]=0;if(t){j=Math.max(0,j-t),C=E.mapOutputToInputTime(j);for(var i=O.length-1;j<=O[i].out_time&&i>=0;)O.pop(),i--;O.push({in_time:C,out_time:j,tempo:o})}},getTempo:function(){return o},setTempo:function(t){l=c=s,t>=1?c=Math.round(l/t):l=Math.round(c*t),N=(1/t-1*c/l)*l,F=function(t,e){for(var r=t.length/e|0,i=0,n=0;n<r;n++)i+=t[n*e];return.9/i}(d,c),o=t;var e=O[O.length-1];e.out_time==j?e.tempo=t:O.push({in_time:C,out_time:j,tempo:t})}};E.flush(0),E.setTempo(o);var J=function(t,e,r){var i=Math.floor(r),n=i%2==1?-1:1;return Math.atan2(n*(e[i]-e[i+1]),n*(t[i]-t[i+1]))},U=function(t,e,r,i,n){var o=2*Math.PI/f*.5*(i+e)*l;return(function(t){return t-2*Math.PI*Math.round(t/(2*Math.PI))}(t-r-o)+o)*n},q=function(t,e,r,i,n,o){for(var u=t%2,s=1-u,h=x[s],p=P[s],l=B[s],c=M[s],d=T[s],_=x[u],b=1;b<_.length;b++)_[b]=e[b]*e[b]+r[b]*r[b];var m=B[u],v=P[u]=function(t,e){for(var r=0,i=0;i<t.length;i++)t[i]>r&&(r=t[i]);var n=1e-8*r,o=1,f=1;for(e[0]=1,i=2;i<t.length;i++){var u=i*a;if(t[i]>n&&t[i]>t[i-1]&&t[i]>=t[i+1]){var s=i+(t[i-1]-t[i+1])/(2*(t[i-1]-2*t[i]+t[i+1]));s-e[o-1]>u?(e[o++]=s,f=i):t[i]>t[f]&&(e[o-1]=s,f=i)}}return o}(_,m),y=M[u],g=T[u];if(0!=t&&0!=v){var w=0;for(D=0;D<v;D++){for(L=m[D];m[D]>l[w]&&w!=p;)++w;var k=w;w>0&&L-l[w-1]<l[w]-L&&(k=w-1);var S=L*a;if(Math.abs(l[k]-L)<S&&h[Math.round(l[k])]>.1*_[Math.round(L)]){var C=J(e,r,L),j=c[k]+d[k]+U(C,L,c[k],l[k],o)-C;y[D]=C,g[D]=j,A[D]=Math.cos(j),I[D]=Math.sin(j)}else y[D]=J(e,r,L),g[D]=0,A[D]=1,I[D]=0}m[v]=2*f;var O=m[k=0],z=m[k+1],Q=A[k],F=I[k];for(b=1;b<e.length-1;b++){b>=O&&b-O>z-b&&(O=m[++k],z=m[k+1],Q=A[k],F=I[k]);var R=e[b]*Q-r[b]*F,N=e[b]*F+r[b]*Q;e[b]=R,r[b]=N}}else for(var D=0;D<v;D++){var L=m[D];c[D]=d[D]=J(e,r,L)}},G=function(){var t=0|(R+=2*N);R-=t;for(var e=0;e<f;e++)u.m_re[e]=d[e]*h[e],u.m_im[e]=d[e]*h[l+e];i.blit(h,2*l,h,0,f-l),u.inplace(!1),u.unpack(m,v,y,g),q(z,m,v,0,0,1*c/l),q(z+1,y,g,0,0,1*(c+t)/l),i.blit(y,0,w,0,b),i.blit(g,0,k,0,b),u.repack(m,v,y,g),u.inplace(!0);var r=p.length;for(i.blit(p,Q,p,0,r-Q),e=r-Q;e<r;e++)p[e]=0;var n=0,o=F;for(e=0;e<c;e++)Math.abs(2*u.m_re[e])>n&&(n=Math.abs(2*u.m_re[e]));for(e=0;e<f-c;e++)Math.abs(u.m_re[e+c+t]+u.m_im[e])>n&&(n=Math.abs(u.m_re[e+c+t]+u.m_im[e]));for(e=f-c;e<f;e++)Math.abs(2*u.m_im[e])>n&&(n=Math.abs(2*u.m_im[e]));var a=1/Math.floor(1*f/(2*c));for(o*n>a&&(o=a/n),e=0;e<f;e++)p[e]+=o*u.m_re[e],p[e+c+t]+=o*u.m_im[e];return z+=2,Q=2*c+t};return E.process=function(t){var r=t[0].length,n=t[0];if(t.length>1){n=i.float_array(t[0].length);for(var a=1/t.length,u=0;u<t.length;u++)for(var s=0;s<r;s++)n[s]+=a*t[u][s]}if(1==o){if(L+D>0){var d=L+D+r,_=[];for(u=0;u<t.length;u++){var b=i.float_array(d);i.blit(p,0,b,0,L),i.blit(h,0,b,L,D),i.blit(t[u],0,b,L+D,r),_.push(b)}E.flush(0),r=d,t=_}return C+=r/e,j+=r/e,t}var m=D+r-(f-l),v=2*Math.floor(Math.max(0,m)/(2*l)),y=L+c*v+Math.floor(R+N*v);L>y&&(y=L);var g=i.float_array(y);i.blit(p,0,g,0,L);for(var w=0,k=L,S=0,P=0;;){var B=f+l-D;if(w+B>r){i.blit(n,w,h,D,r-w),D+=r-w,w=r;break}B<=0?D-=2*l:(i.blit(n,w,h,D,B),w+=B,D=f-l),P=G(),C+=2*l/e,j+=P/e,(S=k+P-y)<0&&(S=0),i.blit(p,0,g,k,P-S),k+=P}i.blit(p,P-S,p,0,S),L=S;var M=[];for(u=0;u<t.length;u++)M.push(g);return M},E}},function(t,e,r){"use strict";var i=r(0);t.exports=function(t){for(var e=1<<t,r={m_logN:t,m_N:e,m_invN:1/e,m_re:i.float_array(e),m_im:i.float_array(e),m_revTgt:new Array(e)},n=0;n<e;n++){for(var o=n,a=0,f=0;f<t;f++)a<<=1,a|=1&o,o>>=1;r.m_revTgt[n]=a}r.twiddleRe=i.float_array(r.m_logN),r.twiddleIm=i.float_array(r.m_logN);for(var u=1,s=0;s<r.m_logN;s++){var h=2*u*Math.PI*r.m_invN;r.twiddleRe[s]=Math.cos(h),r.twiddleIm[s]=Math.sin(h),u<<=1}r.inplace=function(t){var e=r.m_re,i=r.m_im,n=r.m_N,o=r.m_logN,a=n>>1,f=n>>1,u=n;if(t)for(var s=1/n,h=0;h<n;h++)e[h]*=s,i[h]*=s;for(var p=0;p<o;p++){var l=r.twiddleRe[p],c=r.twiddleIm[p];t||(c*=-1);for(var d=0;d<n;){for(var _=d,b=d+f,m=1,v=0,y=0;y<a;y++){var g=e[_],w=i[_],k=e[b],S=i[b];e[_]=g+k,i[_]=w+S,k=g-k,S=w-S,e[b]=k*m-S*v,i[b]=k*v+S*m,_++,b++;var P=m;m=m*l-v*c,v=P*c+v*l}d+=u}a>>=1,f>>=1,u>>=1}for(var B,M,T=r.m_revTgt,x=0;x<n;x++)T[x]>x&&(M=e[B=T[x]],e[B]=e[x],e[x]=M,M=i[B],i[B]=i[x],i[x]=M)};var p=e>>1;return r.unpack=function(t,i,n,o){t[0]=r.m_re[0],n[0]=r.m_im[0],i[0]=o[0]=0,t[p]=r.m_re[p],n[p]=r.m_im[p],i[p]=o[p]=0;for(var a=1;a<p;a++)t[a]=(r.m_re[a]+r.m_re[e-a])/2,i[a]=(r.m_im[a]-r.m_im[e-a])/2,n[a]=(r.m_im[a]+r.m_im[e-a])/2,o[a]=(-r.m_re[a]+r.m_re[e-a])/2},r.repack=function(t,i,n,o){r.m_re[0]=t[0],r.m_im[0]=n[0],r.m_re[p]=t[p],r.m_im[p]=n[p];for(var a=1;a<p;a++)r.m_re[a]=t[a]-o[a],r.m_im[a]=i[a]+n[a],r.m_re[e-a]=t[a]+o[a],r.m_im[e-a]=-i[a]+n[a]},r}}])},t.exports=i()}])});
},{}],"Focm":[function(require,module,exports) {
"use strict";var e=t(require("audio-feeder"));function t(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return fetch(`https://c.l3.pm/?${encodeURIComponent(e)}`,t)}async function a(){const t=await o("https://homestuck.bandcamp.com/track/megalovania-2"),a=await t.text(),n=(new DOMParser).parseFromString(a,"text/html"),s=JSON.parse(n.querySelector("[data-tralbum]").dataset.tralbum).trackinfo[0].file["mp3-128"],l=await o(s),r=await l.arrayBuffer(),d=new AudioContext({sampleRate:44100});console.time("decoding");const c=await d.decodeAudioData(r);console.timeEnd("decoding");let i=new e.default;i.init(2,44100),i.bufferThreshold=3;let u=new Worker("/worker.18aaa347.js"),f=!1,g=!1;u.onmessage=(async e=>{const t=e.data;if(!t)return console.log("done encoding"),i.onbufferlow=(()=>{}),void(i.onstarved=(()=>{console.log("done playing"),i.stop()}));console.time("decoding");const o=await d.decodeAudioData(t);if(console.timeEnd("decoding"),i.bufferData([o.getChannelData(0),o.getChannelData(1)]),g=!1,f)!g&&i.durationBuffered<i.bufferThreshold&&(console.log("feeder wants more, requesting"),g=!0,u.postMessage(null));else{const e=document.getElementById("play");e.addEventListener("click",()=>{i.start(),i.onbufferlow=function(){console.log("buffer low"),g?console.log("already requested"):(console.log("requesting"),g=!0,u.postMessage(null))}},{once:!0}),e.disabled=!1,f=!0}}),u.postMessage([c.getChannelData(0),c.getChannelData(1)])}a();
},{"audio-feeder":"Zuhq","./worker.js":[["worker.18aaa347.js","iltZ"],"worker.18aaa347.js.map","iltZ"]}]},{},["Focm"], null)
//# sourceMappingURL=/src.fd534161.js.map