(function () {
  'use strict';
  const API = 'https://newsletter-api.maxwellgrey014.workers.dev/subscribe';
  const pending = new WeakSet();
  function trackingPayload(overrides) {
    const params = new URLSearchParams(window.location.search);
    const base = {source:'doac_site',formId:'unknown-form',context:'inline-signup',pagePath:window.location.pathname,pageUrl:window.location.origin+window.location.pathname,referrer:document.referrer||null,touchpoints:[window.location.pathname],utm:{source:params.get('utm_source'),medium:params.get('utm_medium'),campaign:params.get('utm_campaign'),content:params.get('utm_content'),term:params.get('utm_term')}};
    Object.entries(overrides||{}).forEach(([key,value])=>{if(value!==undefined)base[key]=value;});
    return base;
  }
  async function submit(options) {
    const email = String(options?.email||'').trim();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return {ok:false,status:0,data:{error:'Please enter a valid email address.'}};
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(),12000);
    try {
      const response = await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...trackingPayload(options),email}),signal:controller.signal});
      let data;try{data=await response.json();}catch{return {ok:false,status:response.status,data:{error:'The signup service returned an unexpected response. Please try again.'}};}
      const duplicate = response.status===409 || data.alreadySubscribed===true;
      const accepted = (response.ok || response.status===409) && !data.error && (duplicate || typeof data.message==='string' || data.success===true);
      return {ok:accepted,status:response.status,data:accepted?{...data,message:duplicate?'You are already subscribed.':'You’re subscribed. Thanks for joining the edit.'}:{error:response.status===429?'Too many attempts. Please try again later.':'We couldn’t confirm your signup. Please try again.'}};
    } catch {return {ok:false,status:0,data:{error:'We couldn’t reach the signup service. Please try again.'}};}
    finally{clearTimeout(timer);}
  }
  async function handle(input,button,message,options,form) {
    if(!input || pending.has(input))return false;
    const email=input.value.trim();
    const set=(ok,text)=>{if(message){message.textContent=text;message.style.color=options?.colors?.[ok?'success':'error']|| (ok?'#46712b':'#b63328');}};
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){set(false,'Please enter a valid email address.');input.focus();return false;}
    pending.add(input);const label=button?.textContent;
    if(button){button.disabled=true;button.textContent=options?.loadingText||'Subscribing…';}
    set(true,'');
    try {
      const result=await submit({email,source:options?.source,formId:options?.formId,context:options?.context,touchpoints:options?.touchpoints});
      if(result.ok){input.value='';if(form && options?.successMode==='replace-form'){const p=document.createElement('p');p.textContent=result.data.message;p.setAttribute('role','status');form.replaceWith(p);}else set(true,result.data.message);}
      else{set(false,result.data.error);if(!message && options?.errorMode==='alert')window.alert(result.data.error);}
    }finally{pending.delete(input);if(button){button.disabled=false;button.textContent=label||options?.resetText||'Subscribe';}}
    return false;
  }
  function handleFormSubmit(form,options={}){return handle(form?.querySelector('input[type="email"],input[name="email"]'),form?.querySelector('button[type="submit"],button'),document.getElementById(options.messageId),options,form);}
  function handleBoxSignup(options={}){return handle(document.getElementById(options.emailInputId),document.querySelector(options.buttonSelector||'button'),document.getElementById(options.messageId),options);}
  window.DOACNewsletter={trackingPayload,submit,handleFormSubmit,handleBoxSignup};
})();
