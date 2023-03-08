import type {App} from 'vue';

import 'element-plus/theme-chalk/index.css';

import {ElAffix, ElButton, ElCol} from 'element-plus';

const components = [ElButton, ElAffix, ElCol];

export default function registerElement(app: App): void {
    for (const component of components) {
        app.component(component.name, component);
    }
}
