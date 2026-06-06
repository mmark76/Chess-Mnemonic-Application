async function loadLibraries(){
  const res = await fetch('json/libraries_v.5.4.json');
  libs = await res.json();
  console.log('LIBS KEYS:', Object.keys(libs));
}
