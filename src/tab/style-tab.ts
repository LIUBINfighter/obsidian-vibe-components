import { Notice, setIcon } from "obsidian";

/**
 * Obsidian 样式标签页
 * 展示 Obsidian 的设计风格和 CSS 变量
 */
export class ObsidianStyleTab {
    /**
     * 创建 Obsidian 样式标签页内容
     * @param container 容器元素
     */
    static create(container: HTMLElement): void {
        // 添加标题和说明
        container.createEl('h3', { text: 'Obsidian 样式指南' });
        container.createEl('p', { text: '本页展示 Obsidian 的设计风格和 CSS 变量，帮助开发者创建符合 Obsidian 风格的插件' });
        
        // 添加分割线
        container.createEl('hr');
        
        // 展示色彩面板
        this.createColorPalette(container);
        
        // 展示排版样式
        this.createTypography(container);
        
        // 展示各种UI元素样式变量
        this.createUIElementsStyles(container);
        
        // 添加样式
        this.addStyles();
    }
    
    /**
     * 创建颜色面板
     * @param container 容器元素
     */
    private static createColorPalette(container: HTMLElement): void {
        const section = container.createDiv({ cls: 'style-section' });
        section.createEl('h4', { text: '颜色变量' });
        section.createEl('p', { text: '以下是 Obsidian 中常用的颜色变量，这些变量会根据当前主题自动调整' });
        
        const colorGrid = section.createDiv({ cls: 'color-grid' });
        
        // 背景颜色
        this.createColorItem(colorGrid, '--background-primary', '主要背景色');
        this.createColorItem(colorGrid, '--background-secondary', '次要背景色');
        this.createColorItem(colorGrid, '--background-secondary-alt', '次要背景色 (alt)');
        this.createColorItem(colorGrid, '--background-modifier-border', '边框颜色');
        this.createColorItem(colorGrid, '--background-modifier-hover', '悬停背景色');
        
        // 文本颜色
        this.createColorItem(colorGrid, '--text-normal', '普通文本颜色');
        this.createColorItem(colorGrid, '--text-muted', '次要文本颜色');
        this.createColorItem(colorGrid, '--text-accent', '强调文本颜色');
        this.createColorItem(colorGrid, '--text-error', '错误文本颜色');
        
        // 交互颜色
        this.createColorItem(colorGrid, '--interactive-normal', '普通交互元素颜色');
        this.createColorItem(colorGrid, '--interactive-hover', '交互元素悬停颜色');
        this.createColorItem(colorGrid, '--interactive-accent', '主题色/强调色');
        this.createColorItem(colorGrid, '--interactive-accent-hover', '主题色悬停状态');
    }
    
    /**
     * 创建单个颜色样本项
     */
    private static createColorItem(container: HTMLElement, variable: string, description: string): void {
        const item = container.createDiv({ cls: 'color-item' });
        
        // 颜色样本
        const colorBox = item.createDiv({ cls: 'color-box' });
        colorBox.style.backgroundColor = `var(${variable})`;
        
        // 变量名与描述
        const details = item.createDiv({ cls: 'color-details' });
        details.createEl('div', { text: variable, cls: 'var-name' });
        details.createEl('div', { text: description, cls: 'var-desc' });
        
        // 单击复制变量名
        item.addEventListener('click', () => {
            navigator.clipboard.writeText(variable);
            new Notice(`已复制: ${variable}`);
        });
    }
    
    /**
     * 创建排版样式展示
     */
    private static createTypography(container: HTMLElement): void {
        const section = container.createDiv({ cls: 'style-section' });
        section.createEl('h4', { text: '排版与字体' });
        
        // 标题样式
        const headingsSection = section.createDiv({ cls: 'typography-section' });
        headingsSection.createEl('h5', { text: '标题样式' });
        
        headingsSection.createEl('div', { 
            text: '标题 1 样式', 
            cls: 'typography-demo heading1',
            attr: { 'data-var': '--heading-h1' }
        });
        headingsSection.createEl('div', { 
            text: '标题 2 样式', 
            cls: 'typography-demo heading2',
            attr: { 'data-var': '--heading-h2' }
        });
        headingsSection.createEl('div', { 
            text: '标题 3 样式', 
            cls: 'typography-demo heading3',
            attr: { 'data-var': '--heading-h3' }
        });
        
        // 正文字体
        const textSection = section.createDiv({ cls: 'typography-section' });
        textSection.createEl('h5', { text: '文本样式' });
        
        textSection.createEl('div', { 
            text: '正常文本样式 (--font-text-size和--font-family-preview)', 
            cls: 'typography-demo text-normal' 
        });
        
        textSection.createEl('div', { 
            text: '等宽字体样式 (--font-monospace-size和--font-family-monospace)', 
            cls: 'typography-demo text-mono' 
        });
    }
    
    /**
     * 创建UI元素样式变量展示
     */
    private static createUIElementsStyles(container: HTMLElement): void {
        const section = container.createDiv({ cls: 'style-section' });
        section.createEl('h4', { text: 'UI元素样式变量' });
        
        // 圆角
        const radiusSection = section.createDiv({ cls: 'ui-section' });
        radiusSection.createEl('h5', { text: '圆角变量' });
        
        const radiusGrid = radiusSection.createDiv({ cls: 'radius-grid' });
        this.createRadiusItem(radiusGrid, '--radius-s', '小圆角 (按钮等)');
        this.createRadiusItem(radiusGrid, '--radius-m', '中圆角 (卡片等)');
        this.createRadiusItem(radiusGrid, '--radius-l', '大圆角 (模态框等)');
        
        // 动画时间
        const animSection = section.createDiv({ cls: 'ui-section' });
        animSection.createEl('h5', { text: '动画过渡时间' });
        animSection.createEl('div', { 
            text: '--anim-duration-{s,m,l,xl} - 不同长度的动画持续时间变量', 
            cls: 'var-explanation'
        });
    }
    
    /**
     * 创建圆角样本
     */
    private static createRadiusItem(container: HTMLElement, variable: string, description: string): void {
        const item = container.createDiv({ cls: 'radius-item' });
        
        // 圆角示例框
        const box = item.createDiv({ cls: 'radius-box' });
        box.style.borderRadius = `var(${variable})`;
        
        // 变量名与描述
        const details = item.createDiv({ cls: 'radius-details' });
        details.createEl('div', { text: variable, cls: 'var-name' });
        details.createEl('div', { text: description, cls: 'var-desc' });
        
        // 单击复制变量名
        item.addEventListener('click', () => {
            navigator.clipboard.writeText(variable);
            new Notice(`已复制: ${variable}`);
        });
    }
    
    /**
     * 添加样式表
     */
    private static addStyles(): void {
        // 避免重复添加样式
        if (!document.getElementById('obsidian-style-tab-styles')) {
            const style = document.head.createEl('style');
            style.id = 'obsidian-style-tab-styles';
            style.textContent = `
                .style-section {
                    margin-bottom: 30px;
                }
                
                .color-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .color-item {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    border-radius: var(--radius-s);
                    transition: background-color 0.2s ease;
                    cursor: pointer;
                }
                
                .color-item:hover {
                    background-color: var(--background-modifier-hover);
                }
                
                .color-box {
                    width: 30px;
                    height: 30px;
                    border-radius: var(--radius-s);
                    border: 1px solid var(--background-modifier-border);
                    margin-right: 10px;
                }
                
                .color-details {
                    flex: 1;
                }
                
                /* 确保所有变量名使用等宽字体 */
                .var-name {
                    font-family: var(--font-monospace);
                    font-size: 13px;
                    color: var(--text-accent);
                    letter-spacing: -0.3px;
                    line-height: 1.4;
                }
                
                .var-desc {
                    font-size: 12px;
                    color: var(--text-muted);
                }
                
                .typography-section {
                    margin-bottom: 20px;
                }
                
                .typography-demo {
                    margin: 10px 0;
                    padding: 8px;
                    border-radius: var(--radius-s);
                    border: 1px dashed var(--background-modifier-border);
                }
                
                .typography-demo.heading1 {
                    font-size: var(--h1-size);
                    font-weight: var(--h1-weight);
                }
                
                .typography-demo.heading2 {
                    font-size: var(--h2-size);
                    font-weight: var(--h2-weight);
                }
                
                .typography-demo.heading3 {
                    font-size: var(--h3-size);
                    font-weight: var(--h3-weight);
                }
                
                /* 调整等宽字体样式 */
                .typography-demo.text-mono {
                    font-family: var(--font-monospace);
                    font-size: var(--font-monospace-size);
                    line-height: 1.5;
                    letter-spacing: -0.3px;
                }
                
                .ui-section {
                    margin-bottom: 20px;
                }
                
                .radius-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .radius-item {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    border-radius: var(--radius-s);
                    transition: background-color 0.2s ease;
                    cursor: pointer;
                }
                
                .radius-item:hover {
                    background-color: var(--background-modifier-hover);
                }
                
                .radius-box {
                    width: 30px;
                    height: 30px;
                    background-color: var(--interactive-accent);
                    margin-right: 10px;
                }
                
                /* 调整变量说明样式为等宽字体 */
                .var-explanation {
                    font-family: var(--font-monospace);
                    font-size: 13px;
                    color: var(--text-muted);
                    padding: 8px;
                    background-color: var(--background-secondary);
                    border-radius: var(--radius-s);
                    line-height: 1.4;
                    letter-spacing: -0.3px;
                }
                
                /* 为所有代码样式元素添加统一的样式 */
                [class*="var-"], .typography-demo.text-mono, .var-explanation {
                    font-family: var(--font-monospace);
                    letter-spacing: -0.3px;
                }
            `;
        }
    }
}
