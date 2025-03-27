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
