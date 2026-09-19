import { withSupabase } from 'npm:@supabase/server'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,x-client-info,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS'}
const out=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{...cors,'Content-Type':'application/json'}})
const safe=(qs:any[])=>qs.map(q=>({id:q.id,code:q.question_code,text:q.question_text,explanation:q.explanation,difficulty:q.difficulty,points:q.points,options:(q.exam_question_options||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order).map((o:any)=>({id:o.id,key:o.option_key,text:o.option_text}))}))
export default {fetch:withSupabase({auth:'user'},async(req,ctx)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:cors}); if(req.method!=='POST') return out({error:'Method not allowed'},405)
 const body=await req.json().catch(()=>null); const uid=ctx.user?.id; if(!uid||!body) return out({error:'Autentikasi dan payload diperlukan.'},400)
 const db=ctx.supabaseAdmin
 if(body.action==='start'){
  const {data:exam,error:ee}=await db.from('exams').select('id,title,description,duration_minutes,passing_score,category_id,exam_categories(name,label)').eq('id',body.examId).eq('is_published',true).maybeSingle()
  if(ee)return out({error:ee.message},400); if(!exam)return out({error:'Ujian tidak ditemukan.'},404)
  const {data:old}=await db.from('exam_attempts').select('id,started_at,status').eq('exam_id',exam.id).eq('user_id',uid).eq('status','in_progress').order('started_at',{ascending:false}).limit(1).maybeSingle()
  if(old&&Date.now()<new Date(old.started_at).getTime()+exam.duration_minutes*60000){return await build(db,exam,old.id)}
  if(old)await db.from('exam_attempts').update({status:'expired',submitted_at:new Date().toISOString()}).eq('id',old.id)
  const {data:qs,error:qe}=await db.from('exam_questions').select('id,question_code,question_text,explanation,difficulty,points,sort_order,exam_question_options(id,option_key,option_text,sort_order)').eq('exam_id',exam.id).order('sort_order')
  if(qe)return out({error:qe.message},400); if(!qs?.length)return out({error:'Ujian belum memiliki soal.'},400)
  const {data:a,error:ae}=await db.from('exam_attempts').insert({exam_id:exam.id,user_id:uid,total_questions:qs.length}).select('id,started_at,status,total_questions').single()
  if(ae)return out({error:ae.message},400); return out({exam,attempt:a,questions:safe(qs),deadline:new Date(new Date(a.started_at).getTime()+exam.duration_minutes*60000).toISOString()})
 }
 if(body.action==='result'){
  const {data:a,error:ae}=await db.from('exam_attempts').select('id,exam_id,user_id,started_at,submitted_at,status,score,correct_count,total_questions,passed,exams(title,passing_score)').eq('id',body.attemptId).eq('user_id',uid).maybeSingle()
  if(ae)return out({error:ae.message},400); if(!a)return out({error:'Hasil tidak ditemukan.'},404); if(a.status==='in_progress')return out({error:'Ujian belum dikumpulkan.'},409)
  const {data:qs,error:qe}=await db.from('exam_questions').select('id,question_text,explanation,points,sort_order,exam_question_options(id,option_key,option_text,sort_order),exam_answer_keys(correct_option_id)').eq('exam_id',a.exam_id).order('sort_order')
  if(qe)return out({error:qe.message},400)
  const {data:ans,error:an}=await db.from('exam_answers').select('question_id,selected_option_id').eq('attempt_id',a.id); if(an)return out({error:an.message},400)
  const am=new Map((ans||[]).map((x:any)=>[x.question_id,x.selected_option_id]))
  const details=(qs||[]).map((q:any)=>{const key=q.exam_answer_keys?.[0]?.correct_option_id;const selected=am.get(q.id)||null;const options=(q.exam_question_options||[]).sort((x:any,y:any)=>x.sort_order-y.sort_order).map((o:any)=>({id:o.id,key:o.option_key,text:o.option_text}));const so=options.find((o:any)=>o.id===selected);const co=options.find((o:any)=>o.id===key);return {id:q.id,text:q.question_text,explanation:q.explanation,points:q.points,selectedOptionId:selected,selectedKey:so?.key||null,correctOptionId:key,correctKey:co?.key||null,isCorrect:selected===key,options}})
  return out({attempt:{id:a.id,startedAt:a.started_at,submittedAt:a.submitted_at,status:a.status,score:a.score,correctCount:a.correct_count,totalQuestions:a.total_questions,passed:a.passed,passingScore:(Array.isArray(a.exams)?a.exams[0]:a.exams)?.passing_score},questions:details})
 }
 if(body.action==='submit'){
  const {data:a,error:ae}=await db.from('exam_attempts').select('id,exam_id,user_id,started_at,status,total_questions,exams(title,duration_minutes,passing_score)').eq('id',body.attemptId).eq('user_id',uid).maybeSingle()
  if(ae)return out({error:ae.message},400); if(!a||a.status!=='in_progress')return out({error:'Percobaan ujian tidak aktif.'},409)
  const ex=Array.isArray(a.exams)?a.exams[0]:a.exams
  const expired=Date.now()>new Date(a.started_at).getTime()+Number(ex.duration_minutes)*60000
  const {data:qs,error:qe}=await db.from('exam_questions').select('id').eq('exam_id',a.exam_id); if(qe)return out({error:qe.message},400)
  const ids=new Set((qs||[]).map((q:any)=>q.id)); const uniq=new Map((body.answers||[]).filter((x:any)=>ids.has(x.questionId)).map((x:any)=>[x.questionId,x.optionId||null]))
  const rows=[...uniq.entries()].map(([questionId,selected_option_id])=>({attempt_id:a.id,question_id:questionId,selected_option_id}))
  const {data:keys,error:ke}=await db.from('exam_answer_keys').select('question_id,correct_option_id').in('question_id',[...ids]); if(ke)return out({error:ke.message},400)
  const km=new Map((keys||[]).map((x:any)=>[x.question_id,x.correct_option_id])); const correct=rows.reduce((n:any,x:any)=>n+(km.get(x.question_id)===x.selected_option_id?1:0),0)
  const total=qs?.length||0,score=total?Number(((correct/total)*100).toFixed(2)):0,passed=!expired&&score>=Number(ex.passing_score)
  if(rows.length){const {error:e}=await db.from('exam_answers').upsert(rows,{onConflict:'attempt_id,question_id'});if(e)return out({error:e.message},400)}
  const {error:u}=await db.from('exam_attempts').update({submitted_at:new Date().toISOString(),score,correct_count:correct,total_questions:total,passed,status:expired?'expired':'submitted'}).eq('id',a.id).eq('user_id',uid)
  if(u)return out({error:u.message},400); return out({attemptId:a.id,score,correctCount:correct,totalQuestions:total,passed,status:expired?'expired':'submitted',passingScore:Number(ex.passing_score)})
 }
 return out({error:'Action tidak dikenal.'},400)
})}
async function build(db:any,exam:any,id:string){const {data:qs,error}=await db.from('exam_questions').select('id,question_code,question_text,explanation,difficulty,points,sort_order,exam_question_options(id,option_key,option_text,sort_order)').eq('exam_id',exam.id).order('sort_order');if(error)return out({error:error.message},400);const {data:a}=await db.from('exam_attempts').select('id,started_at,status,total_questions').eq('id',id).single();if(!a)return out({error:'Percobaan tidak ditemukan.'},404);return out({exam,attempt:a,questions:safe(qs||[]),deadline:new Date(new Date(a.started_at).getTime()+exam.duration_minutes*60000).toISOString()})}