import { Notice, setIcon } from "obsidian";
import { ObsidianUI } from "../components/bottom";

/**
 * 按钮标签页内容生成器
 */
export class ButtonTab {
    /**
     * 创建按钮标签页内容
     * @param container 容器元素
     */
    static create(container: HTMLElement): void {
        // 添加标题和说明
        container.createEl('h3', { text: '按钮组件' });
        container.createEl('p', { text: '以下是Obsidian风格的各种按钮示例' });
        
        // 添加分割线
        container.createEl('hr');
        
        // 添加特色卡片式组件 - 新添加的内容
        this.createFeatureCard(container);
        
        // 基础按钮部分
        const basicSection = container.createDiv({ cls: 'button-section' });
        basicSection.createEl('h4', { text: '基础按钮' });
        
        // 普通按钮
        const normalBtnContainer = basicSection.createDiv({ cls: 'example-row' });
        normalBtnContainer.createSpan({ text: '普通按钮: ', cls: 'label' });
        ObsidianUI.createButton(
            normalBtnContainer, 
            '普通按钮', 
            () => new Notice('点击了普通按钮')
        );
        
        // 强调按钮
        const primaryBtnContainer = basicSection.createDiv({ cls: 'example-row' });
        primaryBtnContainer.createSpan({ text: '强调按钮: ', cls: 'label' });
        ObsidianUI.createButton(
            primaryBtnContainer, 
            '强调按钮', 
            () => new Notice('点击了强调按钮'), 
            true
        );
        
        // 带图标的按钮部分
        const iconSection = container.createDiv({ cls: 'button-section' });
        iconSection.createEl('h4', { text: '带图标的按钮' });
        
        // 带图标的普通按钮
        const normalIconBtnContainer = iconSection.createDiv({ cls: 'example-row' });
        normalIconBtnContainer.createSpan({ text: '带图标的普通按钮: ', cls: 'label' });
        ObsidianUI.createButton(
            normalIconBtnContainer, 
            '保存', 
            () => new Notice('点击了保存按钮'), 
            false, 
            'save'
        );
        
        // 带图标的强调按钮
        const primaryIconBtnContainer = iconSection.createDiv({ cls: 'example-row' });
        primaryIconBtnContainer.createSpan({ text: '带图标的强调按钮: ', cls: 'label' });
        ObsidianUI.createButton(
            primaryIconBtnContainer, 
            '确认', 
            () => new Notice('点击了确认按钮'), 
            true, 
            'check'
        );
        
        // 仅图标按钮
        const iconOnlyBtnContainer = iconSection.createDiv({ cls: 'example-row' });
        iconOnlyBtnContainer.createSpan({ text: '仅图标按钮: ', cls: 'label' });
        const iconBtn = iconOnlyBtnContainer.createEl('button', { cls: 'clickable-icon' });
        setIcon(iconBtn, 'trash');
        iconBtn.addEventListener('click', () => new Notice('点击了删除按钮'));
        
        // 添加样式
        ButtonTab.addStyles();
        
        // 创建按钮组
        const buttonGroupSection = container.createDiv({ cls: 'button-section' });
        buttonGroupSection.createEl('h4', { text: '按钮组' });
        
        const buttonGroup = buttonGroupSection.createDiv({ cls: 'button-group' });
        ObsidianUI.createButton(buttonGroup, '上一步', () => new Notice('上一步'));
        ObsidianUI.createButton(buttonGroup, '下一步', () => new Notice('下一步'), true);
        
        // 添加按钮工具栏示例
        const toolbarSection = container.createDiv({ cls: 'button-section' });
        toolbarSection.createEl('h4', { text: '底部工具栏' });
        
        ObsidianUI.createBottomToolbar(toolbarSection, [
            { text: '取消', onClick: () => new Notice('取消操作') },
            { text: '重置', icon: 'reset', onClick: () => new Notice('重置操作') },
            { text: '保存', primary: true, icon: 'save', onClick: () => new Notice('保存成功') }
        ]);
    }
    
    /**
     * 创建特色卡片式组件
     * @param container 容器元素
     */
    private static createFeatureCard(container: HTMLElement): void {
        const featureSection = container.createDiv({ cls: 'feature-section' });
        featureSection.createEl('h4', { text: '特色组件: 交互式卡片按钮' });
        
        // 创建卡片容器
        const cardContainer = featureSection.createDiv({ cls: 'card-container' });
        
        // 创建三个卡片
        this.createCard(cardContainer, 'pencil', '编辑', '快速编辑当前笔记', () => {
            new Notice('进入编辑模式');
        });
        
        this.createCard(cardContainer, 'documents', '文档', '查看所有文档', () => {
            new Notice('打开文档列表');
        });
        
        this.createCard(cardContainer, 'settings', '设置', '配置插件选项', () => {
            new Notice('打开设置');
        });
        
        // 更新样式
        this.addFeatureStyles();
    }
    
    /**
     * 创建单个卡片
     */
    private static createCard(
        container: HTMLElement, 
        icon: string, 
        title: string, 
        description: string, 
        onClick: () => void
    ): HTMLElement {
        const card = container.createDiv({ cls: 'feature-card' });
        
        // 顶部图标
        const iconContainer = card.createDiv({ cls: 'card-icon' });
        setIcon(iconContainer, icon);
        
        // 标题
        card.createEl('h5', { text: title, cls: 'card-title' });
        
        // 描述
        card.createEl('p', { text: description, cls: 'card-description' });
        
        // 添加点击事件
        card.addEventListener('click', onClick);
        
        return card;
    }
    
    /**
     * 添加特色组件样式
     */
    private static addFeatureStyles(): void {
        // 避免重复添加样式
        if (!document.getElementById('feature-card-styles')) {
            const style = document.head.createEl('style');
            style.id = 'feature-card-styles';
            style.textContent = `
                .feature-section {
                    margin-bottom: 30px;
                }
                
                .card-container {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    margin-top: 15px;
                }
                
                .feature-card {
                    background-color: var(--background-secondary);
                    border-radius: var(--radius-m);
                    padding: 16px;
                    width: calc(33.33% - 10px);
                    min-width: 160px;
                    box-sizing: border-box;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
                    border: 1px solid var(--background-modifier-border);
                }
                
                .feature-card:hover {
                    transform: translateY(-3px);
                    background-color: var(--background-secondary-alt);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                
                .card-icon {
                    color: var(--interactive-accent);
                    font-size: 24px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background-color: var(--background-primary);
                    border-radius: 50%;
                }
                
                .card-title {
                    margin: 0 0 8px;
                    color: var(--text-normal);
                    font-size: 16px;
                }
                
                .card-description {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 12px;
                    line-height: 1.4;
                }
            `;
        }
    }
    
    /**
     * 添加样式
     */
    private static addStyles(): void {
        // 避免重复添加样式
        if (!document.getElementById('button-tab-styles')) {
            const style = document.head.createEl('style');
            style.id = 'button-tab-styles';
            style.textContent = `
                .button-section {
                    margin-bottom: 20px;
                }
                .example-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .example-row .label {
                    width: 150px;
                    color: var(--text-muted);
                }
                .clickable-icon {
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--text-normal);
                    padding: 4px;
                    border-radius: var(--radius-s);
                }
                .clickable-icon:hover {
                    background-color: var(--background-modifier-hover);
                }
            `;
        }
    }
}
