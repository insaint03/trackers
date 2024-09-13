function() {
    return (function(subscriber){
    // connections & subscriptions: subscription properties get synced via dataLayer event trigger
    // subscriber.connections.forEach();
    // subscriber.subscriptions.forEach();
    
    // fire subscriber initialize event
    this.pub(`trx.sub.${subscriber.id}.init`, subscriber);
    // TODO: subsequencial manual triggering at subscriber ready
  });
}