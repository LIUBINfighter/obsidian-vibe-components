import { App, Notice } from "obsidian";
import { ObsidianFeatures } from "../components/obsidian-ui";

/**
 * Obsidian 图表功能标签页
 * 展示 Obsidian 图表可视化相关特色功能
 */
export class ObsidianGraphTab {
    private static features: ObsidianFeatures;
    
    /**
     * 创建 Obsidian 图表功能标签页内容
     * @param container 容器元素
     * @param app Obsidian App 实例
     */
    static create(container: HTMLElement, app: App): void {
        // 初始化特色功能类
        if (!this.features) {
            this.features = new ObsidianFeatures(app);
        }
        
        // 添加标题和说明
        container.createEl('h3', { text: 'Obsidian 图表功能' });
        container.createEl('p', { text: '展示笔记间链接关系的可视化功能' });
        
        // 添加分割线
        container.createEl('hr');
        
        // 创建图表部分
        this.createGraphSection(container);
        
        // 添加样式
        this.addSectionStyles();
    }
    
    /**
     * 创建图形视图部分
     */
    private static createGraphSection(container: HTMLElement): void {
        const section = container.createDiv({ cls: 'feature-section' });
        section.createEl('h4', { text: '文件关系可视化' });
        section.createEl('p', { text: '可视化展示文件之间的链接关系，类似于 Obsidian 的全局图谱，但针对单个文件及其链接' });
        
        // 高级搜索控制面板
        const searchPanel = section.createDiv({ cls: "graph-search-panel" });
        
        // 文件搜索区域
        const fileSearchArea = searchPanel.createDiv({ cls: "graph-file-search-area" });
        fileSearchArea.createEl("h5", { text: "选择中心文件", cls: "section-subtitle" });
        
        // 强化版文件选择器
        this.features.createMarkdownFilesSearch(
            fileSearchArea, 
            "输入文件名快速查找...", 
            (file) => {
                // 当选择文件时更新当前选择显示
                if (currentSelectionInfo) {
                    currentSelectionInfo.textContent = `当前选择: ${file.name}`;
                    currentSelectionInfo.style.display = "block";
                }
                // 渲染关系图
                this.renderFileGraph(file, graphContainer, depthSelector.value);
                // 显示成功消息
                new Notice(`已加载 "${file.name}" 的关系图`);
            }
        );
        
        // 当前选择信息
        const currentSelectionInfo = fileSearchArea.createDiv({ 
            cls: "current-selection-info",
            text: "尚未选择文件"
        });
        currentSelectionInfo.style.display = "none";
        
        // 深度控制区域 
        const depthControlArea = searchPanel.createDiv({ cls: "graph-depth-control-area" });
        depthControlArea.createEl("h5", { text: "链接深度", cls: "section-subtitle" });
        
        // 创建深度选择器和说明
        const depthControlWrapper = depthControlArea.createDiv({ cls: "depth-control-wrapper" });
        
        // 添加深度说明
        const depthDescription = depthControlWrapper.createDiv({ cls: "depth-description" });
        depthDescription.createDiv({ text: "选择要显示的链接深度层级:", cls: "depth-label" });
        
        // 创建深度选择器
        const depthSelector = depthControlWrapper.createEl("select", { cls: "depth-select" });
        
        [
            { value: "1", text: "1级 - 仅直接链接" },
            { value: "2", text: "2级 - 包含二级链接" },
            { value: "3", text: "3级 - 包含三级链接" }
        ].forEach(option => {
            depthSelector.createEl("option", {
                value: option.value,
                text: option.text
            });
        });
        
        // 添加深度提示
        depthControlArea.createDiv({ 
            text: "深度越大，显示关系越广，但可能会导致图表过于复杂", 
            cls: "depth-hint" 
        });
        
        // 更新按钮
        const updateBtnContainer = searchPanel.createDiv({ cls: "update-button-container" });
        const updateBtn = updateBtnContainer.createEl("button", { 
            text: "更新关系图",
            cls: "mod-cta update-graph-button"
        });
        
        updateBtn.addEventListener("click", () => {
            const fileInput = fileSearchArea.querySelector(".search-input") as HTMLInputElement;
            if (fileInput && fileInput.dataset.selectedPath) {
                const file = this.features.app.vault.getAbstractFileByPath(fileInput.dataset.selectedPath);
                if (file && file.extension === "md") {
                    this.renderFileGraph(file as any, graphContainer, depthSelector.value);
                    new Notice("关系图已更新");
                } else {
                    new Notice("请先选择一个有效的 Markdown 文件");
                }
            } else {
                new Notice("请先选择一个文件");
            }
        });
        
        // 图形容器 - 使用最大高度确保有足够的显示空间
        const graphContainer = section.createDiv({ cls: "graph-view enhanced" });
        graphContainer.createDiv({ cls: "graph-placeholder", text: "选择一个文件以显示其链接关系图" });
        
        // 添加高级提示部分
        const tipsSection = container.createDiv({ cls: 'feature-section tips-section' });
        tipsSection.createEl('h4', { text: '高级使用提示' });
        
        const tipsList = tipsSection.createEl('ul', { cls: 'tips-list' });
        
        const tips = [
            "选择不同的链接深度可以看到更广泛的关联",
            "使用鼠标拖拽可以移动整个图表视图",
            "使用鼠标滚轮可以缩放图表",
            "点击节点可以直接打开对应的文件",
            "中心节点(红色)代表当前选中的文件",
            "绿色节点表示被当前文件链接的文件(出链)",
            "黄色节点表示链接到当前文件的文件(入链)",
            "紫色节点表示与当前文件互相链接的文件(双向链接)"
        ];
        
        tips.forEach(tip => {
            tipsList.createEl('li', { text: tip });
        });
        
        // 添加使用说明
        const usage = section.createDiv({ cls: 'feature-usage' });
        usage.createEl('h6', { text: '使用方法' });
        usage.createEl('p', { text: '选择一个文件作为中心节点，选择链接深度（1-3级），系统会自动生成关系图。使用鼠标可以拖拽视图、滚轮缩放视图，点击节点可以打开对应文件。' });
    }
    
    /**
     * 添加样式
     */
    private static addSectionStyles(): void {
        if (!document.getElementById('obsidian-graph-tab-styles')) {
            const style = document.head.createEl('style');
            style.id = 'obsidian-graph-tab-styles';
            style.textContent = `
                .feature-section {
                    margin-bottom: 40px;
                    padding: 20px;
                    background-color: var(--background-secondary);
                    border-radius: var(--radius-m);
                }
                
                .tips-section {
                    background-color: var(--background-primary);
                    border-left: 4px solid var(--interactive-accent);
                }
                
                .tips-list {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                
                .tips-list li {
                    margin-bottom: 8px;
                    color: var(--text-normal);
                }
                
                .feature-usage {
                    margin-top: 15px;
                    padding: 10px;
                    background-color: var(--background-primary);
                    border-left: 3px solid var(--interactive-accent);
                    border-radius: 0 var(--radius-s) var(--radius-s) 0;
                }
                
                .feature-usage h6 {
                    color: var(--text-accent);
                    margin: 0 0 5px 0;
                }
                
                .feature-usage p {
                    color: var(--text-muted);
                    margin: 0;
                    font-size: 13px;
                }
                
                /* 新增强化样式 */
                .graph-search-panel {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    padding: 15px;
                    background-color: var(--background-primary);
                    border-radius: var(--radius-m);
                    margin-bottom: 15px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }
                
                .graph-file-search-area, 
                .graph-depth-control-area {
                    flex: 1;
                    min-width: 250px;
                }
                
                .section-subtitle {
                    margin-top: 0;
                    margin-bottom: 10px;
                    color: var(--text-accent);
                    font-size: 16px;
                    font-weight: 500;
                    border-bottom: 1px solid var(--background-modifier-border);
                    padding-bottom: 5px;
                }
                
                .current-selection-info {
                    margin-top: 8px;
                    padding: 6px 10px;
                    background-color: var(--background-secondary-alt);
                    border-radius: var(--radius-s);
                    color: var(--text-accent);
                    font-size: 13px;
                }
                
                .depth-control-wrapper {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .depth-label {
                    margin-right: 10px;
                    color: var(--text-normal);
                    font-size: 14px;
                }
                
                .depth-select {
                    flex: 1;
                    padding: 6px 10px;
                    border: 1px solid var(--background-modifier-border);
                    border-radius: var(--radius-s);
                    background-color: var(--background-primary);
                    color: var(--text-normal);
                    cursor: pointer;
                }
                
                .depth-hint {
                    color: var(--text-muted);
                    font-size: 12px;
                    font-style: italic;
                    margin-top: 5px;
                }
                
                .update-button-container {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 10px;
                    width: 100%;
                }
                
                .update-graph-button {
                    padding: 8px 15px;
                    background-color: var(--interactive-accent);
                    color: var(--text-on-accent);
                    border: none;
                    border-radius: var(--radius-s);
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.2s ease;
                }
                
                .update-graph-button:hover {
                    background-color: var(--interactive-accent-hover);
                }
                
                .graph-view.enhanced {
                    height: 600px;
                    background-color: var(--background-secondary-alt);
                    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
                }
                
                /* 美化搜索结果样式 */
                .search-results {
                    border: 1px solid var(--background-modifier-border) !important;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
                }
                
                .search-result-item {
                    transition: background-color 0.15s ease !important;
                }
                
                .search-result-item:hover {
                    background-color: var(--background-secondary-alt) !important;
                }
                
                .result-title {
                    font-size: 14px !important;
                    font-weight: 500 !important;
                }
                
                .result-path {
                    font-size: 11px !important;
                }
            `;
        }
    }
}
