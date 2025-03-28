import { ItemView, Notice, WorkspaceLeaf, setIcon } from 'obsidian';
import { ObsidianUI } from './components/bottom';
import { ButtonTab } from './tabs/bottom-tab';
import { ObsidianStyleTab } from './tabs/obsidian-style-tab';
import { ObsidianUITab } from './tabs/obsidian-ui-tab';
import { ObsidianFileTab } from './tabs/obsidian-file-tab';
import { ObsidianGraphTab } from './tabs/obsidian-graph-tab';

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
        
        // 创建标签页容器
        const wrapper = container.createDiv({ cls: "vibe-tabs" });
        const tabsHeader = wrapper.createDiv({ cls: "nav-buttons-container" });
        const tabsContent = wrapper.createDiv({ cls: "vibe-tab-content" });
        
        // 添加样式
        this.addTabStyles();
        
        // 定义标签页配置
        const tabs = [
            { id: 'buttons', label: '按钮', loader: (el: HTMLElement) => ButtonTab.create(el) },
            { id: 'obsidian-style', label: 'Obsidian 风格', loader: (el: HTMLElement) => ObsidianStyleTab.create(el) },
            { id: 'obsidian-file', label: 'Obsidian 文件功能', loader: (el: HTMLElement) => {
                const placeholder = el.createDiv({ cls: "lazy-load-placeholder" });
                placeholder.createEl("h3", { text: "Obsidian 文件功能" });
                placeholder.createEl("p", { text: "点击加载组件..." });
                
                const loadBtn = placeholder.createEl("button", { 
                    text: "加载文件功能组件", 
                    cls: "mod-cta"
                });
                
                loadBtn.addEventListener("click", () => {
                    placeholder.empty();
                    placeholder.createEl("div", { text: "加载中...", cls: "loading-indicator" });
                    
                    // 使用setTimeout避免UI卡顿
                    setTimeout(() => {
                        placeholder.remove();
                        ObsidianFileTab.create(el, this.app);
                    }, 50);
                });
            }},
            { id: 'obsidian-graph', label: 'Obsidian 图表功能', loader: (el: HTMLElement) => {
                const placeholder = el.createDiv({ cls: "lazy-load-placeholder" });
                placeholder.createEl("h3", { text: "Obsidian 图表功能" });
                placeholder.createEl("p", { text: "点击加载组件..." });
                
                const loadBtn = placeholder.createEl("button", { 
                    text: "加载图表功能组件", 
                    cls: "mod-cta"
                });
                
                loadBtn.addEventListener("click", () => {
                    placeholder.empty();
                    placeholder.createEl("div", { text: "加载中...", cls: "loading-indicator" });
                    
                    // 使用setTimeout避免UI卡顿
                    setTimeout(() => {
                        placeholder.remove();
                        ObsidianGraphTab.create(el, this.app);
                    }, 50);
                });
            }},
            { id: 'inputs', label: '输入框', loader: (el: HTMLElement) => {
                el.createEl('h3', { text: '输入框组件' });
                el.createEl('p', { text: '这里将展示各种输入框组件' });
            }},
            { id: 'lists', label: '列表', loader: (el: HTMLElement) => {
                el.createEl('h3', { text: '列表组件' });
                el.createEl('p', { text: '这里将展示各种列表组件' });
            }}
        ];
        
        // 创建标签按钮
        tabs.forEach((tab, index) => {
            const tabBtn = tabsHeader.createDiv({
                text: tab.label,
                cls: `nav-button ${index === 0 ? "is-active" : ""}`,
                attr: { "data-tab": tab.id },
            });
            
            // 创建内容容器（一开始是空的）
            const tabPane = tabsContent.createDiv({
                cls: `vibe-tab-pane ${index === 0 ? "is-active" : ""}`,
                attr: { "data-tab-id": tab.id, "data-loaded": "false" },
            });
            
            // 只加载第一个标签页内容
            if (index === 0) {
                tab.loader(tabPane);
                tabPane.setAttribute("data-loaded", "true");
            }
            
            // 点击标签页时才加载内容
            tabBtn.addEventListener("click", () => {
                // 移除所有活跃状态
                tabsHeader.findAll(".nav-button").forEach((el) => {
                    el.removeClass("is-active");
                });
                tabsContent.findAll(".vibe-tab-pane").forEach((el) => {
                    el.removeClass("is-active");
                });
                
                // 添加活跃状态
                tabBtn.addClass("is-active");
                tabPane.addClass("is-active");
                
                // 如果内容尚未加载，则加载内容
                if (tabPane.getAttribute("data-loaded") !== "true") {
                    // 显示加载指示器
                    const loadingIndicator = tabPane.createDiv({ 
                        cls: "lazy-loading-indicator",
                        text: "加载中..."
                    });
                    
                    // 延迟加载内容以确保UI不卡顿
                    setTimeout(() => {
                        try {
                            tab.loader(tabPane);
                            tabPane.setAttribute("data-loaded", "true");
                            loadingIndicator.remove();
                        } catch (e) {
                            console.error("加载标签页内容时出错:", e);
                            loadingIndicator.setText("加载失败，请重试");
                        }
                    }, 50);
                }
            });
        });
    }
    
    /**
     * 添加标签页样式
     */
    private addTabStyles(): void {
        // 避免重复添加样式
        if (!document.getElementById('vibe-tabs-styles')) {
            const style = document.head.createEl("style");
            style.id = 'vibe-tabs-styles';
            style.textContent = `
                .vibe-tabs .nav-buttons-container {
                    display: flex;
                    border-bottom: 1px solid var(--tab-divider-color);
                    margin-bottom: 8px;
                    flex-wrap: wrap;
                }
                .vibe-tabs .nav-button {
                    padding: 6px 12px;
                    margin-right: 4px;
                    cursor: pointer;
                    color: var(--text-normal);
                    border-radius: var(--radius-s) var(--radius-s) 0 0;
                    margin-bottom: 4px;
                }
                .vibe-tabs .nav-button.is-active {
                    color: var(--text-accent);
                    border-bottom: 2px solid var(--tab-active-border);
                    background-color: var(--tab-active-background);
                }
                .vibe-tab-pane {
                    display: none;
                }
                .vibe-tab-pane.is-active {
                    display: block;
                }
                .lazy-loading-indicator {
                    text-align: center;
                    padding: 20px;
                    color: var(--text-muted);
                    font-style: italic;
                }
                .lazy-load-placeholder {
                    text-align: center;
                    padding: 30px;
                    background-color: var(--background-secondary);
                    border-radius: var(--radius-m);
                    margin: 20px 0;
                }
                .loading-indicator {
                    margin-top: 10px;
                    color: var(--text-muted);
                    font-style: italic;
                }
            `;
        }
    }
    
    // 清理资源，防止内存泄漏
    onunload(): void {
        // 移除可能的全局事件监听器
        document.removeEventListener("mousemove", this.handleGlobalMouseMove);
        document.removeEventListener("mouseup", this.handleGlobalMouseUp);
    }
    
    // 存储全局事件处理函数的引用
    private handleGlobalMouseMove = (e: MouseEvent) => {};
    private handleGlobalMouseUp = () => {};
}
