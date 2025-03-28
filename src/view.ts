import { ItemView, WorkspaceLeaf } from 'obsidian';

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
        container.createEl("h4", { text: "Vibe Components" });
        container.createEl("div", { text: "这里将显示组件列表" });
    }
}
