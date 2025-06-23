import {createApp} from 'vue'
import './style.css'
import App from './App.vue'

import EUI from 'n-ui-mini'
import 'n-ui-mini/dist/index.css'

createApp(App)
    .use(EUI)
    .mount('#app')
