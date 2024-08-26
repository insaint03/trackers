
### case GTM:

- `.trx.init` tag (typed raw HTML) to load library, triggered at page `initialization`
- `.trx.init` does these job:
  - Initialize an `interLayer` and its features, push it into dataLayer variable `.trx`.
  - Prepare multiple subscriber logic, including `trx.sub._basis` and others
  - Import subscriber class definition, and common utilities into interLayer
  - Running tag format:
    ```HTML
    <script>
      (function() {
        .../*obfuscated library codes in a line */
        // setup interLayer
        let layer = interLayer()
        // explicit setup defaults
        // const layer = interLayer(window, window.document, 'dataLayer');

        // push as dataLayer variable
        dataLayer.push({
          '.trx': layer,
          '.trx.Subscriber': Subscriber,
          '.trx.utils': common,
        });

        // register procedural subscriber
        layer.register(/* TODO: init */);
        // this will fire trx.ready trigger
      })();
    </script>
    ```
- function `interLayer.register` would first fire a trigger `trx.sub.${sub_id}.init`. 
- Then it mix up features derived from interLayer (subscriber in common), and customed info (i.e. tracking ID) within the code, 
Once it loaded and registration completed, then it fires `trx.sub.${sub_id}.ready` trigger to the dataLayer.
- Each subscriber sets `.trx.sub.${sub_id}` named *custom javascript variable*. which will fire `trx.subscriber.init`, `trx.subscriber.ready` and other custom events. (a single event will holds `subscriber_id` of the target subscriber)
- There's an interLayer baseline subscriber that handle connections:
  - at `gtm.init` event, run page classification by pathname pattern then trigger `trx.page.init` with `{class: ${page_cid}, ...url_params}`
  - at `gtm.domready` event, run secondary classification with page content then trigger `trx.page.ready` plus `{class: ${page_cid}, ...url_params, ...page_params }`.
  - at `trx.ready`
- registered connections would fire `trx.${type}.${custom_id}` (i.e. `trx.intersect.main`) and its retrieved parameters through dataLayer event, will be set as corresponding dataLayer event trigger.
- registered subscriptions would link the dataLayer event trigger, run mux firing tag `.trx.mux` by its subscriber_id, event_name, parameter mapping

#### GTM trigger - trx event mapping

| trigger | interLayer event | params | gtm tag/var |
|---------|------------------|----------|-----|
| `gtm.init` | `trx.init`    | - page_cid:`String`,<br /> - ...{path params} | (tag) `.trx.init` |
| -   | `trx.sub.${sub_id}.init`| - | (var) `.trx.sub.${sub_id}`... |
| -  | `trx.sub.${sub_id}.ready` | - | - |
| `gtm.domready` | `trx.ready` | - page_cid:`String`, <br /> -...{path params}, <br /> - ...{content params}, | - |
| (user event) | `trx.pub.${type}.${event}` | - {...retrieval} | (tag) `trx.mux` templated `trx.${sub_id}.${event}` tags |

#### GTM resources to build

| - | name | misc |
|---| --- | --- |
| ***Vars*** ||
| | `.trx` | trx interLayer instance, try to set at `trx.init` |
| | `.trx.page` | page classification id |
| | `.trx.sub.${sub_id}` | subscriber definition, plus page path classification & parameterizing |
| | `trx.sub.${sub_id}` | subscriber instance can fire event |
| | `.trx.connections` | registered trx connections at sync |
| | `.trx.subscribers` | registered trx subscriber ids |
| ***Trigger*** ||
| | `trx.init` | connecting `gtm.init` to a trx event |
| | `trx.ready` | connecting `gtm.domready` to a trx event, plus page content parameterizing |
| | `trx.sub.${sub_id}.init` | a single subscriber registration started |
| | `trx.sub.${sub_id}.ready` | a subscriber registration completed, ready to use |
| | `trx.pub.${type}.${event}` | user event interLayering |
| | `trx.sub.${sub_id}`<br /> &nbsp; `.${type}.${event}` | trigger group concatenates `trx.pub.${type}.${event}` AND `trx.sub.${sub_id}.ready`
| ***Tags*** ||
| | `.trx.init` | interLayer initialization, triggered at `gtm.init` |
| | `trx.${sub_id}.${event}` | one-point processing interLayer pub event, processing parameters |
| ***Templates*** ||
| | `trx.mux` | (Tag) `trx.sub.${subscriber_id}.${event_id}` event sync template |
| | `trx.subcriber` | (Variable) `trx.sub.${subscriber_id}` instance template <br />  - Subscriber info only: GTM template script do not  |


