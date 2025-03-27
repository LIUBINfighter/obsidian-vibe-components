import { ItemView, Notice, WorkspaceLeaf, setIcon } from 'obsidian';
import { ObsidianUI } from './components/bottom';
import { ButtonTab } from './tabs/bottom-tab';

// 定义视图类型常量
export const VIBE_COMPONENTS_VIEW_TYPE = 'vibe-components-view';

// 创建组件视图类
export class VibeComponentsView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return VIBE_COMPONENTS_VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Components";
    }

    async onOpen(): Promise<void> {
        const container = this.containerEl.children[1];
        container.empty();
        
        // 创建标题
        container.createEl("h2", { text: "Vibe Components 组件库" });
        container.createEl("p", { text: "这是一个符合Obsidian设计风格的组件库示例" });
        
        // 创建标签页
        ObsidianUI.createTabs(container, [
            {
                id: 'buttons',
                label: '按钮',
                content: (el) => ButtonTab.create(el)
            },
            {
                id: 'inputs',
                label: '输入框',
                content: (el) => {
                    el.createEl('h3', { text: '输入框组件' });
                    el.createEl('p', { text: '这里将展示各种输入框组件' });
                }
            },
            {
                id: 'lists',
                label: '列表',
                content: (el) => {
                    el.createEl('h3', { text: '列表组件' });
                    el.createEl('p', { text: '这里将展示各种列表组件' });
                }
            }
        ]);
    }
}
