/* Kryzna Learn — shared content activity helper */
(function(){
  window.kryznaLogContent = async function({action, entityId=null, description='', metadata={}}={}){
    try{
      const db=window.supabaseClient;
      if(!db||!action) return {error:new Error('Logger belum tersedia')};
      const {data:{user}}=await db.auth.getUser();
      if(!user) return {error:null};
      return await db.from('content_activity_logs').insert({actor_user_id:user.id,action,entity_type:'materi',entity_id:entityId,description,metadata});
    }catch(error){
      console.warn('Content activity log gagal:',error);
      return {error};
    }
  };
})();
