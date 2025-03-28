import { ItemView, WorkspaceLeaf } from 'obsidian';
import { ObsidianStyleTab } from './tab/style-tab';
import { FileTab } from './tab/file-tab'; // 引入 FileTab

// 定义视图类型常量
export const VIBE_COMPONENTS_VIEW_TYPE = 'vibe-components-view';

// 创建组件视图类
export class VibeComponentsView extends ItemView {
    private contentEl: HTMLElement;
    private activeTab: string = 'style'; // 默认激活样式变量选项卡
    private styleTabButton: HTMLButtonElement;
    private fileTabButton: HTMLButtonElement;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return VIBE_COMPONENTS_VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Vibe Components";
    }

    async onOpen(): Promise<void> {
        const container = this.containerEl.children[1];
        container.empty();
        
        // 创建标题
        container.createEl("h1", { text: "Vibe Components" });
        
        // 创建选项卡区域
        const tabHeadersEl = container.createEl("div", { cls: "nav-buttons-container" });
        
        // 创建样式变量选项卡按钮
        this.styleTabButton = tabHeadersEl.createEl("button", { 
            text: "样式变量", 
            cls: "nav-action-button",
        });
        this.styleTabButton.addEventListener("click", () => this.openTab('style'));
        
        // 创建文件选项卡按钮
        this.fileTabButton = tabHeadersEl.createEl("button", { 
            text: "文件", 
            cls: "nav-action-button",
        });
        this.fileTabButton.addEventListener("click", () => this.openTab('file'));
        
        this.setActiveTab(this.activeTab);
        
        // 创建内容区域
        this.contentEl = container.createEl("div", { cls: "tab-content" });
        
        // 初始时打开样式变量选项卡
        this.openTab(this.activeTab);
        
        // 为选项卡按钮添加样式
        this.addTabStyles();
    }
    
    private openTab(tab: string): void {
        this.activeTab = tab;
        this.setActiveTab(tab);
        this.contentEl.empty();
    
        switch (tab) {
            case 'style':
                ObsidianStyleTab.create(this.contentEl);
                break;
            case 'file':
                FileTab.create(this.contentEl, this.app);
                break;
        }
    }
    
    private setActiveTab(tab: string): void {
        this.styleTabButton.classList.toggle('is-active', tab === 'style');
        this.fileTabButton.classList.toggle('is-active', tab === 'file');
    }
    
    private addTabStyles() {
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .nav-buttons-container {
                display: flex;
                border-bottom: 1px solid var(--background-modifier-border);
                margin-bottom: 20px;
            }
            
            .nav-action-button {
                padding: 8px 16px;
                border: none;
                background: none;
                cursor: pointer;
                font-size: 14px;
                opacity: 0.7;
                position: relative;
            }
            
            .nav-action-button.is-active {
                opacity: 1;
                font-weight: bold;
            }
            
            .nav-action-button.is-active::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: var(--interactive-accent);
            }
            
            .tab-content {
                padding: 10px 0;
                max-width: 800px; /* 调整容器宽度 */
                margin: 0 auto; /* 水平居中 */
            }
            
            /* 文件搜索样式 */
            .file-input {
                width: 100%;
                padding: 8px;
                border: 1px solid var(--background-modifier-border);
                background-color: var(--background-primary);
                color: var(--text-normal);
                border-radius: var(--radius-s);
                margin-bottom: 10px;
            }
            
            .file-results-container {
                max-height: 200px;
                overflow-y: auto;
                border: 1px solid var(--background-modifier-border);
                border-radius: var(--radius-s);
                background-color: var(--background-secondary);
                margin-bottom: 10px;
                display: none; /* 初始隐藏 */
            }
            
            .file-item {
                padding: 8px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .file-item:hover {
                background-color: var(--background-modifier-hover);
            }

            .file-item.is-selected {
                background-color: var(--interactive-accent);
                color: var(--text-on-accent);
            }
            
            .no-result {
                padding: 8px;
                color: var(--text-muted);
            }

            .file-tab-description {
                font-size: 12px;
                color: var(--text-muted);
                margin-bottom: 5px;
            }
        `;
        document.head.appendChild(styleEl);
    }
}
