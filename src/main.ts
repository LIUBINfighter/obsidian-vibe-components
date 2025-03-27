import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { VIBE_COMPONENTS_VIEW_TYPE, VibeComponentsView } from './componets-view';

interface VibeComponentsSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: VibeComponentsSettings = {
	mySetting: 'default'
}

export default class VibeComponents extends Plugin {
	settings: VibeComponentsSettings;
    private view: VibeComponentsView;

	async onload() {
		await this.loadSettings();
        
        // 注册视图
        this.registerView(
            VIBE_COMPONENTS_VIEW_TYPE,
            (leaf) => (this.view = new VibeComponentsView(leaf))
        );

        // 添加ribbon图标
        this.addRibbonIcon('package', 'Vibe Components', async () => {
            await this.activateView();
        });

        // 添加命令
        this.addCommand({
            id: 'open-vibe-components-view',
            name: '打开组件视图',
            callback: async () => {
                await this.activateView();
            }
        });
	}

    // 激活视图的方法
    async activateView() {
        const { workspace } = this.app;
        
        // 如果视图已经打开，聚焦到它
        if (workspace.getLeavesOfType(VIBE_COMPONENTS_VIEW_TYPE).length > 0) {
            workspace.revealLeaf(
                workspace.getLeavesOfType(VIBE_COMPONENTS_VIEW_TYPE)[0]
            );
            return;
        }

		// 在工作区创建新视图
		await workspace.getLeaf(true).setViewState({
			type: VIBE_COMPONENTS_VIEW_TYPE,
			active: true,
		});
        
        workspace.revealLeaf(
            workspace.getLeavesOfType(VIBE_COMPONENTS_VIEW_TYPE)[0]
        );
    }

	onunload() {
        // 卸载插件时，卸载视图
        this.app.workspace.detachLeavesOfType(VIBE_COMPONENTS_VIEW_TYPE);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
