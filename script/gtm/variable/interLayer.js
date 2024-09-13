/**
 * trx interLayer definition.
 */
function() {
  // retrieve anchor/queue settings
  const anchor = ({{trx.anchor}});
  const queue = ({{trx.queue}});

  // prevent re-initialization block
  if(anchor._trx!=null) {
    return anchor._trx;
  }
  
  // default properties
  const interLayer = {
    anchor: anchor,
    queue: queue,
    connections: {},
    subscribers: {},
    lib: ({{trx.lib}}),
  };

  // manual firing (interLayer/dataLayer) event
  interLayer.pub = ({{trx.interLayer.pub}}).bind(interLayer);

  // register subscriber
  interLayer.register = ({{trx.interLayer.register}}).bind(interLayer);
  
  
  return anchor._trx = interLayer;
}