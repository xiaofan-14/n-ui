import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import 'virtual:uno.css'
import MyUi from 'my-ui'

createApp(App)
    .use(MyUi)
    .mount('#app')
