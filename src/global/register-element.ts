import type { App } from 'vue';

import 'element-plus/theme-chalk/index.css';

import { ElButton, ElAffix, ElCol } from 'element-plus';

const components = [ElButton, ElAffix, ElCol];

export default function registerElement(app: App): void {
    for (const component of components) {
        app.component(component.name, component);
    }
}
