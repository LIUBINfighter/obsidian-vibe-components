import { App, Notice } from "obsidian";
import { ObsidianFeatures } from "../components/obsidian-ui";

/**
 * Obsidian 文件功能标签页
 * 展示 Obsidian 文件相关特色功能
 */
export class ObsidianFileTab {
    private static features: ObsidianFeatures;
    
    /**
     * 创建 Obsidian 文件功能标签页内容
     * @param container 容器元素
     * @param app Obsidian App 实例
     */
    static create(container: HTMLElement, app: App): void {
        // 初始化特色功能类
        if (!this.features) {
            this.features = new ObsidianFeatures(app);
        }
        
        // 添加标题和说明
        container.createEl('h3', { text: 'Obsidian 文件功能' });
        container.createEl('p', { text: '展示与文件操作相关的特色功能，包括搜索、链接分析和附件查看' });
        
        // 添加分割线
        container.createEl('hr');
        
        // 创建各个功能区块
        this.createSearchSection(container);
        this.createLinkAnalysisSection(container);
        this.createAttachmentsSection(container);
        
        // 添加样式
        this.addSectionStyles();
    }
    
    /**
     * 创建搜索部分
     */
    private static createSearchSection(container: HTMLElement): void {
        const section = container.createDiv({ cls: 'feature-section search-section' });
        section.createEl('h4', { text: '文件搜索组件' });
        section.createEl('p', { text: '这些搜索组件允许用户快速筛选和选择笔记、文件和文件夹' });
        
        // 创建三列布局
        const columns = section.createDiv({ cls: 'search-columns' });
        
        // 第一列：Markdown 文件搜索
        const mdColumn = columns.createDiv({ cls: 'search-column' });
        mdColumn.createEl('h5', { text: 'Markdown 文件搜索' });
        this.features.createMarkdownFilesSearch(
            mdColumn, 
            "搜索笔记...", 
            (file) => new Notice(`选择了笔记: ${file.name}`)
        );
        
        // 第二列：所有文件搜索
        const filesColumn = columns.createDiv({ cls: 'search-column' });
        filesColumn.createEl('h5', { text: '所有文件搜索' });
        this.features.createAllFilesSearch(
            filesColumn, 
            "搜索所有文件...", 
            (file) => new Notice(`选择了文件: ${file.name}`)
        );
        
        // 第三列：文件夹搜索
        const foldersColumn = columns.createDiv({ cls: 'search-column' });
        foldersColumn.createEl('h5', { text: '文件夹搜索' });
        this.features.createFoldersSearch(
            foldersColumn, 
            "搜索文件夹...", 
            (folder) => new Notice(`选择了文件夹: ${folder.name}`)
        );
        
        // 添加使用说明
        const usage = section.createDiv({ cls: 'feature-usage' });
        usage.createEl('h6', { text: '使用方法' });
        usage.createEl('p', { text: '在输入框中输入文件名或路径，下拉菜单会显示匹配结果。点击结果项可进行选择。' });
    }
    
    /**
     * 创建链接分析部分
     */
    private static createLinkAnalysisSection(container: HTMLElement): void {
        const section = container.createDiv({ cls: 'feature-section' });
        section.createEl('h4', { text: '文件链接分析' });
        section.createEl('p', { text: '分析文件的出链、入链和附件关系' });
        
        // 添加链接分析组件
        this.features.createFileLinkAnalyzer(section);
        
        // 添加使用说明
        const usage = section.createDiv({ cls: 'feature-usage' });
        usage.createEl('h6', { text: '使用方法' });
        usage.createEl('p', { text: '搜索并选择一个文件，系统会自动分析该文件的链接关系，包括指向其他文件的链接（出链）、来自其他文件的链接（入链）以及关联的附件。' });
    }
    
    /**
     * 创建附件查看部分
     */
    private static createAttachmentsSection(container: HTMLElement): void {
        const section = container.createDiv({ cls: 'feature-section' });
        section.createEl('h4', { text: '文件附件查看器' });
        section.createEl('p', { text: '查看文件关联的所有附件' });
        
        // 添加附件查看器组件
        this.features.createFileAttachmentsViewer(section);
        
        // 添加使用说明
        const usage = section.createDiv({ cls: 'feature-usage' });
        usage.createEl('h6', { text: '使用方法' });
        usage.createEl('p', { text: '选择一个包含附件引用的文件，系统会展示所有关联的附件，包括图片、音频、视频和其他文件类型。点击附件可以预览或打开它们。' });
    }
    
    /**
     * 添加样式
     */
    private static addSectionStyles(): void {
        if (!document.getElementById('obsidian-file-tab-styles')) {
            const style = document.head.createEl('style');
            style.id = 'obsidian-file-tab-styles';
            style.textContent = `
                .feature-section {
                    margin-bottom: 40px;
                    padding: 20px;
                    background-color: var(--background-secondary);
                    border-radius: var(--radius-m);
                }
                
                .search-columns {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-top: 15px;
                }
                
                .search-column {
                    flex: 1;
                    min-width: 200px;
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
            `;
        }
    }
}
