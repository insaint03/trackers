const assert = (condition, message)=>{
    if(!condition) {
        throw new Error(message);
    } 
    return true;
}
const pass = (message)=>assert(true, message);
const fail = (message)=>assert(false, message);

export default [
    // should pass the init
    {
        title: 'Shall pass', 
        desc: 'Should pass the test', 
        test: ()=>pass('This shall pass'),
    },
    {
        title: 'Shall not pass',
        desc: 'This test should fail',
        test: ()=>fail('You shall not pass'),
    },
    // test GTM container embeded
    {
        title: 'GTM container', 
        desc: 'Whether GTM container has loaded', 
        test:()=>{
            const src_prop = 'googletagmanager.com/gtm.js?id=GTM-';
            return assert(
                document.querySelector(`script[src*="${src_prop}"]`), 
                'GTM container not found'
            );
        }
    },
    {
        title: 'dataLayer ready', 
        desc: 'Whether dataLayer is ready', 
        test: ()=>{
            return new Promise((resolve)=>{
                assert(Array.isArray(window.dataLayer), 'dataLayer had not set');
                // wait for load
                setTimeout(()=>{
                    const rs = assert(0<window.dataLayer.length, 'dataLayer had not initialized');
                    resolve(rs);
                }, 1e3);

            })
        }
    },
]