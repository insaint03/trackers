
## API structure

- (index)
  - **interLayer**: `function` <br/>
    *core library constructor*
    ```typescript
    function(
        // instance running scope: defaults window
        context:Object =window, 
        // anchor element seats for:
        //  - Root element to listen events,
        //  - and interLayer pub/sub point
        anchor:HTMLElement =window.document,
        // event log queue variable name: defaults 'dataLayer'
        queue_name:String ='dataLayer',
    ) // @return an interLayer instance
      -> Object{interLayer}
    ```
    - connect: `function` <br/>
      *sync document origin event into inter event trigger*
      ```typescript
      interLayer.connect = function({
        //
        selector:String=null,
        //
        event:String, 
        // 
        trigger:String,
        //
        retrieval:function,
      }) // @return nothing
        -> void
      ```
    - register: `function` <br/>
      *register a subscriber connections and/or pub/sub syncs*
      ```typescript
      interLayer.register = function(subscriber:Subscriber) -> void
      ```
    - sub: `function` <br/>
      *subscribe an interLayer events*
      ```typescript
      interLayer.sub = function(
        // inter event name to subscribe
        trigger:String,
        // callable function that handles
        handler:function,
      ) // @return nothing
        -> void
      ```
    - pub: `function` <br/>
      *manual interLayer event invokation*
      ```typescript
      interLayer.pub = function(
        // inter event name to invoke
        trigger:String, 
        // option values (may simulated) to map
        option:Object ={},
        // the element which (might) fired the origin event - optional
        target:HTMLElement =null,
        // the origin event instance at js which (might) fired - optional
        event_raw:Event =null,
      ) // @return nothing
        -> void
      ```
    - context: `Object` <br />
      *interLayer processing scope domain, window at default*
    - anchor: `HTMLElement` <br />
      *root element that interLayer processes, window.document at default*
    - queue: `Array` <br />
      *interLayer event queue that logs every events after interLayer created. Parameterized by queue_name:`String`, 'dataLayer' at default*
  - **Subscriber**: `class` <br/>
    *base class that describes tracker/trigger setup*
    ```typescript
    class Subscriber {
        // subscriber identification tracking_ids - optional
        constructor(id:String),
        // array of track_id
        track_ids:Array[String],
        // connections to be registered at interLayer
        get connections() -> Array[Object],
        // subscriptions to be registered at interLayer
        get subscriptions() -> Array[Object],
    }
    ```
    - _constructor_: `function` <br />
      *class constructor new subscriber instance*
      ```typescript
      const subscriber = new Subscriber('ga');
      ```
    - track_ids: `Array[String]` <br />
      *List of tracking ids related to the tracker/subscriber. defaults to empty array*
      ```typescript
      // get/set property
      subscriber.track_ids = ['G-1234', 'G-5678']
      ```
    - connections: `Array[Object]` <br />
      *List of connections should be loaded on interLayer at registration*
      ```typescript
      // identical trigger would be ignored
      subscriber.connections.forEach((cnx)=>{
        const {
            selector:String=null,
            event:String,
            trigger:String,
            retrieval:function,
        } = cnx;
        // should meet
        interLayer.connect(cnx);
      });
      ```
    - subscriptions: `Object` <br />
      *Map of subscriptions, trigger as key, its handler function as value*
      ```typescript
      Object.entries(subscriber.subscriptions)
      .forEach(([trigger, handler])=>{
        // should meet
        interLayer.sub(trigger, handler);
      })
      ```
  - **LibSubscriber**: `class` <br />
    *external library based tracker subscriber*
    ```typescript
    // extends base Subscriber
    class LibSubscriber extends Subscriber {
        // class constructor
        constructor(id:String,
            // library location to import. required
            src:String,
            // on Initialize stage (before load)
            onInit:function,
        );
        // instance getter 
        get instance(),
        // script instance appended to load the library
        get script(),
        // script element selector
        get scriptSelector(),
        // firing pixel for common
        fire(option={...args}),
        // once after library loaded
        onLoad(),
        // Subscriber inheritance
        connections,
        // Subscriber inheritance
        subscriptions,
    }
    ```
    - _constructor_: `function` <br />
      *external library setting*
      ```typescript
      const fb_tracker = LibSubscriber('fbq', {
        src: 'https://analytics.facebook.com/...',
        varname: 'fbq',
      });

      // onInit
      fb_tracker.onInit = ()=>{window.fbq = window.fbq||[];};
      // onLoad
      fb_tracker.onLoad = ()=>{this.instance = window.fbq};
      // sending alias
      fb_tracker.fire = (option)=>{
        // identical to window.fbq('send', option);
        this.instance('send', option)
      };
      // load connector
      fb_tracker.connections = [
        // onLoad triggering
        {
            selector: fb_tracker.scriptSelector, 
            event: 'load', 
            trigger: 'fbq.ready', 
            retrieval:()=>({tracker:window.fbq, ...})
        },
        ...
      ]
      // subscription register
      fb_tracker.subscriptions = {
        'item_list': (items)=>{this.fire({items, ...})},
        'item_detail': (item)=>{this.fire({item, ...})},
        ...
      }
      ```
    - instance: `Object` <br />
      *tracker instance at interLayer context scope*
      ```typescript
      fb_tracker.instance === window.fbq
      ```
    - script: `HTMLElement` <br />
      *&lt;script&gt; element to load library*
    - scriptSelector: `String` <br /> 
      *&lt;script&gt; element selector*
    - onLoad: `function` <br />
      *run on load. separated from triggered at connections setting*
      ```typescript
      // onLoad
      fb_tracker.onLoad = ()=>{this.instance = window.fbq};
      ```
    - fire: `function` <br />
      *aliasing send function*
      ```typescript
      // sending alias
      fb_tracker.fire = (option)=>{
        // identical to window.fbq('send', option);
        this.instance('send', option)
      };
      ```
    - ready: `Boolean` <br />
      *whether the tracker library had loaded*
    - connections: `Array[Object]` <br />
      *Subscriber inheritance*
    - subscriptions: `Object` <br />
      *Subscriber inheritance*
  - **PxSubscriber**: `class` <br />
    *Direct pixel sender subclass for Subscriber*
    ```typescript
    class PxSubscriber extends Subscriber {
        // 
        constructor(
            id:String, 
            location:String, 
            tag:String='img', 
            onInit:function=null
        ),
        // HTML element to trigger HTTP request.
        //  img | script | iframe available
        get element(), 
        // send pixels at common
        fire(option),
    }

    // initialize
    const fb_tracker = new PxSubscriber('fb', 'https://track.facebook.com');
    // fire
    fb_tracker.fire((option)=>sendPixel(this.location+'...', {...option});
    // connections
    fb_tracker.connections = [
      {
        selector: '',
        event: '',
        trigger: ()=>{},
        retrieval: ()=>{},
      }
    ],
    // subscriptions
    fb_tracker.subscriptions = {
      'item_list': (items)=>{},
      'item_detail': (item)=>{},
    }
    ```
  - connections: `Array[Object]` <br />
    *Subscriber inheritance*
  - subscriptions: `Object` <br />
    *Subscriber inheritance*
- **common**: `object` <br />
  *utilty mapper functions*
  - assert: `function` <br />
    *assertion alias*
    ```typescript
    assert(typeof('must_be_object') ==='object', 'This must be an object');
    ```
  - error: `function` <br />
    *triggering exception with arguemnt message*
    ```typescript
    function error(message:String) -> void;
    // 
    error('You shall not pass here');
    ```
  - until: `function` <br />
    *Promised conditional await*
    ```typescript
    function until(
        // condition function to lookup
        condition:function, 
        // max timeout in seconds. defaults 1hr
        timeout:Number=3600
    ) -> Promise;
    //
    await until(()=>document.readyState==='complete', timeout=3600);
    ```
  - await_elements: `function` <br />
    *HTML query selection alias for until*
    ```typescript
    function await_elements(
        selector:String,
        anchor:HTMLElement,
        timeout:Number=3600,
        singular:Boolean=false,
    ) -> Promise[HTMLElement|HTMLNodes];
    //
    const example = await el_ready(
        '#example', 
        window.document, 
        0, // timeout less than or equal to zero would be ignored
        true // singular TRUE.
    );
    ```
  - invoke: `function` <br />
    *manual document event invokation*
    ```typescript
    function invoke(
        target:HTMLElement,
        event:String,
        option:function|Object,
    ) -> Event,
    ```
  - maps: `function` <br />
    *project source object into target with map setting*
    ```typescript
    function maps(source:Object, maps:Object) -> Object;
    //
    const bar = maps(
        // source object
        {
            one: 1,
            two: ['x','y','omega'],
            three: {
                nested: true,
                index: 2,
                value: 3,
            },
            four: undefined,
        }, 
        // mapper
        {
            // [map] source.one -> target.primary
            one: 'primary',
            // [map] source.three.value -> target.value
            'three.value': 'value',
            // [map] source.four -> target.four (as-is)
            four: null,
        }
    );
    /* bar will be {primary: 1, value: 3, four: undefined} */
    ```
  - sendPixel: `function` <br />
    *send pixel http request to an given location*
    ```typescript
    function sendPixel(
      // url location to set
      location:String, 
      // img/script/iframe element selector within anchor hierarchy
      // create new img when not set / foundable
      selector:String=null, 
      // anchor element to set pixelate HTML element
      anchor:HTMLElement=window.document,
    ) -> void;
    ```
  - findVue: `function` <br />
    *find first vue.js related element under anchor hierarchy*
    ```typescript
    function findVue()-> {
      // the found HTML element
      el:HTMLElement,
      // current vue version
      version:String, 
      // find vue component
      queryComponent(name:String) -> VueElement,
      // find vue component in multiple
      queryComponentAll(name:String) -> VueElement,
      // 
      props:Object,
    } :VueElement;
    ```
  - findReact: `function` <br />
    *find first react.js related element under anchor hierarchy*
    ```typescript
    function findReact() -> {
      // the found HTML element
      el:HTMLElement,
      // component props
      props:Object,

    } :ReactElement;
