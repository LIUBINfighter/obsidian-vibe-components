import { setIcon } from "obsidian";

/**
 * Obsidian 风格UI组件库
 * 这个类提供了创建符合 Obsidian 设计规范的 UI 组件的方法
 */
export class ObsidianUI {
    /**
     * 创建一个 Obsidian 风格按钮
     * @param container 父容器元素
     * @param text 按钮文本
     * @param callback 点击回调函数
     * @param primary 是否为主要按钮 (使用accent颜色)
     * @param icon 可选的图标名称
     * @returns 创建的按钮元素
     */
    static createButton(
        container: HTMLElement,
        text: string,
        callback: (e: MouseEvent) => void,
        primary = false,
        icon?: string
    ): HTMLButtonElement {
        const button = container.createEl("button", {
            text: text,
            cls: primary ? "mod-cta" : "",
        });
        
        if (icon) {
            // 清除文本
            button.textContent = "";
            // 添加图标
            setIcon(button, icon);
            // 添加文本到span
            button.createSpan({ text });
        }
        
        button.addEventListener("click", callback);
        
        return button;
    }

    /**
     * 创建一个 Obsidian 风格输入框
     * @param container 父容器元素
     * @param placeholder 占位文本
     * @param value 初始值
     * @param onChange 值变化回调
     * @returns 创建的输入框元素
     */
    static createInput(
        container: HTMLElement,
        placeholder: string,
        value = "",
        onChange?: (value: string) => void
    ): HTMLInputElement {
        const input = container.createEl("input", {
            type: "text",
            placeholder: placeholder,
            value: value,
        });
        
        if (onChange) {
            input.addEventListener("input", () => {
                onChange(input.value);
            });
        }
        
        return input;
    }

    /**
     * 创建一个 Obsidian 风格多行文本输入框
     * @param container 父容器元素
     * @param placeholder 占位文本
     * @param value 初始值
     * @param onChange 值变化回调
     * @returns 创建的多行文本输入框元素
     */
    static createTextarea(
        container: HTMLElement,
        placeholder: string,
        value = "",
        onChange?: (value: string) => void
    ): HTMLTextAreaElement {
        const textarea = container.createEl("textarea", {
            placeholder: placeholder,
            text: value,
        });
        
        if (onChange) {
            textarea.addEventListener("input", () => {
                onChange(textarea.value);
            });
        }
        
        return textarea;
    }

    /**
     * 创建一个 Obsidian 风格下拉选择框
     * @param container 父容器元素
     * @param options 选项数组，{value, label} 格式
     * @param selectedValue 初始选中值
     * @param onChange 选择变化回调
     * @returns 创建的下拉选择框元素
     */
    static createSelect(
        container: HTMLElement,
        options: { value: string; label: string }[],
        selectedValue = "",
        onChange?: (value: string) => void
    ): HTMLSelectElement {
        const select = container.createEl("select");
        
        options.forEach((option) => {
            const optEl = select.createEl("option", {
                text: option.label,
                value: option.value,
            });
            
            if (option.value === selectedValue) {
                optEl.selected = true;
            }
        });
        
        if (onChange) {
            select.addEventListener("change", () => {
                onChange(select.value);
            });
        }
        
        return select;
    }

    /**
     * 创建一个 Obsidian 风格复选框
     * @param container 父容器元素
     * @param label 标签文本
     * @param checked 是否选中
     * @param onChange 状态变化回调
     * @returns 包含复选框的容器元素
     */
    static createCheckbox(
        container: HTMLElement,
        label: string,
        checked = false,
        onChange?: (checked: boolean) => void
    ): HTMLDivElement {
        const wrapper = container.createDiv({ cls: "setting-item" });
        const info = wrapper.createDiv({ cls: "setting-item-info" });
        info.createDiv({ text: label, cls: "setting-item-name" });
        
        const control = wrapper.createDiv({ cls: "setting-item-control" });
        const checkbox = control.createEl("input", {
            type: "checkbox",
            cls: "checkbox-container",
        });
        checkbox.checked = checked;
        
        if (onChange) {
            checkbox.addEventListener("change", () => {
                onChange(checkbox.checked);
            });
        }
        
        return wrapper;
    }

    /**
     * 创建一个 Obsidian 风格开关
     * @param container 父容器元素
     * @param label 标签文本
     * @param checked 是否打开
     * @param onChange 状态变化回调
     * @returns 包含开关的容器元素
     */
    static createToggle(
        container: HTMLElement,
        label: string,
        checked = false,
        onChange?: (checked: boolean) => void
    ): HTMLDivElement {
        const wrapper = container.createDiv({ cls: "setting-item" });
        const info = wrapper.createDiv({ cls: "setting-item-info" });
        info.createDiv({ text: label, cls: "setting-item-name" });
        
        const control = wrapper.createDiv({ cls: "setting-item-control" });
        const toggleContainer = control.createDiv({ cls: "checkbox-container" });
        
        const toggle = toggleContainer.createEl("input", {
            type: "checkbox",
            cls: "checkbox",
        });
        toggle.checked = checked;
        
        toggleContainer.createDiv({ cls: "checkbox-slider" });
        
        if (onChange) {
            toggle.addEventListener("change", () => {
                onChange(toggle.checked);
            });
        }
        
        return wrapper;
    }

    /**
     * 创建一个 Obsidian 风格标签页组
     * @param container 父容器元素
     * @param tabs 标签页配置 {id, label, content}
     * @returns 包含标签页的容器元素
     */
    static createTabs(
        container: HTMLElement,
        tabs: { id: string; label: string; content: (el: HTMLElement) => void }[]
    ): HTMLDivElement {
        const wrapper = container.createDiv({ cls: "vibe-tabs" });
        const tabsHeader = wrapper.createDiv({ cls: "nav-buttons-container" });
        const tabsContent = wrapper.createDiv({ cls: "vibe-tab-content" });
        
        // 为确保风格一致，添加样式
        const style = document.head.createEl("style");
        style.textContent = `
            .vibe-tabs .nav-buttons-container {
                display: flex;
                border-bottom: 1px solid var(--tab-divider-color);
                margin-bottom: 8px;
            }
            .vibe-tabs .nav-button {
                padding: 6px 12px;
                margin-right: 4px;
                cursor: pointer;
                color: var(--text-normal);
                border-radius: var(--radius-s) var(--radius-s) 0 0;
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
        `;
        
        const tabPanes: Record<string, HTMLDivElement> = {};
        
        tabs.forEach((tab, index) => {
            const tabBtn = tabsHeader.createDiv({
                text: tab.label,
                cls: `nav-button ${index === 0 ? "is-active" : ""}`,
                attr: { "data-tab": tab.id },
            });
            
            const tabPane = tabsContent.createDiv({
                cls: `vibe-tab-pane ${index === 0 ? "is-active" : ""}`,
                attr: { "data-tab-id": tab.id },
            });
            
            tabPanes[tab.id] = tabPane;
            
            // 添加内容
            tab.content(tabPane);
            
            // 点击切换标签页
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
            });
        });
        
        return wrapper;
    }

    /**
     * 创建一个列表
     * @param container 父容器元素
     * @param items 列表项配置
     * @returns 创建的列表元素
     */
    static createList(
        container: HTMLElement,
        items: { text: string; icon?: string; onClick?: () => void }[]
    ): HTMLElement {
        const list = container.createEl("ul", { cls: "nav-folder-children" });
        
        items.forEach((item) => {
            const li = list.createEl("li", { cls: "nav-file" });
            const link = li.createEl("div", { cls: "nav-file-title" });
            
            if (item.icon) {
                const iconDiv = link.createDiv({ cls: "nav-file-title-content" });
                setIcon(iconDiv, item.icon);
                iconDiv.createSpan({ text: item.text });
            } else {
                link.createDiv({ text: item.text, cls: "nav-file-title-content" });
            }
            
            if (item.onClick) {
                link.addEventListener("click", item.onClick);
                link.addClass("clickable-icon");
            }
        });
        
        return list;
    }

    /**
     * 创建一个包含按钮的底部工具栏
     * @param container 父容器元素
     * @param buttons 按钮配置
     * @returns 创建的工具栏元素
     */
    static createBottomToolbar(
        container: HTMLElement,
        buttons: { text: string; icon?: string; primary?: boolean; onClick: () => void }[]
    ): HTMLElement {
        const toolbar = container.createDiv({ cls: "status-bar" });
        
        buttons.forEach((btn) => {
            this.createButton(
                toolbar,
                btn.text,
                () => btn.onClick(),
                btn.primary || false,
                btn.icon
            );
        });
        
        return toolbar;
    }
}

/**
 * 使用示例:
 * 
 * // 1. 引入组件库
 * import { ObsidianUI } from './components/bottom';
 * 
 * // 2. 创建组件
 * const container = document.createElement('div');
 * 
 * // 创建按钮
 * ObsidianUI.createButton(container, '保存', () => {
 *     console.log('保存按钮被点击');
 * }, true, 'save');
 * 
 * // 创建输入框
 * const input = ObsidianUI.createInput(container, '请输入名称', '', (value) => {
 *     console.log('输入值:', value);
 * });
 * 
 * // 创建下拉框
 * ObsidianUI.createSelect(
 *     container,
 *     [
 *         { value: 'option1', label: '选项1' },
 *         { value: 'option2', label: '选项2' }
 *     ],
 *     'option1',
 *     (value) => console.log('选择了:', value)
 * );
 * 
 * // 创建标签页
 * ObsidianUI.createTabs(container, [
 *     {
 *         id: 'tab1',
 *         label: '标签1',
 *         content: (el) => {
 *             el.createEl('h3', { text: '标签1内容' });
 *         }
 *     },
 *     {
 *         id: 'tab2',
 *         label: '标签2',
 *         content: (el) => {
 *             el.createEl('h3', { text: '标签2内容' });
 *         }
 *     }
 * ]);
 * 
 * // 创建底部工具栏
 * ObsidianUI.createBottomToolbar(container, [
 *     { text: '取消', onClick: () => console.log('取消') },
 *     { text: '确认', primary: true, onClick: () => console.log('确认') }
 * ]);
 */
