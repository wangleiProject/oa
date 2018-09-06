var Vue = require('vue'); 
new Vue(require('./vue/BootPage.vue'));
new Vue({
  el:'body',
  components:{
    app: App
  }
});