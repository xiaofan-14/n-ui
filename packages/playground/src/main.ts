import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import LearnUI from 'learn-ui'
import 'learn-ui/dist/index.css'

createApp(App)
    .use(LearnUI)
    .mount('#app')
