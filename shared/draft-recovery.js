/* Kryzna Learn — local autosave & draft recovery for the material editor */
(function(){
  function init(){
    const form=document.getElementById('form'),editor=document.getElementById('konten');
    if(!form||!editor) return;
    const $=id=>document.getElementById(id);
    const idField=$('id'),title=$('judul'),description=$('deskripsi'),category=$('kategori'),msg=$('msg');
    let userId='guest',timer=null,restoring=false;
    const materialId=()=>idField?.value||new URLSearchParams(location.search).get('id')||'new';
    const key=()=>`kryzna-learn:draft:${userId}:${materialId()}`;
    const newKey=()=>`kryzna-learn:draft:${userId}:new`;
    const read=()=>{try{return JSON.parse(localStorage.getItem(key())||'null')}catch{return null}};
    const snapshot=()=>({judul:title?.value||'',deskripsi:description?.value||'',kategori:category?.value||'',konten:editor.innerHTML||'',savedAt:new Date().toISOString()});
    const same=(a,b)=>a&&b&&a.judul===b.judul&&a.deskripsi===b.deskripsi&&a.kategori===b.kategori&&a.konten===b.konten;
    function status(text){if(msg){msg.className='status';msg.textContent=text}}
    function saveLocal(){
      if(restoring) return;
      const data=snapshot();
      if(!data.judul&&!data.deskripsi&&!data.konten) return;
      localStorage.setItem(key(),JSON.stringify(data));
      status('✓ Draft tersimpan otomatis di perangkat');
    }
    function clearLocal(){
      localStorage.removeItem(key());
      localStorage.removeItem(newKey());
    }
    function schedule(){clearTimeout(timer);timer=setTimeout(saveLocal,900)}
    async function setupUser(){
      try{const {data:{user}}=await window.supabaseClient.auth.getUser();userId=user?.id||'guest'}catch{}
      recover();
    }
    function recover(){
      const draft=read()||(()=>{try{return JSON.parse(localStorage.getItem(newKey())||'null')}catch{return null}})();
      if(!draft) return;
      const current=snapshot();
      if(same(draft,current)){clearLocal();return}
      const when=draft.savedAt?new Date(draft.savedAt).toLocaleString('id-ID'):'';
      if(!confirm(`Ditemukan draft lokal${when?' dari '+when:''}. Pulihkan draft ini?`)) return;
      restoring=true;
      if(title) title.value=draft.judul||'';
      if(description) description.value=draft.deskripsi||'';
      if(category) category.value=draft.kategori||'Materi';
      editor.innerHTML=draft.konten||'';
      restoring=false;
      editor.dispatchEvent(new Event('input',{bubbles:true}));
      status('✓ Draft lokal dipulihkan');
    }
    [title,description,category,editor].filter(Boolean).forEach(el=>el.addEventListener('input',schedule));
    category?.addEventListener('change',schedule);
    new MutationObserver(()=>{
      const text=msg?.textContent||'';
      if(text==='Draft tersimpan.'||text==='Materi dikirim ke Review.') clearLocal();
    }).observe(msg,{childList:true,characterData:true,subtree:true});
    window.addEventListener('beforeunload',()=>{clearTimeout(timer);saveLocal()});
    if(window.supabaseClient) setupUser();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
