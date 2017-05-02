// app.js 

// Let's make some mock data to render:
// A long list with 1000 items.
const SHOP_LIST_LEN = 1000
const SHOP_LIST_ITEM = {
  name:'Awesome PWA Shop',
  imgsrc: 'shop.jpeg'
}
const SHOP_LIST = (() => {
  let arr = []
  for (var i = SHOP_LIST_LEN - 1 ; i >= 0; i--) {
    arr.push(SHOP_LIST_ITEM)
  };
  return arr
})()


// A tiny "Router" for routing logic.
const ROUTES_MAP = new Map([
  ['', 'A'],
  ['index.html', 'A'],
  ['skeleton.html', 'Skeleton'],
  ['b.html', 'B']
])
const CURRENT_ROUTE = ROUTES_MAP.get(location.pathname.split('/')[2])


// @Instance App 
const App = {
  
  // @Component List
  List(){
    return SHOP_LIST.map((item, index) => `
      <li>
        <img class="shop-icon" src="${item.imgsrc}" alt=""/>
        <h3> ${item.name} <br>
          <span> No.${1000-index} </span>
        </h3>
      </li>
    `).join('')
  },

  // @Component Page
  Page($node){
    return `
      <header> ${CURRENT_ROUTE} </header>
      <ul> ${this.List()} </ul>
      <footer> 
        <a href="index.html" class="${ CURRENT_ROUTE == 'A' && 'active' }"> A </a>
        <a href="skeleton.html"     class="${ CURRENT_ROUTE == 'Skeleton' && 'active' }"> Skeleton </a>
        <a href="b.html"     class="${ CURRENT_ROUTE == 'B' && 'active' }"> B </a>
      </footer>  
    `
  },

  // for testing more serious scenarios
  doExpensiveJob(){
    sum = 0
    for (var i = 300; i >= 0; i--) {
      sum++;
      console.log(sum)
    };
  },
  
   // A/B Test render logic here. 
  renderToNode($node){
    if(CURRENT_ROUTE == "B" ){
      this.renderPageInCurrentCallStack($node)
      //this.renderPageInMicroTask()
    }
    this.renderPageInTask($node)
  },

  // 1. Main - Current Event Loop 
  renderPageInCurrentCallStack($node){
    //this.doExpensiveJob()
    $node.innerHTML = this.Page()
  },

  // 2. Microtask - End of Current Event Loop 
  renderPageInMicroTask($node){
    Promise.resolve().then(() => {
      this.doExpensiveJob()
      $node.innerHTML = this.Page()
    })
  },

  // 3. Tasks - Next Event Loop 
  renderPageInTask($node){
    setTimeout(() => {
      //this.doExpensiveJob()
      $node.innerHTML = this.Page()
    }, 0)
  }
}


// Render to #app
App.renderToNode(document.querySelector('#app'))
