import Vue from 'vue'
import { Button, Radio, Checkbox, Input, Alert, Divider, Icon, message } from 'ant-design-vue'
import { LocaleProvider } from 'ant-design-vue'

Vue.use(LocaleProvider)
Vue.use(Button)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Input)
Vue.use(Alert)
Vue.use(Divider)
Vue.use(Icon)

Vue.prototype.$message = message
