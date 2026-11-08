'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Abrir menú'); }
menuButton.addEventListener('click',()=>{ const expanded=menuButton.getAttribute('aria-expanded')==='true'; navigation.classList.toggle('is-open',!expanded); menuButton.setAttribute('aria-expanded',String(!expanded)); menuButton.setAttribute('aria-label',expanded?'Abrir menú':'Cerrar menú'); });
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
const applications = [
{title:'Dale espacio a lo que sí necesita de tu equipo.',description:'Automatiza tareas repetitivas y conecta los pasos de tu operación, desde la recepción de información hasta su validación y registro.',flow:['Información','Validación + IA','Acción']},
{title:'Convierte información dispersa en decisiones mejor informadas.',description:'Conecta fuentes de información y facilita la consulta de datos empresariales para identificar patrones, preparar reportes y dar seguimiento a tu operación.',flow:['Datos','Análisis + IA','Hallazgos']},
{title:'Acompaña cada oportunidad con un mejor seguimiento.',description:'Organiza la información de prospectos, apoya la preparación de respuestas y coordina el seguimiento comercial con las herramientas de tu equipo.',flow:['Oportunidad','Asistencia + IA','Seguimiento']},
{title:'El conocimiento de tu empresa, más cerca de tu equipo.',description:'Facilita la consulta de documentos y procedimientos mediante asistentes conectados a fuentes autorizadas, con acceso definido según cada usuario.',flow:['Documentos','Consulta + IA','Respuesta']}
];
const tabs=Array.from(document.querySelectorAll('[role="tab"]'));
function selectTab(index,focus=false){const item=applications[index];tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});document.querySelector('#case-title').textContent=item.title;document.querySelector('#case-description').textContent=item.description;const flow=document.querySelector('#case-flow');flow.replaceChildren();item.flow.forEach((label,i)=>{if(i){const arrow=document.createElement('b');arrow.textContent='→';arrow.setAttribute('aria-hidden','true');flow.append(arrow);}const node=document.createElement('span');node.textContent=label;if(i===1)node.className='flow-active';flow.append(node);});document.querySelector('#application-panel').setAttribute('aria-labelledby',`tab-${index}`);if(focus)tabs[index].focus();}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(index));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowDown')next=(index+1)%tabs.length;else if(event.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();selectTab(next,true);});});
const contactForm = document.querySelector('#brief-form');
const contactAddress = 'contacto@tenoal.com';
function prepareBrief() {
  const data = new FormData(contactForm);
  return {company:String(data.get('company')).trim(),body:[
    'SOLICITUD DE DIAGNÓSTICO INICIAL', 'Tenoal · Estrategia e IA', '',
    `Nombre: ${String(data.get('name')).trim()}`,
    `Empresa: ${String(data.get('company')).trim()}`,
    `Correo: ${String(data.get('email')).trim()}`,
    `Interés: ${data.get('service')}`,
    `Presupuesto orientativo: ${String(data.get('budget') || '').trim() || 'Por definir'}`,
    '', 'Desafío empresarial:', String(data.get('challenge')).trim(), '',
    'Me gustaría explorar una solución a la medida de mi empresa.',
    'La conversación inicial y la propuesta son gratuitas y sin compromiso.'
  ].join('\n')};
}
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const brief = prepareBrief();
  const subject = `Diagnóstico inicial · ${brief.company}`;
  const mailto = `mailto:${contactAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief.body)}`;
  window.location.href = mailto;
  document.querySelector('#form-status').textContent = 'Revisa el borrador y envíalo desde tu aplicación de correo. Si no se abrió, descarga el resumen y compártelo a contacto@tenoal.com. Tu solicitud aún no se ha enviado desde el sitio.';
});
document.querySelector('#download-brief').addEventListener('click', () => {
  if (!contactForm.reportValidity()) return;
  const brief = prepareBrief();
  const url = URL.createObjectURL(new Blob(['\ufeff', brief.body], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'solicitud-diagnostico-tenoal.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url),10000);
  document.querySelector('#form-status').textContent = 'Tu resumen está listo para descargar. Envíalo a contacto@tenoal.com para iniciar la conversación.';
});
