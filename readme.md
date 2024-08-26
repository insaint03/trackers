# Trackers

## Version & Structure
- version _draft_ : since Aug.2024. @insaint03
  - [ ] **docs** github pages based test htmls `vue`
    - [ ] ***gtm*** GTM page 
  - [ ] **script** library source code; `babel`
    - [ ] ***gtm*** mode Google Tag Manager
    - [ ] ***raw*** mode RAW script import
  - [ ] **server** backend; headless web API `fastAPI`
  - [ ] **web** frontend; `vue`


## The mission

What are reasons makes client-side (web/app) user behavior logging difficult?

On the top of the facts, there are hundreds of different trackers - which varies a little - retrieve, sends and goes running on the same page/screen. User interactions are quite limited, either in-page information, but numbers of tracker solutions does not seemed to be so.

Some trackers has its event queue *(i.e. `dataLayer` for google solutions, `fbq` for facebook analytics). Some runs within defer -ed fashion, only once in a page at last. Numbers of trackers want to have ecommerce items, search queries and details, but others do not care the event type, only the level of engagement. Even for those collects ecommerce item info - some maps `{id, name, category, brand, price}`, but some other has `{sku, title, color, ...}`. Some asks `quantity` and `revenue` for a transaction or some `qty` and `value`, or `q` and `total`, etc.

***You might not try to collect each of those info per a tracker, weren't you?***

| page/screen category | event/parameter | tracker#1 | tracker#2 | ... |
|--- | --- | --- | --- | --- |
| /* | pageview <ul><li>`pathname`</li></ul> | pageview | loaded | pv | 
| /search?q=<query> | search <ul><li>`query`</li><li>`items`</li></ul> | query <ul><li>`query`</li><li>`-`</li></ul> | list_items <ul><li>`-`</li><li>`items`</li></ul> | ... |
| /order/<order_id>/complete | transaction <ul><li>`transaction_id`</li><li>`revenue`</li><li>`discount`</li><li>`items`</li><li>...</li></ul> | purchase <ul><li>`id`</li><li>`value`</li><li>`-`</li><li>`items`</li><li>...</li></ul> | transaction <ul><li>`order_id`</li><li>`total`</li><li>`discount`</li><li>`-`</li><li>...</li></ul> | ... |


The upper table simulates what I used to build per a tracker setup projects. **User interactions and page content info are limited** means, data that most trackers supposed to collect are lies in a certain boundary. Dependant to how its solution - server takes, only the variable `key-value` pair varies.

Then it suggests, once you have integrated handler and data retrieved by the event, you can simply mapping the key-values meets with the tracker and ***THAT IS ALL***. Oh, and BTW ***There are already well-built solutions for the task*** namely `GTM/dataLayer` and `Adobe Launch` and more. This structure looked fairly clear to a system engineers.

However, normally the solutions does not seemed to be so. Its' catch-phrase says *"codeless tracking"*, not the *"integrated structure"*. Simply because, if one who'd build the structure, can not avoid custom codes. 