import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import LearnUI from 'learn-ui-to-me'
import 'learn-ui-to-me/dist/index.css'

createApp(App)
    .use(LearnUI)
    .mount('#app')
