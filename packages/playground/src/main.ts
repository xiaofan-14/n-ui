import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import EUI from 'n-ui'
import 'n-ui/dist/index.css'

createApp(App)
    .use(EUI)
    .mount('#app')
