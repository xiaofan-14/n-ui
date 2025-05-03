import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import 'virtual:uno.css'
import LearnUI from 'learn-ui'

createApp(App)
    .use(LearnUI)
    .mount('#app')
