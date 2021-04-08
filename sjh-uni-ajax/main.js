import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
//引入 ajax
import './libs/ajax'
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
