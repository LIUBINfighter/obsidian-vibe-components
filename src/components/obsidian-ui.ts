import { App, TFile, TFolder, getAllTags, setIcon, Workspace, MetadataCache, MarkdownView, TAbstractFile, CachedMetadata } from "obsidian";

/**
 * Obsidian 特色功能组件库
 * 封装了 Obsidian 特有的 UI 组件和功能
 */
export class ObsidianFeatures {
    // 将 app 设为公开属性，以便其他类可以访问
    public app: App;
    
    constructor(app: App) {
        this.app = app;
    }
    
    /**
     * 创建文件搜索输入框 - 匹配所有 Markdown 文件
     */
    createMarkdownFilesSearch(container: HTMLElement, placeholder = "搜索笔记...", callback?: (file: TFile) => void): HTMLElement {
        const wrapper = container.createDiv({ cls: "search-input-container" });
        
        // 创建搜索输入框
        const searchInput = wrapper.createEl("input", {
            type: "text",
            placeholder: placeholder,
            cls: "search-input"
        });
        
        // 创建搜索图标
        const searchIcon = wrapper.createDiv({ cls: "search-input-icon" });
        setIcon(searchIcon, "search");
        
        // 创建搜索结果容器
        const resultsContainer = wrapper.createDiv({ cls: "search-results" });
        resultsContainer.hide();
        
        // 搜索处理逻辑
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();
            resultsContainer.empty();
            
            if (query.length < 2) {
                resultsContainer.hide();
                return;
            }
            
            const markdownFiles = this.getMarkdownFiles();
            const matchedFiles = markdownFiles.filter(file => 
                file.name.toLowerCase().includes(query)
            );
            
            if (matchedFiles.length > 0) {
                resultsContainer.show();
                this.renderFileResults(resultsContainer, matchedFiles, callback);
            } else {
                resultsContainer.hide();
            }
        });
        
        // 点击外部关闭结果
        document.addEventListener("click", (event) => {
            if (!wrapper.contains(event.target as Node)) {
                resultsContainer.hide();
            }
        });
        
        // 添加样式
        this.addSearchStyles();
        
        return wrapper;
    }
    
    /**
     * 创建文件搜索输入框 - 匹配所有文件（包括非Markdown）
     */
    createAllFilesSearch(container: HTMLElement, placeholder = "搜索所有文件...", callback?: (file: TFile) => void): HTMLElement {
        const wrapper = container.createDiv({ cls: "search-input-container" });
        
        const searchInput = wrapper.createEl("input", {
            type: "text",
            placeholder: placeholder,
            cls: "search-input"
        });
        
        const searchIcon = wrapper.createDiv({ cls: "search-input-icon" });
        setIcon(searchIcon, "search");
        
        const resultsContainer = wrapper.createDiv({ cls: "search-results" });
        resultsContainer.hide();
        
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();
            resultsContainer.empty();
            
            if (query.length < 2) {
                resultsContainer.hide();
                return;
            }
            
            const allFiles = this.getAllFiles();
            const matchedFiles = allFiles.filter(file => 
                file.name.toLowerCase().includes(query)
            );
            
            if (matchedFiles.length > 0) {
                resultsContainer.show();
                this.renderFileResults(resultsContainer, matchedFiles, callback);
            } else {
                resultsContainer.hide();
            }
        });
        
        document.addEventListener("click", (event) => {
            if (!wrapper.contains(event.target as Node)) {
                resultsContainer.hide();
            }
        });
        
        this.addSearchStyles();
        
        return wrapper;
    }
    
    /**
     * 创建文件夹搜索输入框
     */
    createFoldersSearch(container: HTMLElement, placeholder = "搜索文件夹...", callback?: (folder: TFolder) => void): HTMLElement {
        const wrapper = container.createDiv({ cls: "search-input-container" });
        
        const searchInput = wrapper.createEl("input", {
            type: "text",
            placeholder: placeholder,
            cls: "search-input"
        });
        
        const searchIcon = wrapper.createDiv({ cls: "search-input-icon" });
        setIcon(searchIcon, "search");
        
        const resultsContainer = wrapper.createDiv({ cls: "search-results" });
        resultsContainer.hide();
        
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();
            resultsContainer.empty();
            
            if (query.length < 2) {
                resultsContainer.hide();
                return;
            }
            
            const folders = this.getAllFolders();
            const matchedFolders = folders.filter(folder => 
                folder.name.toLowerCase().includes(query) || 
                folder.path.toLowerCase().includes(query)
            );
            
            if (matchedFolders.length > 0) {
                resultsContainer.show();
                this.renderFolderResults(resultsContainer, matchedFolders, callback);
            } else {
                resultsContainer.hide();
            }
        });
        
        document.addEventListener("click", (event) => {
            if (!wrapper.contains(event.target as Node)) {
                resultsContainer.hide();
            }
        });
        
        this.addSearchStyles();
        
        return wrapper;
    }
    
    /**
     * 创建文件链接分析组件
     */
    createFileLinkAnalyzer(container: HTMLElement): HTMLElement {
        const wrapper = container.createDiv({ cls: "file-analyzer" });
        
        // 文件选择部分
        const fileSelector = wrapper.createDiv({ cls: "file-selector" });
        fileSelector.createEl("h4", { text: "选择文件进行链接分析" });
        
        // 搜索输入框
        this.createMarkdownFilesSearch(fileSelector, "输入文件名...", (file) => {
            this.analyzeFileLinks(file, resultsContainer);
        });
        
        // 结果展示部分
        const resultsContainer = wrapper.createDiv({ cls: "analyzer-results" });
        
        this.addAnalyzerStyles();
        
        return wrapper;
    }
    
    /**
     * 创建文件链接可视化组件
     */
    createFileLinkGraph(container: HTMLElement): HTMLElement {
        const wrapper = container.createDiv({ cls: "file-graph-container" });
        
        // 控制面板
        const controlPanel = wrapper.createDiv({ cls: "graph-control-panel" });
        controlPanel.createEl("h4", { text: "链接关系可视化" });
        
        // 文件选择
        const fileSelectContainer = controlPanel.createDiv({ cls: "graph-file-select" });
        fileSelectContainer.createSpan({ text: "选择文件: ", cls: "graph-label" });
        
        this.createMarkdownFilesSearch(fileSelectContainer, "输入文件名...", (file) => {
            this.renderFileGraph(file, graphContainer, depthSelector.value);
        });
        
        // 深度选择
        const depthContainer = controlPanel.createDiv({ cls: "graph-depth-select" });
        depthContainer.createSpan({ text: "链接深度: ", cls: "graph-label" });
        
        const depthSelector = depthContainer.createEl("select", { cls: "depth-select" });
        [1, 2, 3].forEach(depth => {
            depthSelector.createEl("option", {
                text: `${depth} 级链接`,
                value: depth.toString()
            });
        });
        
        depthSelector.addEventListener("change", () => {
            const fileInput = fileSelectContainer.querySelector(".search-input") as HTMLInputElement;
            if (fileInput && fileInput.dataset.selectedPath) {
                const file = this.app.vault.getAbstractFileByPath(fileInput.dataset.selectedPath) as TFile;
                if (file && file instanceof TFile) {
                    this.renderFileGraph(file, graphContainer, depthSelector.value);
                }
            }
        });
        
        // 图形容器
        const graphContainer = wrapper.createDiv({ cls: "graph-view" });
        graphContainer.createDiv({ cls: "graph-placeholder", text: "选择一个文件以显示其链接关系图" });
        
        this.addGraphStyles();
        
        return wrapper;
    }
    
    /**
     * 创建文件附件查询组件
     */
    createFileAttachmentsViewer(container: HTMLElement): HTMLElement {
        const wrapper = container.createDiv({ cls: "attachments-viewer" });
        
        // 头部
        wrapper.createEl("h4", { text: "文件附件查看器" });
        
        // 文件选择框
        this.createMarkdownFilesSearch(wrapper, "选择要查看附件的文件...", (file) => {
            this.showFileAttachments(file, attachmentsContainer);
        });
        
        // 附件容器
        const attachmentsContainer = wrapper.createDiv({ cls: "attachments-container" });
        attachmentsContainer.createDiv({ cls: "empty-state", text: "选择一个文件以查看其附件" });
        
        this.addAttachmentsStyles();
        
        return wrapper;
    }
    
    // === 辅助方法 ===
    
    /**
     * 获取所有Markdown文件
     */
    private getMarkdownFiles(): TFile[] {
        const files: TFile[] = [];
        
        this.app.vault.getMarkdownFiles().forEach((file) => {
            files.push(file);
        });
        
        return files;
    }
    
    /**
     * 获取所有文件
     */
    private getAllFiles(): TFile[] {
        const files: TFile[] = [];
        
        this.app.vault.getFiles().forEach((file) => {
            files.push(file);
        });
        
        return files;
    }
    
    /**
     * 获取所有文件夹
     */
    private getAllFolders(): TFolder[] {
        const folders: TFolder[] = [];
        
        const recurseFolder = (folder: TFolder) => {
            folders.push(folder);
            
            folder.children.forEach(child => {
                if (child instanceof TFolder) {
                    recurseFolder(child);
                }
            });
        };
        
        recurseFolder(this.app.vault.getRoot());
        
        return folders;
    }
    
    /**
     * 渲染文件搜索结果
     */
    private renderFileResults(container: HTMLElement, files: TFile[], callback?: (file: TFile) => void): void {
        const MAX_RESULTS = 10;
        const limitedFiles = files.slice(0, MAX_RESULTS);
        
        limitedFiles.forEach(file => {
            const fileItem = container.createDiv({ cls: "search-result-item" });
            
            // 添加文件图标
            const iconContainer = fileItem.createDiv({ cls: "result-icon" });
            const fileExtension = file.extension;
            
            if (fileExtension === "md") {
                setIcon(iconContainer, "document");
            } else if (["png", "jpg", "jpeg", "gif", "svg"].includes(fileExtension)) {
                setIcon(iconContainer, "image-file");
            } else if (["mp3", "wav", "ogg"].includes(fileExtension)) {
                setIcon(iconContainer, "audio-file");
            } else if (["mp4", "webm", "mov"].includes(fileExtension)) {
                setIcon(iconContainer, "video-file");
            } else if (["pdf"].includes(fileExtension)) {
                setIcon(iconContainer, "pdf-file");
            } else {
                setIcon(iconContainer, "file");
            }
            
            // 文件名和路径
            const fileInfo = fileItem.createDiv({ cls: "result-content" });
            fileInfo.createDiv({ text: file.name, cls: "result-title" });
            fileInfo.createDiv({ text: file.path, cls: "result-path" });
            
            fileItem.addEventListener("click", () => {
                if (callback) {
                    callback(file);
                }
                
                // 保存到输入框的数据属性中
                const inputEl = container.parentElement?.querySelector(".search-input") as HTMLInputElement;
                if (inputEl) {
                    inputEl.value = file.name;
                    inputEl.dataset.selectedPath = file.path;
                }
                
                container.hide();
            });
        });
        
        if (files.length > MAX_RESULTS) {
            container.createDiv({
                text: `显示前 ${MAX_RESULTS} 个结果，共 ${files.length} 个匹配`,
                cls: "search-results-more"
            });
        }
    }
    
    /**
     * 渲染文件夹搜索结果
     */
    private renderFolderResults(container: HTMLElement, folders: TFolder[], callback?: (folder: TFolder) => void): void {
        const MAX_RESULTS = 10;
        const limitedFolders = folders.slice(0, MAX_RESULTS);
        
        limitedFolders.forEach(folder => {
            const folderItem = container.createDiv({ cls: "search-result-item" });
            
            // 添加文件夹图标
            const iconContainer = folderItem.createDiv({ cls: "result-icon" });
            setIcon(iconContainer, "folder");
            
            // 文件夹名和路径
            const folderInfo = folderItem.createDiv({ cls: "result-content" });
            folderInfo.createDiv({ text: folder.name, cls: "result-title" });
            folderInfo.createDiv({ text: folder.path, cls: "result-path" });
            
            folderItem.addEventListener("click", () => {
                if (callback) {
                    callback(folder);
                }
                
                // 保存到输入框的数据属性中
                const inputEl = container.parentElement?.querySelector(".search-input") as HTMLInputElement;
                if (inputEl) {
                    inputEl.value = folder.name;
                    inputEl.dataset.selectedPath = folder.path;
                }
                
                container.hide();
            });
        });
        
        if (folders.length > MAX_RESULTS) {
            container.createDiv({
                text: `显示前 ${MAX_RESULTS} 个结果，共 ${folders.length} 个匹配`,
                cls: "search-results-more"
            });
        }
    }
    
    /**
     * 分析文件链接
     */
    private analyzeFileLinks(file: TFile, container: HTMLElement): void {
        container.empty();
        
        // 创建结果容器
        const resultsWrapper = container.createDiv({ cls: "analyzer-content" });
        
        // 标题显示当前文件名
        resultsWrapper.createEl("h4", { text: `文件: ${file.name}` });
        
        // 获取文件元数据
        const metadata = this.app.metadataCache.getFileCache(file);
        
        // 1. 获取出链信息
        const outlinksSection = resultsWrapper.createDiv({ cls: "links-section" });
        outlinksSection.createEl("h5", { text: "出链 (Outgoing Links)", cls: "section-title" });
        const outlinks = this.getFileOutlinks(file, metadata);
        this.renderLinksList(outlinksSection, outlinks, "出链");
        
        // 2. 获取入链信息
        const inlinksSection = resultsWrapper.createDiv({ cls: "links-section" });
        inlinksSection.createEl("h5", { text: "入链 (Incoming Links)", cls: "section-title" });
        const inlinks = this.getFileInlinks(file);
        this.renderLinksList(inlinksSection, inlinks, "入链");
        
        // 3. 获取附件信息
        const attachmentsSection = resultsWrapper.createDiv({ cls: "links-section" });
        attachmentsSection.createEl("h5", { text: "附件 (Attachments)", cls: "section-title" });
        const attachments = this.getFileAttachments(file, metadata);
        this.renderAttachmentsList(attachmentsSection, attachments);
    }
    
    /**
     * 获取文件的出链
     */
    private getFileOutlinks(file: TFile, metadata?: CachedMetadata): {link: string, displayText: string}[] {
        const links: {link: string, displayText: string}[] = [];
        
        if (!metadata) {
            metadata = this.app.metadataCache.getFileCache(file);
        }
        
        if (metadata && metadata.links) {
            metadata.links.forEach(link => {
                links.push({
                    link: link.link,
                    displayText: link.displayText || link.link
                });
            });
        }
        
        return links;
    }
    
    /**
     * 获取文件的入链
     */
    private getFileInlinks(file: TFile): {link: string, displayText: string}[] {
        const links: {link: string, displayText: string}[] = [];
        const fileBasename = file.basename;
        
        // 遍历所有Markdown文件寻找指向此文件的链接
        this.app.metadataCache.iterateReferences(fileBasename, (sourcePath) => {
            const sourceFile = this.app.vault.getFileByPath(sourcePath);
            if (sourceFile && sourceFile instanceof TFile) {
                links.push({
                    link: sourceFile.path,
                    displayText: sourceFile.basename
                });
            }
        });
        
        return links;
    }
    
    /**
     * 获取文件的附件
     */
    private getFileAttachments(file: TFile, metadata?: CachedMetadata): {path: string, type: string}[] {
        const attachments: {path: string, type: string}[] = [];
        
        if (!metadata) {
            metadata = this.app.metadataCache.getFileCache(file);
        }
        
        // 检查嵌入内容
        if (metadata && metadata.embeds) {
            metadata.embeds.forEach(embed => {
                const embedFile = this.app.metadataCache.getFirstLinkpathDest(embed.link, file.path);
                
                if (embedFile && embedFile instanceof TFile && embedFile !== file) {
                    const type = this.getFileType(embedFile);
                    attachments.push({
                        path: embedFile.path,
                        type: type
                    });
                }
            });
        }
        
        return attachments;
    }
    
    /**
     * 获取文件类型
     */
    private getFileType(file: TFile): string {
        const ext = file.extension.toLowerCase();
        
        if (ext === "md") return "markdown";
        if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return "image";
        if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
        if (["mp4", "webm", "ogv", "mov"].includes(ext)) return "video";
        if (ext === "pdf") return "pdf";
        return "other";
    }
    
    /**
     * 渲染链接列表
     */
    private renderLinksList(container: HTMLElement, links: {link: string, displayText: string}[], type: string): void {
        if (links.length === 0) {
            container.createDiv({ text: `没有${type}`, cls: "empty-list" });
            return;
        }
        
        const linksList = container.createEl("ul", { cls: "links-list" });
        
        links.forEach(link => {
            const listItem = linksList.createEl("li", { cls: "link-item" });
            
            // 链接图标
            const linkIcon = listItem.createSpan({ cls: "link-icon" });
            setIcon(linkIcon, "link");
            
            // 链接文本
            const linkText = listItem.createSpan({ 
                text: link.displayText, 
                cls: "link-text" 
            });
            
            // 点击跳转
            listItem.addEventListener("click", () => {
                // 尝试打开链接
                const targetFile = this.app.metadataCache.getFirstLinkpathDest(link.link, "");
                if (targetFile && targetFile instanceof TFile) {
                    this.app.workspace.getLeaf().openFile(targetFile);
                }
            });
        });
    }
    
    /**
     * 渲染附件列表
     */
    private renderAttachmentsList(container: HTMLElement, attachments: {path: string, type: string}[]): void {
        if (attachments.length === 0) {
            container.createDiv({ text: "没有附件", cls: "empty-list" });
            return;
        }
        
        const attachmentsList = container.createDiv({ cls: "attachments-list" });
        
        attachments.forEach(attachment => {
            const attachmentItem = attachmentsList.createDiv({ cls: "attachment-item" });
            
            // 附件图标
            const iconContainer = attachmentItem.createDiv({ cls: "attachment-icon" });
            switch(attachment.type) {
                case "image":
                    setIcon(iconContainer, "image-file");
                    break;
                case "audio":
                    setIcon(iconContainer, "audio-file");
                    break;
                case "video":
                    setIcon(iconContainer, "video-file");
                    break;
                case "pdf":
                    setIcon(iconContainer, "pdf-file");
                    break;
                default:
                    setIcon(iconContainer, "file");
            }
            
            // 附件名称
            const nameParts = attachment.path.split("/");
            const name = nameParts[nameParts.length - 1];
            attachmentItem.createDiv({ text: name, cls: "attachment-name" });
            
            // 预览按钮
            const previewBtn = attachmentItem.createDiv({ cls: "attachment-action" });
            setIcon(previewBtn, "eye");
            previewBtn.addEventListener("click", () => {
                const file = this.app.vault.getFileByPath(attachment.path);
                if (file && file instanceof TFile) {
                    this.app.workspace.getLeaf().openFile(file);
                }
            });
        });
    }
    
    /**
     * 展示文件的附件
     */
    private showFileAttachments(file: TFile, container: HTMLElement): void {
        container.empty();
        
        // 获取文件元数据
        const metadata = this.app.metadataCache.getFileCache(file);
        
        // 获取所有附件
        const attachments = this.getFileAttachments(file, metadata);
        
        // 创建附件展示区
        container.createEl("h5", { text: `${file.name} 的附件` });
        
        if (attachments.length === 0) {
            container.createDiv({ cls: "empty-state", text: "该文件没有附件" });
            return;
        }
        
        // 创建附件网格
        const attachmentsGrid = container.createDiv({ cls: "attachments-grid" });
        
        // 按类型分组
        const imageAttachments = attachments.filter(a => a.type === "image");
        const nonImageAttachments = attachments.filter(a => a.type !== "image");
        
        // 优先显示图片
        if (imageAttachments.length > 0) {
            const imageSection = attachmentsGrid.createDiv({ cls: "attachments-section" });
            imageSection.createEl("h6", { text: "图片" });
            
            const imagesGrid = imageSection.createDiv({ cls: "images-grid" });
            
            imageAttachments.forEach(async attachment => {
                const imageFile = this.app.vault.getFileByPath(attachment.path);
                if (imageFile && imageFile instanceof TFile) {
                    const imageItem = imagesGrid.createDiv({ cls: "image-thumb-container" });
                    
                    try {
                        // 获取图片 URL
                        const url = this.app.vault.getResourcePath(imageFile);
                        
                        // 创建缩略图
                        const img = imageItem.createEl("img", {
                            cls: "image-thumb",
                            attr: { src: url }
                        });
                        
                        // 添加图片名称
                        imageItem.createDiv({ text: imageFile.name, cls: "image-name" });
                        
                        // 点击打开图片
                        imageItem.addEventListener("click", () => {
                            this.app.workspace.getLeaf().openFile(imageFile);
                        });
                    } catch (e) {
                        imageItem.createDiv({ text: "加载图片失败", cls: "error-message" });
                    }
                }
            });
        }
        
        // 显示其他附件
        if (nonImageAttachments.length > 0) {
            const otherSection = attachmentsGrid.createDiv({ cls: "attachments-section" });
            otherSection.createEl("h6", { text: "其他附件" });
            
            const otherFiles = otherSection.createDiv({ cls: "other-files" });
            
            nonImageAttachments.forEach(attachment => {
                const fileItem = otherFiles.createDiv({ cls: "file-item" });
                
                // 文件图标
                const iconContainer = fileItem.createDiv({ cls: "file-icon" });
                switch(attachment.type) {
                    case "audio":
                        setIcon(iconContainer, "audio-file");
                        break;
                    case "video":
                        setIcon(iconContainer, "video-file");
                        break;
                    case "pdf":
                        setIcon(iconContainer, "pdf-file");
                        break;
                    default:
                        setIcon(iconContainer, "file");
                }
                
                // 文件信息
                const fileInfo = fileItem.createDiv({ cls: "file-info" });
                fileInfo.createDiv({ text: attachment.path.split("/").pop() || "", cls: "file-name" });
                fileInfo.createDiv({ text: attachment.type, cls: "file-type" });
                
                // 打开按钮
                const openBtn = fileItem.createDiv({ cls: "file-action" });
                setIcon(openBtn, "link-2");
                
                openBtn.addEventListener("click", () => {
                    const file = this.app.vault.getFileByPath(attachment.path);
                    if (file && file instanceof TFile) {
                        this.app.workspace.getLeaf().openFile(file);
                    }
                });
            });
        }
    }
    
    /**
     * 渲染文件关系图
     */
    private renderFileGraph(file: TFile, container: HTMLElement, depthStr: string = "1"): void {
        container.empty();
        const depth = parseInt(depthStr) || 1;
        
        // 创建画布容器
        const canvasContainer = container.createDiv({ cls: "graph-canvas-container" });
        
        // 创建信息面板
        const infoPanel = container.createDiv({ cls: "graph-info-panel" });
        infoPanel.createEl("h6", { text: `${file.name} 的链接关系` });
        
        // 获取节点数据
        const graphData = this.generateGraphData(file, depth);
        
        // 显示节点和链接数量
        infoPanel.createDiv({ 
            text: `共 ${graphData.nodes.length} 个文件, ${graphData.links.length} 个链接`, 
            cls: "graph-stats" 
        });
        
        // 创建图例
        const legend = infoPanel.createDiv({ cls: "graph-legend" });
        
        const centralNode = legend.createDiv({ cls: "legend-item" });
        centralNode.createDiv({ cls: "legend-color central" });
        centralNode.createDiv({ text: "中心文件", cls: "legend-text" });
        
        const outNode = legend.createDiv({ cls: "legend-item" });
        outNode.createDiv({ cls: "legend-color outlink" });
        outNode.createDiv({ text: "出链文件", cls: "legend-text" });
        
        const inNode = legend.createDiv({ cls: "legend-item" });
        inNode.createDiv({ cls: "legend-color inlink" });
        inNode.createDiv({ text: "入链文件", cls: "legend-text" });
        
        const bothNode = legend.createDiv({ cls: "legend-item" });
        bothNode.createDiv({ cls: "legend-color both" });
        bothNode.createDiv({ text: "双向链接", cls: "legend-text" });
        
        // 渲染关系图
        this.drawGraphNetwork(canvasContainer, graphData, file);
    }
    
    /**
     * 生成图谱数据
     */
    private generateGraphData(centralFile: TFile, depth: number = 1): {nodes: any[], links: any[]} {
        const nodes: {id: string, name: string, type: string, level: number}[] = [];
        const links: {source: string, target: string, direction: string}[] = [];
        const processedFiles = new Set<string>();
        
        // 添加中心节点
        nodes.push({
            id: centralFile.path,
            name: centralFile.basename,
            type: "central",
            level: 0
        });
        processedFiles.add(centralFile.path);
        
        // 递归处理链接关系
        const processNodeLinks = (file: TFile, currentDepth: number) => {
            if (currentDepth > depth) return;
            
            // 获取出链
            const outlinks = this.getFileOutlinks(file);
            outlinks.forEach(outlink => {
                const targetFile = this.app.metadataCache.getFirstLinkpathDest(outlink.link, file.path);
                if (targetFile && targetFile instanceof TFile) {
                    // 添加链接
                    links.push({
                        source: file.path,
                        target: targetFile.path,
                        direction: "out"
                    });
                    
                    // 如果节点还未处理，添加到节点列表
                    if (!processedFiles.has(targetFile.path)) {
                        nodes.push({
                            id: targetFile.path,
                            name: targetFile.basename,
                            type: "outlink",
                            level: currentDepth
                        });
                        processedFiles.add(targetFile.path);
                        
                        // 递归处理下一级
                        if (currentDepth < depth) {
                            processNodeLinks(targetFile, currentDepth + 1);
                        }
                    }
                }
            });
            
            // 获取入链
            const inlinks = this.getFileInlinks(file);
            inlinks.forEach(inlink => {
                const sourceFile = this.app.vault.getFileByPath(inlink.link);
                if (sourceFile && sourceFile instanceof TFile) {
                    // 添加链接
                    links.push({
                        source: sourceFile.path,
                        target: file.path,
                        direction: "in"
                    });
                    
                    // 如果节点还未处理，添加到节点列表
                    if (!processedFiles.has(sourceFile.path)) {
                        nodes.push({
                            id: sourceFile.path,
                            name: sourceFile.basename,
                            type: "inlink",
                            level: currentDepth
                        });
                        processedFiles.add(sourceFile.path);
                        
                        // 递归处理下一级
                        if (currentDepth < depth) {
                            processNodeLinks(sourceFile, currentDepth + 1);
                        }
                    }
                }
            });
        };
        
        // 开始处理
        processNodeLinks(centralFile, 1);
        
        // 识别双向链接
        for (const node of nodes) {
            if (node.id === centralFile.path) continue; // 跳过中心节点
            
            // 检查是否同时存在入链和出链
            const hasInlink = links.some(link => 
                link.source === node.id && link.target === centralFile.path
            );
            
            const hasOutlink = links.some(link => 
                link.source === centralFile.path && link.target === node.id
            );
            
            if (hasInlink && hasOutlink) {
                node.type = "both"; // 更新为双向链接
            }
        }
        
        return { nodes, links };
    }
    
    /**
     * 绘制关系图
     * 注意：此处只是简单模拟，实际项目可能会使用D3.js等库实现更复杂的可视化
     */
    private drawGraphNetwork(container: HTMLElement, data: {nodes: any[], links: any[]}, centralFile: TFile): void {
        try { // 添加错误处理
            // 创建SVG容器
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.classList.add("graph-svg");
            container.appendChild(svg);
            
            // 设置SVG视窗
            const viewBox = svg.viewBox.baseVal;
            viewBox.x = -150;
            viewBox.y = -150;
            viewBox.width = 300;
            viewBox.height = 300;
            
            // 节点坐标映射，避免重复计算
            const nodePositions: Record<string, {x: number, y: number}> = {};
            
            // 优化：先计算并存储所有节点位置
            data.nodes.forEach((node, idx) => {
                let x, y;
                if (node.id === centralFile.path) {
                    x = 0;
                    y = 0;
                } else {
                    const angle = (idx * (2 * Math.PI / data.nodes.length));
                    const radius = 50 + (node.level * 30); // 减小半径增量，避免过大
                    x = radius * Math.cos(angle);
                    y = radius * Math.sin(angle);
                }
                nodePositions[node.id] = {x, y};
            });
            
            // 创建连线 - 修复数据属性设置
            data.links.forEach((link, index) => {
                const sourcePos = nodePositions[link.source];
                const targetPos = nodePositions[link.target];
                
                if (sourcePos && targetPos) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", sourcePos.x.toString());
                    line.setAttribute("y1", sourcePos.y.toString());
                    line.setAttribute("x2", targetPos.x.toString());
                    line.setAttribute("y2", targetPos.y.toString());
                    
                    // 设置不同类型链接的样式
                    if (link.source === centralFile.path) {
                        line.classList.add("link", "outgoing-link");
                    } else if (link.target === centralFile.path) {
                        line.classList.add("link", "incoming-link");
                    } else {
                        line.classList.add("link", "normal-link");
                    }
                    
                    // 设置正确的数据属性
                    line.setAttribute("data-source", link.source);
                    line.setAttribute("data-target", link.target);
                    
                    svg.appendChild(line);
                }
            });
            
            // 创建节点 - 限制最大节点数量以提高性能
            const MAX_VISIBLE_NODES = 30;
            const visibleNodes = data.nodes.length > MAX_VISIBLE_NODES
                ? [data.nodes[0]].concat(data.nodes.slice(1, MAX_VISIBLE_NODES))
                : data.nodes;
                
            visibleNodes.forEach((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return;
                
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("r", node.id === centralFile.path ? "10" : "6");
                circle.setAttribute("cx", pos.x.toString());
                circle.setAttribute("cy", pos.y.toString());
                circle.classList.add("node", node.type);
                
                // 添加标签
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.textContent = node.name;
                text.setAttribute("x", (pos.x + 10).toString());
                text.setAttribute("y", pos.y.toString());
                text.classList.add("node-label");
                
                svg.appendChild(circle);
                svg.appendChild(text);
                
                // 点击节点打开对应文件
                circle.addEventListener("click", () => {
                    const nodeFile = this.app.vault.getFileByPath(node.id);
                    if (nodeFile && nodeFile instanceof TFile) {
                        this.app.workspace.getLeaf().openFile(nodeFile);
                    }
                });
            });
            
            if (data.nodes.length > MAX_VISIBLE_NODES) {
                const infoText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                infoText.textContent = `显示前 ${MAX_VISIBLE_NODES} 个节点，共 ${data.nodes.length} 个`;
                infoText.setAttribute("x", "0");
                infoText.setAttribute("y", "120");
                infoText.setAttribute("text-anchor", "middle");
                infoText.classList.add("graph-info-text");
                svg.appendChild(infoText);
            }
            
            // 添加拖拽和缩放交互 - 修复事件监听问题
            this.addSvgInteraction(svg, container);
        } catch (error) {
            console.error("绘制关系图出错:", error);
            container.empty();
            container.createEl("div", { 
                text: "绘制图表时出错。请尝试选择不同的文件或减小链接深度。", 
                cls: "error-message" 
            });
        }
    }
    
    /**
     * 添加SVG交互性 - 修复事件监听器问题
     */
    private addSvgInteraction(svg: SVGSVGElement, container: HTMLElement): void {
        let isDragging = false;
        let startX: number, startY: number;
        let viewBoxValues = { x: -150, y: -150, width: 300, height: 300 };
        
        // 更新视图框
        const updateViewBox = () => {
            svg.setAttribute("viewBox", `${viewBoxValues.x} ${viewBoxValues.y} ${viewBoxValues.width} ${viewBoxValues.height}`);
        };
        
        // 保存事件监听器引用，以便后续移除
        const mouseMoveHandler = (e: MouseEvent) => {
            if (!isDragging) return;
            
            const dx = (e.clientX - startX) * viewBoxValues.width / svg.clientWidth;
            const dy = (e.clientY - startY) * viewBoxValues.height / svg.clientHeight;
            
            viewBoxValues.x -= dx;
            viewBoxValues.y -= dy;
            
            updateViewBox();
            
            startX = e.clientX;
            startY = e.clientY;
        };
        
        const mouseUpHandler = () => {
            isDragging = false;
        };
        
        // 使用局部事件监听而非全局监听
        svg.addEventListener("mousedown", (e) => {
            if (e.button !== 0) return; // 只响应左键
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            e.preventDefault(); // 防止文本选择
        });
        
        svg.addEventListener("mousemove", mouseMoveHandler);
        svg.addEventListener("mouseup", mouseUpHandler);
        svg.addEventListener("mouseleave", mouseUpHandler);
        
        // 鼠标滚轮 - 缩放
        svg.addEventListener("wheel", (e) => {
            e.preventDefault();
            
            const scaleFactor = e.deltaY > 0 ? 1.1 : 0.9;
            
            // 计算鼠标位置在视图框中的坐标
            const point = svg.createSVGPoint();
            point.x = e.clientX;
            point.y = e.clientY;
            // 防止空指针错误
            const svgMatrix = svg.getScreenCTM();
            if (!svgMatrix) return;
            
            const svgPoint = point.matrixTransform(svgMatrix.inverse());
            
            // 以鼠标位置为中心进行缩放
            viewBoxValues.x = svgPoint.x - (svgPoint.x - viewBoxValues.x) * scaleFactor;
            viewBoxValues.y = svgPoint.y - (svgPoint.y - viewBoxValues.y) * scaleFactor;
            viewBoxValues.width *= scaleFactor;
            viewBoxValues.height *= scaleFactor;
            
            updateViewBox();
        });
        
        // 添加清理函数到容器
        container.dataset.hasCleanup = "true";
        const originalRemove = container.remove.bind(container);
        container.remove = function() {
            svg.removeEventListener("mousemove", mouseMoveHandler);
            svg.removeEventListener("mouseup", mouseUpHandler);
            svg.removeEventListener("mouseleave", mouseUpHandler);
            originalRemove();
        };
    }
    
    // === 样式方法 ===
    
    /**
     * 添加搜索组件样式
     */
    private addSearchStyles(): void {
        if (!document.getElementById('obsidian-features-search-styles')) {
            const style = document.head.createEl('style');
            style.id = 'obsidian-features-search-styles';
            style.textContent = `
                .search-input-container {
                    position: relative;
                    width: 100%;
                    margin-bottom: 10px;
                }
                
                .search-input {
                    width: 100%;
                    padding: 8px 10px 8px 30px;
                    border-radius: var(--radius-s);
                    border: 1px solid var(--background-modifier-border);
                    background-color: var(--background-primary);
                    color: var(--text-normal);
                    font-size: 14px;
                }
                
                .search-input:focus {
                    border-color: var(--interactive-accent);
                    outline: none;
                }
                
                .search-input-icon {
                    position: absolute;
                    left: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    pointer-events: none;
                }
                
                .search-results {
                    position: absolute;
                    width: 100%;
                    max-height: 300px;
                    overflow-y: auto;
                    background-color: var(--background-primary);
                    border: 1px solid var(--background-modifier-border);
                    border-radius: var(--radius-s);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    z-index: 100;
                }
                
                .search-result-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 12px;
                    cursor: pointer;
                    border-bottom: 1px solid var(--background-modifier-border);
                }
                
                .search-result-item:last-child {
                    border-bottom: none;
                }
                
                .search-result-item:hover {
                    background-color: var(--background-modifier-hover);
                }
                
                .result-icon {
                    margin-right: 10px;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .result-content {
                    flex: 1;
                }
                
                .result-title {
                    color: var(--text-normal);
                    font-weight: 500;
                }
                
                .result-path {
                    color: var(--text-muted);
                    font-size: 12px;
                    margin-top: 2px;
                }
                
                .search-results-more {
                    padding: 8px 12px;
                    color: var(--text-muted);
                    font-size: 12px;
                    background-color: var(--background-secondary);
                    text-align: center;
                }
            `;
        }
    }
    
    /**
     * 添加分析器样式
     */
    private addAnalyzerStyles(): void {
        if (!document.getElementById('obsidian-features-analyzer-styles')) {
            const style = document.head.createEl('style');
            style.id = 'obsidian-features-analyzer-styles';
            style.textContent = `
                .file-analyzer {
                    background-color: var(--background-primary);
                    border-radius: var(--radius-m);
                    padding: 15px;
                    margin-bottom: 20px;
                }
                
                .file-selector {
                    margin-bottom: 20px;
                }
                
                .analyzer-content {
                    padding: 15px;
                    background-color: var(--background-secondary);
                    border-radius: var(--radius-m);
                }
                
                .links-section {
                    margin-bottom: 20px;
                }
                
                .section-title {
                    color: var(--text-accent);
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid var(--background-modifier-border);
                }
                
                .links-list {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                
                .link-item {
                    display: flex;
                    align-items: center;
                    padding: 5px 8px;
                    margin-bottom: 5px;
                    border-radius: var(--radius-s);
                    background-color: var(--background-primary);
                    cursor: pointer;
                }
                
                .link-item:hover {
                    background-color: var(--background-modifier-hover);
                }
                
                .link-icon {
                    color: var(--text-accent);
                    margin-right: 8px;
                    display: flex;
                    align-items: center;
                }
                
                .link-text {
                    color: var(--text-normal);
                    flex: 1;
                }
                
                .empty-list {
                    color: var(--text-muted);
                    padding: 10px;
                    font-style: italic;
                    background-color: var(--background-primary);
                    border-radius: var(--radius-s);
                    text-align: center;
                }
                
                .attachments-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 10px;
                }
                
                .attachment-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 12px;
                    background-color: var(--background-primary);
                    border-radius: var(--radius-s);
                }
                
                .attachment-icon {
                    color: var(--text-accent);
                    margin-right: 8px;
                }
                
                .attachment-name {
                    flex: 1;
                    color: var(--text-normal);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .attachment-action {
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 4px;
                }
                
                .attachment-action:hover {
                    color: var(--text-accent);
                }
            `;
        }
    }
    
    /**
     * 添加附件查看器样式
     */
    private addAttachmentsStyles(): void {
        if (!document.getElementById('obsidian-features-attachments-styles')) {
            const style = document.head.createEl('style');
            style.id = 'obsidian-features-attachments-styles';
            style.textContent = `
                .attachments-viewer {
                    background-color: var(--background-primary);
                    border-radius: var(--radius-m);
                    padding: 15px;
                    margin-bottom: 20px;
                }
                
                .attachments-container {
                    margin-top: 15px;
                    padding: 15px;
                    background-color: var(--background-secondary);
                    border-radius: var(--radius-m);
                    min-height: 200px;
                }
                
                .empty-state {
                    color: var(--text-muted);
                    text-align: center;
                    padding: 20px;
                    font-style: italic;
                }
                
                .attachments-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .attachments-section {
                    margin-bottom: 15px;
                }
                
                .images-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 10px;
                }
                
                .image-thumb-container {
                    display: flex;
                    flex-direction: column;
                    background-color: var(--background-primary);
                    border-radius: var(--radius-s);
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                
                .image-thumb-container:hover {
                    transform: scale(1.05);
                }
                
                .image-thumb {
                    width: 100%;
                    height: 120px;
                    object-fit: cover;
                }
                
                .image-name {
                    padding: 8px;
                    color: var(--text-normal);
                    font-size: 12px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .other-files {
                    margin-top: 10px;
                }
                
                .file-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    border-radius: var(--radius-s);
                    background-color: var(--background-primary);
                }
                
                .file-icon {
                    color: var(--text-accent);
                    margin-right: 10px;
                }
                
                .file-info {
                    flex: 1;
                }
                
                .file-name {
                    color: var(--text-normal);
                    margin-bottom: 2px;
                }
                
                .file-type {
                    color: var(--text-muted);
                    font-size: 12px;
                }
                
                .file-action {
                    padding: 4px;
                    cursor: pointer;
                    color: var(--text-muted);
                }
                
                .file-action:hover {
                    color: var(--text-accent);
                }
                
                .error-message {
                    color: var(--text-error);
                    padding: 10px;
                    text-align: center;
                    font-size: 12px;
                }
            `;
        }
    }
    
    /**
     * 添加图表样式
     */
    private addGraphStyles(): void {
        if (!document.getElementById('obsidian-features-graph-styles')) {
            const style = document.head.createEl('style');
            style.id = 'obsidian-features-graph-styles';
            style.textContent = `
                .file-graph-container {
                    display: flex;
                    flex-direction: column;
                    background-color: var(--background-primary);
                    border-radius: var(--radius-m);
                    padding: 15px;
                    height: 500px;
                    overflow: hidden;
                }
                
                .graph-control-panel {
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--background-modifier-border);
                    margin-bottom: 15px;
                }
                
                .graph-file-select,
                .graph-depth-select {
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                }
                
                .graph-label {
                    width: 100px;
                    color: var(--text-muted);
                }
                
                .depth-select {
                    background-color: var(--background-primary);
                    border: 1px solid var(--background-modifier-border);
                    color: var(--text-normal);
                    border-radius: var(--radius-s);
                    padding: 6px 10px;
                }
                
                .graph-view {
                    flex: 1;
                    background-color: var(--background-secondary);
                    border-radius: var(--radius-m);
                    position: relative;
                    overflow: hidden;
                }
                
                .graph-placeholder {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: var(--text-muted);
                    text-align: center;
                    font-style: italic;
                    width: 80%;
                }
                
                .graph-info-panel {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background-color: rgba(var(--background-primary-rgb), 0.8);
                    padding: 10px;
                    border-radius: var(--radius-s);
                    z-index: 10;
                    max-width: 250px;
                }
                
                .graph-stats {
                    color: var(--text-muted);
                    font-size: 12px;
                    margin-bottom: 8px;
                }
                
                .graph-legend {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    margin-right: 10px;
                }
                
                .legend-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    margin-right: 5px;
                }
                
                .legend-color.central {
                    background-color: #ff6b6b;
                }
                
                .legend-color.outlink {
                    background-color: #4ecdc4;
                }
                
                .legend-color.inlink {
                    background-color: #ffd166;
                }
                
                .legend-color.both {
                    background-color: #a06cd5;
                }
                
                .legend-text {
                    color: var(--text-muted);
                    font-size: 11px;
                }
                
                .graph-canvas-container {
                    width: 100%;
                    height: 100%;
                }
                
                .graph-svg {
                    width: 100%;
                    height: 100%;
                    cursor: grab;
                }
                
                .graph-svg:active {
                    cursor: grabbing;
                }
                
                .node {
                    cursor: pointer;
                }
                
                .node.central {
                    fill: #ff6b6b;
                }
                
                .node.outlink {
                    fill: #4ecdc4;
                }
                
                .node.inlink {
                    fill: #ffd166;
                }
                
                .node.both {
                    fill: #a06cd5;
                }
                
                .node-label {
                    fill: var(--text-normal);
                    font-size: 10px;
                    text-anchor: start;
                    pointer-events: none;
                }
                
                .link {
                    stroke-width: 1.5;
                    stroke-opacity: 0.6;
                }
                
                .link.outgoing-link {
                    stroke: #4ecdc4;
                }
                
                .link.incoming-link {
                    stroke: #ffd166;
                }
                
                .link.normal-link {
                    stroke: var(--text-muted);
                    stroke-opacity: 0.3;
                }
            `;
        }
    }
}
