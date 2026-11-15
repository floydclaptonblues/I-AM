import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
test('walk the current public encounter in a new browser context', async()=>{
 const browser=await chromium.launch();
 try {
 for(const width of [390,1366]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:768},isMobile:width===390,hasTouch:width===390});
  const page=await context.newPage();
  await page.goto('https://iam.monkeywithatypewriter.com/',{waitUntil:'networkidle'});
  const list=()=>page.locator('#question-list button').allTextContents();
  const ask=id=>page.locator('[data-question="'+id+'"]').click();
  const last=()=>page.locator('#answer-accessible').innerText();
  console.log('VISIT',width,'opening',await last(),await list());
  await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/fresh-live-'+width+'.png'});
  for(const [subject,route] of Object.entries({universe:['before-humans','other-lights','heard-the-others'],garden:[],god:['father-brighter','god-knows'],humanity:['upright','hands','purpose'],serpent:['lied','permission','believe']})){
   await page.locator('[data-subject="'+subject+'"]').click();
   console.log('VISIT',width,subject,'opened',await list());
   for(const id of route){await ask(id);console.log('VISIT',width,id,await last(),await list());}
   console.log('VISIT',width,subject,'end',await last(),await page.locator('#questions').innerText());
   await page.getByRole('button',{name:'Ask about something else',exact:true}).click();
  }
  assert.equal((await list()).length,5);await context.close();
 }
 } finally {await browser.close();}
});