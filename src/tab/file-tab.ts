import { App, TFile } from "obsidian";

export class FileTab {
    private container: HTMLElement;
    private app: App;
    private inputEl: HTMLInputElement;
    private resultsContainerEl: HTMLElement;
    private inputEl2: HTMLInputElement;
    private resultsContainerEl2: HTMLElement;
    private selectedItemIndex: number = -1;

    constructor(container: HTMLElement, app: App) {
        this.container = container;
        this.app = app;
        this.container.empty(); // 清空容器

        // 添加说明文字
        this.container.createEl("p", { text: "点击结果跳转到文件:", cls: 'file-tab-description' });

        this.inputEl = this.createInput(this.searchFiles.bind(this));
        this.resultsContainerEl = this.createResultsContainer();

        this.container.appendChild(this.inputEl);
        this.container.appendChild(this.resultsContainerEl);

        // 添加说明文字
        this.container.createEl("p", { text: "点击结果将文件名补充到输入框:", cls: 'file-tab-description' });

        this.inputEl2 = this.createInput(this.searchFiles2.bind(this));
        this.resultsContainerEl2 = this.createResultsContainer();

        this.container.appendChild(this.inputEl2);
        this.container.appendChild(this.resultsContainerEl2);

        // 添加鼠标聚焦和失焦事件
        this.container.addEventListener("mouseleave", () => {
            this.hideResults(this.resultsContainerEl);
            this.hideResults(this.resultsContainerEl2);
        });

        // 添加键盘事件监听
        this.container.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key === "ArrowDown") {
                this.moveSelection(1, this.resultsContainerEl);
            } else if (event.key === "ArrowUp") {
                this.moveSelection(-1, this.resultsContainerEl);
            } else if (event.key === "Enter") {
                this.selectItem(this.resultsContainerEl, this.inputEl, false);
            }
        });
        this.container.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key === "ArrowDown") {
                this.moveSelection(1, this.resultsContainerEl2);
            } else if (event.key === "ArrowUp") {
                this.moveSelection(-1, this.resultsContainerEl2);
            } else if (event.key === "Enter") {
                this.selectItem(this.resultsContainerEl2, this.inputEl2, true);
            }
        });
    }

    private createInput(searchFunction: (query: string) => void): HTMLInputElement {
        const inputEl = document.createElement("input");
        inputEl.type = "text";
        inputEl.placeholder = "输入文件名...";
        inputEl.className = "file-input";

        inputEl.addEventListener("input", () => {
            searchFunction(inputEl.value);
        });

        return inputEl;
    }

    private createResultsContainer(): HTMLElement {
        const resultsContainerEl = document.createElement("div");
        resultsContainerEl.className = "file-results-container";
        return resultsContainerEl;
    }

    private searchFiles(query: string): void {
        this.selectedItemIndex = -1; // 重置选择项
        this.resultsContainerEl.empty();
        this.showResults(this.resultsContainerEl); // 显示结果

        if (!query) {
            return;
        }

        const files = this.app.vault.getMarkdownFiles();
        const filteredFiles = files.filter((file: TFile) =>
            file.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredFiles.length === 0) {
            this.resultsContainerEl.createEl("p", { text: "未找到文件", cls: 'no-result' });
            return;
        }

        filteredFiles.forEach((file: TFile, index: number) => {
            const fileItemEl = this.resultsContainerEl.createEl("div", {
                cls: "file-item",
            });
            fileItemEl.textContent = file.name;
            fileItemEl.addEventListener("click", () => {
                this.app.workspace.openLinkText(file.path, '', false);
            });
            fileItemEl.addEventListener("mouseover", () => {
                this.selectedItemIndex = index;
                this.highlightItem(this.resultsContainerEl);
            });
        });
    }

    private searchFiles2(query: string): void {
        this.selectedItemIndex = -1; // 重置选择项
        this.resultsContainerEl2.empty();
        this.showResults(this.resultsContainerEl2); // 显示结果

        if (!query) {
            return;
        }

        const files = this.app.vault.getMarkdownFiles();
        const filteredFiles = files.filter((file: TFile) =>
            file.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredFiles.length === 0) {
            this.resultsContainerEl2.createEl("p", { text: "未找到文件", cls: 'no-result' });
            return;
        }

        filteredFiles.forEach((file: TFile, index: number) => {
            const fileItemEl = this.resultsContainerEl2.createEl("div", {
                cls: "file-item",
            });
            fileItemEl.textContent = file.name;
            fileItemEl.addEventListener("click", () => {
                this.inputEl2.value = file.name;
            });
            fileItemEl.addEventListener("mouseover", () => {
                this.selectedItemIndex = index;
                this.highlightItem(this.resultsContainerEl2);
            });
        });
    }

    // 显示结果
    private showResults(container: HTMLElement): void {
        container.style.display = 'block';
    }

    // 隐藏结果
    private hideResults(container: HTMLElement): void {
        container.style.display = 'none';
    }

    // 移动选择项
    private moveSelection(direction: number, containerEl: HTMLElement): void {
        if (containerEl === this.resultsContainerEl) {
            const fileItemEls = containerEl.querySelectorAll(".file-item");
            if (fileItemEls.length === 0) return;

            this.selectedItemIndex += direction;

            if (this.selectedItemIndex < 0) {
                this.selectedItemIndex = fileItemEls.length - 1;
            } else if (this.selectedItemIndex >= fileItemEls.length) {
                this.selectedItemIndex = 0;
            }
            this.highlightItem(containerEl);
        } else if (containerEl === this.resultsContainerEl2) {
            const fileItemEls = containerEl.querySelectorAll(".file-item");
            if (fileItemEls.length === 0) return;

            this.selectedItemIndex += direction;

            if (this.selectedItemIndex < 0) {
                this.selectedItemIndex = fileItemEls.length - 1;
            } else if (this.selectedItemIndex >= fileItemEls.length) {
                this.selectedItemIndex = 0;
            }
            this.highlightItem(containerEl);
        }
    }

    // 高亮显示选择项
    private highlightItem(containerEl: HTMLElement): void {
        if (containerEl === this.resultsContainerEl) {
            const fileItemEls = containerEl.querySelectorAll(".file-item");
            fileItemEls.forEach((el, index) => {
                if (index === this.selectedItemIndex) {
                    el.classList.add("is-selected");
                } else {
                    el.classList.remove("is-selected");
                }
            });
        } else if (containerEl === this.resultsContainerEl2) {
            const fileItemEls = containerEl.querySelectorAll(".file-item");
            fileItemEls.forEach((el, index) => {
                if (index === this.selectedItemIndex) {
                    el.classList.add("is-selected");
                } else {
                    el.classList.remove("is-selected");
                }
            });
        }
    }

    // 选择项目
    private selectItem(containerEl: HTMLElement, inputEl: HTMLInputElement, isInput2: boolean): void {
        if (containerEl === this.resultsContainerEl) {
            const fileItemEls = containerEl.querySelectorAll(".file-item");
            if (this.selectedItemIndex >= 0 && this.selectedItemIndex < fileItemEls.length) {
                const selectedEl = fileItemEls[this.selectedItemIndex] as HTMLDivElement;
                if (!isInput2) {
                    this.app.workspace.openLinkText(selectedEl.textContent, '', false);
                }
                this.hideResults(containerEl);
            }
        } else if (containerEl === this.resultsContainerEl2) {
            const fileItemEls = containerEl.querySelectorAll(".file-item");
            if (this.selectedItemIndex >= 0 && this.selectedItemIndex < fileItemEls.length) {
                const selectedEl = fileItemEls[this.selectedItemIndex] as HTMLDivElement;
                inputEl.value = selectedEl.textContent;
                this.hideResults(containerEl);
            }
        }
    }

    static create(container: HTMLElement, app: App): void {
        new FileTab(container, app);
    }
}
